using System.Globalization;
using ServiTable.Api.DTOs;
using ServiTable.Api.Services;

namespace ServiTable.Api.Endpoints;

public static class PedidoEndpoints
{
    public static IEndpointRouteBuilder MapPedidos(this IEndpointRouteBuilder app)
    {
        var grupo = app.MapGroup("/api/pedidos").WithTags("Pedidos");

        // US-2 · Registrar pedido
        grupo.MapPost("/", async (CrearPedidoRequest? request, IPedidoService servicio, CancellationToken ct) =>
        {
            var r = await servicio.RegistrarAsync(request, ct);
            return r.Tipo switch
            {
                ResultadoTipo.Creado => Results.Created($"/api/pedidos/{r.Pedido!.Id}", r.Pedido),
                ResultadoTipo.MesaNoEncontrada => Results.NotFound(new { mensaje = "No existe la mesa indicada." }),
                _ => Results.BadRequest(new { mensaje = "El pedido no es válido.", errores = r.Errores })
            };
        })
        .WithName("RegistrarPedido")
        .Produces<PedidoCreadoDto>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound);

        // US-3 · Consultar estado del pedido
        grupo.MapGet("/{id}", async (string id, IPedidoService servicio, CancellationToken ct) =>
        {
            // Un ID que no es un número positivo se trata igual que uno inexistente (404).
            if (!int.TryParse(id, NumberStyles.None, CultureInfo.InvariantCulture, out var numero) || numero <= 0)
                return Results.NotFound(new { mensaje = "No existe un pedido con ese número." });

            var pedido = await servicio.ConsultarAsync(numero, ct);
            return pedido is null
                ? Results.NotFound(new { mensaje = "No existe un pedido con ese número." })
                : Results.Ok(pedido);
        })
        .WithName("ConsultarPedido")
        .Produces<PedidoDetalleDto>()
        .Produces(StatusCodes.Status404NotFound);

        return app;
    }
}
