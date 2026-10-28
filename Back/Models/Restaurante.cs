namespace ServiTable.Api.Models;
public class Restaurante
{
    public int IdRestaurante { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Nit { get; set; }
    public string? Direccion { get; set; }
    public string? Telefono { get; set; }
    public DateTime CreadoEn { get; set; }
    public ICollection<Categoria> Categorias { get; set; } = new List<Categoria>();
}
