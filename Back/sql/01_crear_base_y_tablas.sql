/* Esquema para Microsoft SQL Server / SSMS. No elimina una base existente. */
IF DB_ID(N'ServiTable') IS NULL CREATE DATABASE ServiTable;
GO
USE ServiTable;
GO
IF OBJECT_ID(N'dbo.restaurante', N'U') IS NULL
CREATE TABLE dbo.restaurante (
 id_restaurante INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_restaurante PRIMARY KEY,
 nombre VARCHAR(100) NOT NULL, nit VARCHAR(20) NULL, direccion VARCHAR(200) NULL,
 telefono VARCHAR(20) NULL, creado_en DATETIME2 NOT NULL CONSTRAINT df_restaurante_creado DEFAULT SYSDATETIME()
);
GO
IF OBJECT_ID(N'dbo.rol', N'U') IS NULL
CREATE TABLE dbo.rol (
 id_rol INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_rol PRIMARY KEY,
 nombre VARCHAR(30) NOT NULL CONSTRAINT uq_rol_nombre UNIQUE,
 CONSTRAINT ck_rol_nombre CHECK (nombre IN ('administrador','mesero','cocina','admin_anuncios'))
);
GO
IF OBJECT_ID(N'dbo.usuario', N'U') IS NULL
CREATE TABLE dbo.usuario (
 id_usuario INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_usuario PRIMARY KEY,
 id_restaurante INT NOT NULL, id_rol INT NOT NULL, nombre VARCHAR(100) NOT NULL,
 correo VARCHAR(120) NOT NULL CONSTRAINT uq_usuario_correo UNIQUE,
 password_hash VARCHAR(255) NOT NULL, activo BIT NOT NULL CONSTRAINT df_usuario_activo DEFAULT 1,
 creado_en DATETIME2 NOT NULL CONSTRAINT df_usuario_creado DEFAULT SYSDATETIME(),
 CONSTRAINT fk_usuario_restaurante FOREIGN KEY (id_restaurante) REFERENCES dbo.restaurante(id_restaurante),
 CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES dbo.rol(id_rol)
);
GO
IF OBJECT_ID(N'dbo.mesa', N'U') IS NULL
CREATE TABLE dbo.mesa (
 id_mesa INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_mesa PRIMARY KEY,
 id_restaurante INT NOT NULL, numero INT NOT NULL, capacidad TINYINT NOT NULL CONSTRAINT df_mesa_capacidad DEFAULT 4,
 estado VARCHAR(30) NOT NULL CONSTRAINT df_mesa_estado DEFAULT 'disponible', id_mesero INT NULL,
 CONSTRAINT uq_mesa_numero UNIQUE (id_restaurante, numero),
 CONSTRAINT ck_mesa_numero CHECK (numero > 0), CONSTRAINT ck_mesa_capacidad CHECK (capacidad > 0),
 CONSTRAINT ck_mesa_estado CHECK (estado IN ('disponible','ocupada','requiere_atencion','en_atencion','cuenta_solicitada','pago_confirmado')),
 CONSTRAINT fk_mesa_restaurante FOREIGN KEY (id_restaurante) REFERENCES dbo.restaurante(id_restaurante),
 CONSTRAINT fk_mesa_mesero FOREIGN KEY (id_mesero) REFERENCES dbo.usuario(id_usuario)
);
GO
IF OBJECT_ID(N'dbo.dispositivo', N'U') IS NULL
CREATE TABLE dbo.dispositivo (
 id_dispositivo INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_dispositivo PRIMARY KEY,
 id_mesa INT NOT NULL, codigo VARCHAR(50) NOT NULL CONSTRAINT uq_dispositivo_codigo UNIQUE,
 bateria TINYINT NULL, conectado BIT NOT NULL CONSTRAINT df_dispositivo_conectado DEFAULT 0,
 ultima_conexion DATETIME2 NULL, CONSTRAINT uq_dispositivo_mesa UNIQUE (id_mesa),
 CONSTRAINT ck_dispositivo_bateria CHECK (bateria IS NULL OR bateria BETWEEN 0 AND 100),
 CONSTRAINT fk_dispositivo_mesa FOREIGN KEY (id_mesa) REFERENCES dbo.mesa(id_mesa)
);
GO
IF OBJECT_ID(N'dbo.categoria', N'U') IS NULL
CREATE TABLE dbo.categoria (
 id_categoria INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_categoria PRIMARY KEY,
 id_restaurante INT NOT NULL, nombre VARCHAR(80) NOT NULL, orden INT NOT NULL CONSTRAINT df_categoria_orden DEFAULT 0,
 CONSTRAINT uq_categoria_nombre UNIQUE (id_restaurante, nombre),
 CONSTRAINT uq_categoria_restaurante_id UNIQUE (id_restaurante, id_categoria),
 CONSTRAINT fk_categoria_restaurante FOREIGN KEY (id_restaurante) REFERENCES dbo.restaurante(id_restaurante)
);
GO
IF OBJECT_ID(N'dbo.producto', N'U') IS NULL
CREATE TABLE dbo.producto (
 id_producto INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_producto PRIMARY KEY,
 id_restaurante INT NOT NULL, id_categoria INT NOT NULL, nombre VARCHAR(100) NOT NULL,
 descripcion VARCHAR(300) NULL, precio DECIMAL(10,2) NOT NULL, imagen_url VARCHAR(255) NULL,
 disponible BIT NOT NULL CONSTRAINT df_producto_disponible DEFAULT 1,
 CONSTRAINT ck_producto_precio CHECK (precio >= 0),
 CONSTRAINT fk_producto_restaurante FOREIGN KEY (id_restaurante) REFERENCES dbo.restaurante(id_restaurante),
 CONSTRAINT fk_producto_categoria_restaurante FOREIGN KEY (id_restaurante, id_categoria)
  REFERENCES dbo.categoria(id_restaurante, id_categoria)
);
GO
