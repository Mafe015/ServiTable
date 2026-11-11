/* Sprint 2 · US-2 y US-3: tablas de pedidos, mesas y datos de prueba.
   Ejecutar después de 01 y 02. Es repetible: no borra nada y no duplica datos. */
USE ServiTable;
GO
IF OBJECT_ID(N'dbo.pedido', N'U') IS NULL
CREATE TABLE dbo.pedido (
 id_pedido INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_pedido PRIMARY KEY,
 id_restaurante INT NOT NULL,
 id_mesa INT NOT NULL,
 estado VARCHAR(30) NOT NULL CONSTRAINT df_pedido_estado DEFAULT 'recibido',
 total DECIMAL(12,2) NOT NULL CONSTRAINT df_pedido_total DEFAULT 0,
 creado_en DATETIME2 NOT NULL CONSTRAINT df_pedido_creado DEFAULT SYSDATETIME(),
 CONSTRAINT ck_pedido_estado CHECK (estado IN ('recibido','en_preparacion','listo','entregado','cancelado')),
 CONSTRAINT ck_pedido_total CHECK (total >= 0),
 CONSTRAINT fk_pedido_restaurante FOREIGN KEY (id_restaurante) REFERENCES dbo.restaurante(id_restaurante),
 CONSTRAINT fk_pedido_mesa FOREIGN KEY (id_mesa) REFERENCES dbo.mesa(id_mesa)
);
GO
IF OBJECT_ID(N'dbo.detalle_pedido', N'U') IS NULL
CREATE TABLE dbo.detalle_pedido (
 id_detalle INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_detalle_pedido PRIMARY KEY,
 id_pedido INT NOT NULL,
 id_producto INT NOT NULL,
 cantidad INT NOT NULL,
 precio_unitario DECIMAL(10,2) NOT NULL,
 subtotal DECIMAL(12,2) NOT NULL,
 CONSTRAINT uq_detalle_pedido_producto UNIQUE (id_pedido, id_producto),
 CONSTRAINT ck_detalle_cantidad CHECK (cantidad > 0),
 CONSTRAINT ck_detalle_precio CHECK (precio_unitario >= 0),
 CONSTRAINT ck_detalle_subtotal CHECK (subtotal >= 0),
 CONSTRAINT fk_detalle_pedido FOREIGN KEY (id_pedido) REFERENCES dbo.pedido(id_pedido) ON DELETE CASCADE,
 CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES dbo.producto(id_producto)
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_pedido_mesa' AND object_id = OBJECT_ID(N'dbo.pedido'))
 CREATE INDEX ix_pedido_mesa ON dbo.pedido(id_mesa, creado_en);
GO
/* Mesas de prueba 1 a 5 (el frontend usa la mesa 5). */
DECLARE @r INT = (SELECT TOP 1 id_restaurante FROM dbo.restaurante WHERE nombre='Restaurante Demo ServiTable' ORDER BY id_restaurante);
DECLARE @n INT = 1;
WHILE @n <= 5
BEGIN
 IF NOT EXISTS (SELECT 1 FROM dbo.mesa WHERE id_restaurante=@r AND numero=@n)
  INSERT INTO dbo.mesa(id_restaurante, numero, capacidad) VALUES (@r, @n, 4);
 SET @n += 1;
END
GO
/* Pedidos de prueba para US-3: uno por cada estado más usado. Solo si aún no hay pedidos. */
IF NOT EXISTS (SELECT 1 FROM dbo.pedido)
BEGIN
 DECLARE @r INT = (SELECT TOP 1 id_restaurante FROM dbo.restaurante WHERE nombre='Restaurante Demo ServiTable' ORDER BY id_restaurante);
 DECLARE @mesa INT = (SELECT id_mesa FROM dbo.mesa WHERE id_restaurante=@r AND numero=5);
 DECLARE @limonada INT = (SELECT id_producto FROM dbo.producto WHERE id_restaurante=@r AND nombre='Limonada');
 DECLARE @hamb INT = (SELECT id_producto FROM dbo.producto WHERE id_restaurante=@r AND nombre='Hamburguesa clásica');
 DECLARE @papas INT = (SELECT id_producto FROM dbo.producto WHERE id_restaurante=@r AND nombre='Papas fritas');
 DECLARE @p INT;

 -- Pedido 1 · recibido: 2 limonadas + 1 hamburguesa = 28000
 INSERT INTO dbo.pedido(id_restaurante,id_mesa,estado,total) VALUES (@r,@mesa,'recibido',28000);
 SET @p = SCOPE_IDENTITY();
 INSERT INTO dbo.detalle_pedido(id_pedido,id_producto,cantidad,precio_unitario,subtotal) VALUES
  (@p,@limonada,2,5000,10000), (@p,@hamb,1,18000,18000);

 -- Pedido 2 · en_preparacion: 1 papas fritas = 7000
 INSERT INTO dbo.pedido(id_restaurante,id_mesa,estado,total) VALUES (@r,@mesa,'en_preparacion',7000);
 SET @p = SCOPE_IDENTITY();
 INSERT INTO dbo.detalle_pedido(id_pedido,id_producto,cantidad,precio_unitario,subtotal) VALUES (@p,@papas,1,7000,7000);

 -- Pedido 3 · listo: 1 hamburguesa = 18000
 INSERT INTO dbo.pedido(id_restaurante,id_mesa,estado,total) VALUES (@r,@mesa,'listo',18000);
 SET @p = SCOPE_IDENTITY();
 INSERT INTO dbo.detalle_pedido(id_pedido,id_producto,cantidad,precio_unitario,subtotal) VALUES (@p,@hamb,1,18000,18000);
END
GO
