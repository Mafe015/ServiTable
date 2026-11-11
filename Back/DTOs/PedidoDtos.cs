namespace ServiTable.Api.DTOs;

// ---- Entrada: POST /api/pedidos ----
// El frontend envía: { "mesa": "5", "items": [ { "productoId": 1, "cantidad": 2 } ] }
public record CrearPedidoRequest(int Mesa, List<ItemPedidoRequest>? Items);
public record ItemPedidoRequest(int ProductoId, int Cantidad);

// ---- Salida ----
// POST -> 201 { id, estado, total }
public record PedidoCreadoDto(int Id, string Estado, decimal Total);

// GET /api/pedidos/{id} -> 200
public record PedidoDetalleDto(
    int Id, int Mesa, string Estado, string EstadoCodigo, decimal Total,
    DateTime CreadoEn, IReadOnlyList<ItemPedidoDto> Items);

public record ItemPedidoDto(int ProductoId, string Nombre, int Cantidad, decimal PrecioUnitario, decimal Subtotal);
