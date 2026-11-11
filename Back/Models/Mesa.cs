namespace ServiTable.Api.Models;

public class Mesa
{
    public int IdMesa { get; set; }
    public int IdRestaurante { get; set; }
    public int Numero { get; set; }
    public string Estado { get; set; } = string.Empty;
}
