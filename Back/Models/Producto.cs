namespace ServiTable.Api.Models;
public class Producto
{
    public int IdProducto { get; set; }
    public int IdRestaurante { get; set; }
    public int IdCategoria { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public decimal Precio { get; set; }
    public string? ImagenUrl { get; set; }
    public bool Disponible { get; set; }
    public Restaurante Restaurante { get; set; } = null!;
    public Categoria Categoria { get; set; } = null!;
}
