using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ServiTable.Api.Data;
using ServiTable.Api.DTOs;
using ServiTable.Api.Models;
using ServiTable.Api.Services;

namespace ServiTable.Api.Tests;

public class PedidoServiceTests
{
    private const int Limonada = 1, Hamburguesa = 2, Papas = 3, Agotado = 4;

    private static (PedidoService servicio, ServiTableDbContext db) Crear()
    {
        var opciones = new DbContextOptionsBuilder<ServiTableDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
        var db = new ServiTableDbContext(opciones);

        db.Restaurantes.Add(new Restaurante { IdRestaurante = 1, Nombre = "Demo" });
        db.Categorias.Add(new Categoria { IdCategoria = 1, IdRestaurante = 1, Nombre = "Comidas" });
        db.Mesas.Add(new Mesa { IdMesa = 1, IdRestaurante = 1, Numero = 5, Estado = "disponible" });
        db.Productos.AddRange(
            new Producto { IdProducto = Limonada, IdRestaurante = 1, IdCategoria = 1, Nombre = "Limonada", Precio = 5000, Disponible = true },
            new Producto { IdProducto = Hamburguesa, IdRestaurante = 1, IdCategoria = 1, Nombre = "Hamburguesa", Precio = 18000, Disponible = true },
            new Producto { IdProducto = Papas, IdRestaurante = 1, IdCategoria = 1, Nombre = "Papas", Precio = 7000, Disponible = true },
            new Producto { IdProducto = Agotado, IdRestaurante = 1, IdCategoria = 1, Nombre = "Agotado", Precio = 9000, Disponible = false });
        db.SaveChanges();

        return (new PedidoService(db, Options.Create(new PedidosOptions { IdRestaurante = 1 })), db);
    }

    private static CrearPedidoRequest Pedido(int mesa, params (int producto, int cantidad)[] items) =>
        new(mesa, items.Select(i => new ItemPedidoRequest(i.producto, i.cantidad)).ToList());

    // ---------- US-2 · Registrar pedidos ----------

    [Fact]
    public async Task Registrar_pedido_valido_devuelve_id_estado_y_total_calculado()
    {
        var (servicio, db) = Crear();

        var r = await servicio.RegistrarAsync(Pedido(5, (Limonada, 2), (Hamburguesa, 1)));

        Assert.Equal(ResultadoTipo.Creado, r.Tipo);
        Assert.True(r.Pedido!.Id > 0);
        Assert.Equal("Recibido", r.Pedido.Estado);
        Assert.Equal(28000m, r.Pedido.Total); // 2×5000 + 1×18000

        var guardado = await db.Pedidos.Include(p => p.Detalles).SingleAsync();
        Assert.Equal("recibido", guardado.Estado);
        Assert.Equal(2, guardado.Detalles.Count);
        Assert.Equal(28000m, guardado.Detalles.Sum(d => d.Subtotal));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-3)]
    public async Task Registrar_con_cantidad_cero_o_negativa_es_invalido_y_no_guarda(int cantidad)
    {
        var (servicio, db) = Crear();

        var r = await servicio.RegistrarAsync(Pedido(5, (Limonada, cantidad)));

        Assert.Equal(ResultadoTipo.Invalido, r.Tipo);
        Assert.NotEmpty(r.Errores!);
        Assert.Empty(db.Pedidos);
    }

    [Fact]
    public async Task Registrar_sin_productos_es_invalido()
    {
        var (servicio, db) = Crear();

        var r = await servicio.RegistrarAsync(new CrearPedidoRequest(5, new List<ItemPedidoRequest>()));

        Assert.Equal(ResultadoTipo.Invalido, r.Tipo);
        Assert.Empty(db.Pedidos);
    }

    [Fact]
    public async Task Registrar_con_cuerpo_nulo_es_invalido()
    {
        var (servicio, _) = Crear();
        var r = await servicio.RegistrarAsync(null);
        Assert.Equal(ResultadoTipo.Invalido, r.Tipo);
    }

    [Fact]
    public async Task Registrar_con_producto_inexistente_es_invalido()
    {
        var (servicio, db) = Crear();

        var r = await servicio.RegistrarAsync(Pedido(5, (999, 1)));

        Assert.Equal(ResultadoTipo.Invalido, r.Tipo);
        Assert.Empty(db.Pedidos);
    }

    [Fact]
    public async Task Registrar_con_producto_no_disponible_es_invalido()
    {
        var (servicio, db) = Crear();

        var r = await servicio.RegistrarAsync(Pedido(5, (Agotado, 1)));

        Assert.Equal(ResultadoTipo.Invalido, r.Tipo);
        Assert.Empty(db.Pedidos);
    }

    [Fact]
    public async Task Registrar_con_mesa_inexistente_devuelve_mesa_no_encontrada()
    {
        var (servicio, db) = Crear();

        var r = await servicio.RegistrarAsync(Pedido(77, (Limonada, 1)));

        Assert.Equal(ResultadoTipo.MesaNoEncontrada, r.Tipo);
        Assert.Empty(db.Pedidos);
    }

    [Fact]
    public async Task Registrar_con_cantidad_sobre_el_maximo_es_invalido()
    {
        var (servicio, _) = Crear();

        var r = await servicio.RegistrarAsync(Pedido(5, (Limonada, PedidoService.CantidadMaximaPorProducto + 1)));

        Assert.Equal(ResultadoTipo.Invalido, r.Tipo);
    }

    [Fact]
    public async Task Registrar_producto_repetido_suma_las_cantidades_en_una_sola_linea()
    {
        var (servicio, db) = Crear();

        var r = await servicio.RegistrarAsync(Pedido(5, (Papas, 1), (Papas, 2)));

        Assert.Equal(ResultadoTipo.Creado, r.Tipo);
        Assert.Equal(21000m, r.Pedido!.Total);
        var detalle = await db.DetallesPedido.SingleAsync();
        Assert.Equal(3, detalle.Cantidad);
    }

    // ---------- US-3 · Consultar estado ----------

    [Fact]
    public async Task Consultar_pedido_existente_devuelve_su_estado_y_detalle()
    {
        var (servicio, _) = Crear();
        var creado = await servicio.RegistrarAsync(Pedido(5, (Limonada, 2)));

        var pedido = await servicio.ConsultarAsync(creado.Pedido!.Id);

        Assert.NotNull(pedido);
        Assert.Equal(creado.Pedido.Id, pedido!.Id);
        Assert.Equal("Recibido", pedido.Estado);
        Assert.Equal("recibido", pedido.EstadoCodigo);
        Assert.Equal(5, pedido.Mesa);
        Assert.Equal(10000m, pedido.Total);
        var item = Assert.Single(pedido.Items);
        Assert.Equal("Limonada", item.Nombre);
        Assert.Equal(2, item.Cantidad);
    }

    [Fact]
    public async Task Consultar_id_inexistente_devuelve_null()
    {
        var (servicio, _) = Crear();
        Assert.Null(await servicio.ConsultarAsync(12345));
    }

    [Fact]
    public async Task Consultar_refleja_el_estado_guardado_en_la_base_de_datos()
    {
        var (servicio, db) = Crear();
        var creado = await servicio.RegistrarAsync(Pedido(5, (Hamburguesa, 1)));
        var pedidoDb = await db.Pedidos.SingleAsync();
        pedidoDb.Estado = EstadoPedido.EnPreparacion;
        await db.SaveChangesAsync();

        var pedido = await servicio.ConsultarAsync(creado.Pedido!.Id);

        Assert.Equal("En preparación", pedido!.Estado);
    }
}
