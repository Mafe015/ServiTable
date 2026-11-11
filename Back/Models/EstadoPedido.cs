namespace ServiTable.Api.Models;

/// <summary>Estados permitidos de un pedido (deben coincidir con ck_pedido_estado en la base de datos).</summary>
public static class EstadoPedido
{
    public const string Recibido = "recibido";
    public const string EnPreparacion = "en_preparacion";
    public const string Listo = "listo";
    public const string Entregado = "entregado";
    public const string Cancelado = "cancelado";

    public static readonly IReadOnlyList<string> Valores =
        new[] { Recibido, EnPreparacion, Listo, Entregado, Cancelado };

    /// <summary>Texto que se muestra al comensal en la pantalla de seguimiento.</summary>
    public static string Etiqueta(string codigo) => codigo switch
    {
        Recibido => "Recibido",
        EnPreparacion => "En preparación",
        Listo => "Listo",
        Entregado => "Entregado",
        Cancelado => "Cancelado",
        _ => codigo
    };
}
