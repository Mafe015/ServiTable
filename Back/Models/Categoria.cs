namespace ServiTable.Api.Models;
public class Categoria
{
    public int IdCategoria { get; set; }
    public int IdRestaurante { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int Orden { get; set; }
    public Restaurante Restaurante { get; set; } = null!;
    public ICollection<Producto> Productos { get; set; } = new List<Producto>();
}
