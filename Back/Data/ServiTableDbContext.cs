using Microsoft.EntityFrameworkCore;
using ServiTable.Api.Models;

namespace ServiTable.Api.Data;

public class ServiTableDbContext : DbContext
{
    public ServiTableDbContext(DbContextOptions<ServiTableDbContext> options) : base(options) { }
    public DbSet<Restaurante> Restaurantes => Set<Restaurante>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Producto> Productos => Set<Producto>();
    public DbSet<Mesa> Mesas => Set<Mesa>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();
    public DbSet<DetallePedido> DetallesPedido => Set<DetallePedido>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Restaurante>(e =>
        {
            e.ToTable("restaurante");
            e.HasKey(x => x.IdRestaurante);
            e.Property(x => x.IdRestaurante).HasColumnName("id_restaurante");
            e.Property(x => x.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
            e.Property(x => x.Nit).HasColumnName("nit").HasMaxLength(20);
            e.Property(x => x.Direccion).HasColumnName("direccion").HasMaxLength(200);
            e.Property(x => x.Telefono).HasColumnName("telefono").HasMaxLength(20);
            e.Property(x => x.CreadoEn).HasColumnName("creado_en").HasDefaultValueSql("SYSDATETIME()");
        });

        modelBuilder.Entity<Categoria>(e =>
        {
            e.ToTable("categoria");
            e.HasKey(x => x.IdCategoria);
            e.Property(x => x.IdCategoria).HasColumnName("id_categoria");
            e.Property(x => x.IdRestaurante).HasColumnName("id_restaurante");
            e.Property(x => x.Nombre).HasColumnName("nombre").HasMaxLength(80).IsRequired();
            e.Property(x => x.Orden).HasColumnName("orden").HasDefaultValue(0);
            e.HasIndex(x => new { x.IdRestaurante, x.Nombre }).IsUnique();
            e.HasAlternateKey(x => new { x.IdRestaurante, x.IdCategoria });
            e.HasOne(x => x.Restaurante).WithMany(x => x.Categorias)
                .HasForeignKey(x => x.IdRestaurante).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(x => x.Productos).WithOne(x => x.Categoria)
                .HasForeignKey(x => new { x.IdRestaurante, x.IdCategoria })
                .HasPrincipalKey(x => new { x.IdRestaurante, x.IdCategoria })
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Producto>(e =>
        {
            e.ToTable("producto", t => t.HasCheckConstraint("ck_producto_precio", "precio >= 0"));
            e.HasKey(x => x.IdProducto);
            e.Property(x => x.IdProducto).HasColumnName("id_producto");
            e.Property(x => x.IdRestaurante).HasColumnName("id_restaurante");
            e.Property(x => x.IdCategoria).HasColumnName("id_categoria");
            e.Property(x => x.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
            e.Property(x => x.Descripcion).HasColumnName("descripcion").HasMaxLength(300);
            e.Property(x => x.Precio).HasColumnName("precio").HasPrecision(10, 2);
            e.Property(x => x.ImagenUrl).HasColumnName("imagen_url").HasMaxLength(255);
            e.Property(x => x.Disponible).HasColumnName("disponible").HasDefaultValue(true);
            e.HasOne(x => x.Restaurante).WithMany().HasForeignKey(x => x.IdRestaurante).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Mesa>(e =>
        {
            e.ToTable("mesa");
            e.HasKey(x => x.IdMesa);
            e.Property(x => x.IdMesa).HasColumnName("id_mesa");
            e.Property(x => x.IdRestaurante).HasColumnName("id_restaurante");
            e.Property(x => x.Numero).HasColumnName("numero");
            e.Property(x => x.Estado).HasColumnName("estado").HasMaxLength(30);
        });

        modelBuilder.Entity<Pedido>(e =>
        {
            e.ToTable("pedido");
            e.HasKey(x => x.IdPedido);
            e.Property(x => x.IdPedido).HasColumnName("id_pedido");
            e.Property(x => x.IdRestaurante).HasColumnName("id_restaurante");
            e.Property(x => x.IdMesa).HasColumnName("id_mesa");
            e.Property(x => x.Estado).HasColumnName("estado").HasMaxLength(30).IsRequired();
            e.Property(x => x.Total).HasColumnName("total").HasPrecision(12, 2);
            e.Property(x => x.CreadoEn).HasColumnName("creado_en");
            e.HasOne<Restaurante>().WithMany().HasForeignKey(x => x.IdRestaurante).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Mesa).WithMany().HasForeignKey(x => x.IdMesa).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<DetallePedido>(e =>
        {
            e.ToTable("detalle_pedido");
            e.HasKey(x => x.IdDetalle);
            e.Property(x => x.IdDetalle).HasColumnName("id_detalle");
            e.Property(x => x.IdPedido).HasColumnName("id_pedido");
            e.Property(x => x.IdProducto).HasColumnName("id_producto");
            e.Property(x => x.Cantidad).HasColumnName("cantidad");
            e.Property(x => x.PrecioUnitario).HasColumnName("precio_unitario").HasPrecision(10, 2);
            e.Property(x => x.Subtotal).HasColumnName("subtotal").HasPrecision(12, 2);
            e.HasIndex(x => new { x.IdPedido, x.IdProducto }).IsUnique();
            e.HasOne(x => x.Pedido).WithMany(x => x.Detalles).HasForeignKey(x => x.IdPedido).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Producto).WithMany().HasForeignKey(x => x.IdProducto).OnDelete(DeleteBehavior.Restrict);
        });
    }
}
