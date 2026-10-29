USE ServiTable;
GO
IF NOT EXISTS (SELECT 1 FROM dbo.restaurante WHERE nombre = 'Restaurante Demo ServiTable')
 INSERT INTO dbo.restaurante(nombre, direccion) VALUES ('Restaurante Demo ServiTable', 'Campus universitario');
GO
DECLARE @r INT = (SELECT TOP 1 id_restaurante FROM dbo.restaurante WHERE nombre='Restaurante Demo ServiTable' ORDER BY id_restaurante);
IF NOT EXISTS (SELECT 1 FROM dbo.categoria WHERE id_restaurante=@r AND nombre='Bebidas')
 INSERT INTO dbo.categoria(id_restaurante,nombre,orden) VALUES (@r,'Bebidas',1);
IF NOT EXISTS (SELECT 1 FROM dbo.categoria WHERE id_restaurante=@r AND nombre='Comidas')
 INSERT INTO dbo.categoria(id_restaurante,nombre,orden) VALUES (@r,'Comidas',2);
DECLARE @b INT = (SELECT id_categoria FROM dbo.categoria WHERE id_restaurante=@r AND nombre='Bebidas');
DECLARE @c INT = (SELECT id_categoria FROM dbo.categoria WHERE id_restaurante=@r AND nombre='Comidas');
IF NOT EXISTS (SELECT 1 FROM dbo.producto WHERE id_restaurante=@r AND nombre='Limonada')
 INSERT INTO dbo.producto(id_restaurante,id_categoria,nombre,descripcion,precio,disponible) VALUES (@r,@b,'Limonada','Limonada natural',5000,1);
IF NOT EXISTS (SELECT 1 FROM dbo.producto WHERE id_restaurante=@r AND nombre='Hamburguesa clásica')
 INSERT INTO dbo.producto(id_restaurante,id_categoria,nombre,descripcion,precio,disponible) VALUES (@r,@c,'Hamburguesa clásica','Hamburguesa con queso y vegetales',18000,1);
IF NOT EXISTS (SELECT 1 FROM dbo.producto WHERE id_restaurante=@r AND nombre='Papas fritas')
 INSERT INTO dbo.producto(id_restaurante,id_categoria,nombre,descripcion,precio,disponible) VALUES (@r,@c,'Papas fritas','Porción individual',7000,1);
GO
