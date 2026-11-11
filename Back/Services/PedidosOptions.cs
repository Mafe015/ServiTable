namespace ServiTable.Api.Services;

public class PedidosOptions
{
    /// <summary>Restaurante al que pertenecen las mesas y productos de los pedidos (el frontend usa el 1).</summary>
    public int IdRestaurante { get; set; } = 1;
}
