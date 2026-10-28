namespace ServiTable.Api.DTOs;
public record MenuDto(int IdRestaurante, IReadOnlyList<CategoriaMenuDto> Categorias);
public record CategoriaMenuDto(int IdCategoria, string Nombre, IReadOnlyList<ProductoMenuDto> Productos);
public record ProductoMenuDto(int IdProducto, string Nombre, string? Descripcion, decimal Precio, string? ImagenUrl);
