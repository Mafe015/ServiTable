using Microsoft.EntityFrameworkCore;
using ServiTable.Api.Data;
using ServiTable.Api.DTOs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ServiTableDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("ServiTable")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddPolicy("Frontend", p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }
app.UseHttpsRedirection();
app.UseCors("Frontend");

app.MapGet("/", () => Results.Ok(new { application = "ServiTable API", sprint = "Sprint 1 - Menú digital", status = "running" }));

app.MapGet("/api/restaurantes/{idRestaurante:int}/menu",
    async (int idRestaurante, ServiTableDbContext db) =>
{
    var exists = await db.Restaurantes.AsNoTracking().AnyAsync(r => r.IdRestaurante == idRestaurante);
    if (!exists) return Results.NotFound(new { mensaje = "No existe el restaurante solicitado." });

    var categorias = await db.Categorias.AsNoTracking()
        .Where(c => c.IdRestaurante == idRestaurante)
        .OrderBy(c => c.Orden).ThenBy(c => c.Nombre)
        .Select(c => new CategoriaMenuDto(c.IdCategoria, c.Nombre,
            c.Productos.Where(p => p.Disponible).OrderBy(p => p.Nombre)
                .Select(p => new ProductoMenuDto(p.IdProducto, p.Nombre, p.Descripcion, p.Precio, p.ImagenUrl))
                .ToList()))
        .ToListAsync();
    return Results.Ok(new MenuDto(idRestaurante, categorias));
});

app.MapGet("/api/restaurantes/{idRestaurante:int}/productos",
    async (int idRestaurante, int? categoriaId, ServiTableDbContext db) =>
{
    var exists = await db.Restaurantes.AsNoTracking().AnyAsync(r => r.IdRestaurante == idRestaurante);
    if (!exists) return Results.NotFound(new { mensaje = "No existe el restaurante solicitado." });

    var query = db.Productos.AsNoTracking()
        .Where(p => p.IdRestaurante == idRestaurante && p.Disponible);
    if (categoriaId.HasValue) query = query.Where(p => p.IdCategoria == categoriaId.Value);

    var productos = await query.OrderBy(p => p.Nombre)
        .Select(p => new ProductoMenuDto(p.IdProducto, p.Nombre, p.Descripcion, p.Precio, p.ImagenUrl))
        .ToListAsync();
    return Results.Ok(productos);
});

app.MapGet("/api/restaurantes/{idRestaurante:int}/categorias",
    async (int idRestaurante, ServiTableDbContext db) =>
{
    var categorias = await db.Categorias.AsNoTracking()
        .Where(c => c.IdRestaurante == idRestaurante)
        .OrderBy(c => c.Orden).ThenBy(c => c.Nombre)
        .Select(c => new { c.IdCategoria, c.Nombre, c.Orden }).ToListAsync();
    return Results.Ok(categorias);
});

app.Run();
