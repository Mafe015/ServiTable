using ServiTable.Api.DTOs;

namespace ServiTable.Api.Services;

public enum ResultadoTipo { Creado, Invalido, MesaNoEncontrada }

public record ResultadoRegistro(
    ResultadoTipo Tipo,
    PedidoCreadoDto? Pedido = null,
    IReadOnlyList<string>? Errores = null);

public interface IPedidoService
{
    /// <summary>US-2: valida, calcula el total con los precios de la base de datos y guarda el pedido.</summary>
    Task<ResultadoRegistro> RegistrarAsync(CrearPedidoRequest? request, CancellationToken ct = default);

    /// <summary>US-3: devuelve el pedido con su estado, o null si el ID no existe.</summary>
    Task<PedidoDetalleDto?> ConsultarAsync(int id, CancellationToken ct = default);
}
