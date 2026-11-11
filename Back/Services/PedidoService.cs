using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ServiTable.Api.Data;
using ServiTable.Api.DTOs;
using ServiTable.Api.Models;

namespace ServiTable.Api.Services;

public class PedidoService : IPedidoService
{
    public const int CantidadMaximaPorProducto = 99;

    private readonly ServiTableDbContext _db;
    private readonly int _idRestaurante;

    public PedidoService(ServiTableDbContext db, IOptions<PedidosOptions> options)
    {
        _db = db;
        _idRestaurante = options.Value.IdRestaurante;
    }

    public async Task<ResultadoRegistro> RegistrarAsync(CrearPedidoRequest? request, CancellationToken ct = default)
    {
        // 1) Validaciones de entrada (no tocan la base de datos).
        if (request is null || request.Items is null || request.Items.Count == 0)
            return Invalido("El pedido debe incluir al menos un producto.");

        var errores = new List<string>();
        if (request.Mesa <= 0) errores.Add("El número de mesa no es válido.");

        foreach (var item in request.Items)
        {
            if (item is null) { errores.Add("Hay un producto vacío en el pedido."); continue; }
            if (item.ProductoId <= 0) errores.Add("El identificador de producto no es válido.");
            if (item.Cantidad <= 0)
                errores.Add($"La cantidad del producto {item.ProductoId} debe ser mayor que cero.");
        }
        if (errores.Count > 0) return Invalido(errores);

        // Si el mismo producto llega repetido, se suman las cantidades en una sola línea.
        var lineas = request.Items
            .GroupBy(i => i.ProductoId)
            .Select(g => new { ProductoId = g.Key, Cantidad = g.Sum(i => i.Cantidad) })
            .ToList();

        foreach (var l in lineas.Where(l => l.Cantidad > CantidadMaximaPorProducto))
            errores.Add($"La cantidad del producto {l.ProductoId} no puede superar {CantidadMaximaPorProducto}.");
        if (errores.Count > 0) return Invalido(errores);

        // 2) La mesa debe existir en el restaurante.
        var mesa = await _db.Mesas.AsNoTracking()
            .FirstOrDefaultAsync(m => m.IdRestaurante == _idRestaurante && m.Numero == request.Mesa, ct);
        if (mesa is null) return new ResultadoRegistro(ResultadoTipo.MesaNoEncontrada);

        // 3) Los productos se leen de la base de datos: el precio NUNCA se toma del cliente.
        var ids = lineas.Select(l => l.ProductoId).ToList();
        var productos = await _db.Productos.AsNoTracking()
            .Where(p => p.IdRestaurante == _idRestaurante && ids.Contains(p.IdProducto))
            .ToDictionaryAsync(p => p.IdProducto, ct);

        foreach (var l in lineas)
        {
            if (!productos.TryGetValue(l.ProductoId, out var p))
                errores.Add($"El producto {l.ProductoId} no existe.");
            else if (!p.Disponible)
                errores.Add($"El producto «{p.Nombre}» no está disponible.");
        }
        if (errores.Count > 0) return Invalido(errores);

        // 4) Se arma el pedido con su detalle y se calcula el total.
        var pedido = new Pedido
        {
            IdRestaurante = _idRestaurante,
            IdMesa = mesa.IdMesa,
            Estado = EstadoPedido.Recibido,
            CreadoEn = DateTime.Now
        };
        foreach (var l in lineas)
        {
            var precio = productos[l.ProductoId].Precio;
            pedido.Detalles.Add(new DetallePedido
            {
                IdProducto = l.ProductoId,
                Cantidad = l.Cantidad,
                PrecioUnitario = precio,
                Subtotal = precio * l.Cantidad
            });
        }
        pedido.Total = pedido.Detalles.Sum(d => d.Subtotal);

        // Un solo SaveChanges: el pedido y su detalle se guardan juntos o no se guarda nada.
        _db.Pedidos.Add(pedido);
        await _db.SaveChangesAsync(ct);

        return new ResultadoRegistro(ResultadoTipo.Creado,
            new PedidoCreadoDto(pedido.IdPedido, EstadoPedido.Etiqueta(pedido.Estado), pedido.Total));
    }

    public async Task<PedidoDetalleDto?> ConsultarAsync(int id, CancellationToken ct = default)
    {
        var p = await _db.Pedidos.AsNoTracking()
            .Where(x => x.IdPedido == id && x.IdRestaurante == _idRestaurante)
            .Select(x => new
            {
                x.IdPedido,
                Mesa = x.Mesa.Numero,
                x.Estado,
                x.Total,
                x.CreadoEn,
                Items = x.Detalles.OrderBy(d => d.IdDetalle)
                    .Select(d => new ItemPedidoDto(d.IdProducto, d.Producto.Nombre, d.Cantidad, d.PrecioUnitario, d.Subtotal))
                    .ToList()
            })
            .FirstOrDefaultAsync(ct);

        return p is null
            ? null
            : new PedidoDetalleDto(p.IdPedido, p.Mesa, EstadoPedido.Etiqueta(p.Estado), p.Estado, p.Total, p.CreadoEn, p.Items);
    }

    private static ResultadoRegistro Invalido(string error) => Invalido(new List<string> { error });
    private static ResultadoRegistro Invalido(IReadOnlyList<string> errores) =>
        new(ResultadoTipo.Invalido, null, errores);
}
