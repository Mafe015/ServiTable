namespace ServiTable.Api.Models;

public class Pedido
{
    public int IdPedido { get; set; }
    public int IdRestaurante { get; set; }
    public int IdMesa { get; set; }
    public string Estado { get; set; } = EstadoPedido.Recibido;
    public decimal Total { get; set; }
    public DateTime CreadoEn { get; set; }
    public Mesa Mesa { get; set; } = null!;
    public ICollection<DetallePedido> Detalles { get; set; } = new List<DetallePedido>();
}
