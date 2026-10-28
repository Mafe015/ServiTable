# ServiTable — Sprint 1: Menú digital

Backend inicial con C# / ASP.NET Core Web API y SQL Server. Incluye consulta del menú, productos disponibles, precios y filtro por categoría.

## Requisitos
- SQL Server y SSMS.
- .NET 8 SDK.

## 1. Crear la base de datos
En SSMS ejecuta `sql/01_crear_base_y_tablas.sql`. Luego ejecuta `sql/02_datos_prueba.sql`.
El primer script no elimina la base de datos ni las tablas existentes. Si ya tienes tablas con estos nombres y una estructura distinta, revisa o respalda antes de ejecutar.

## 2. Configurar conexión
En `appsettings.json` revisa `ConnectionStrings:ServiTable`.
- Instancia local: `Server=localhost;Database=ServiTable;Trusted_Connection=True;TrustServerCertificate=True;`
- SQL Server Express: cambia el servidor a `localhost\\SQLEXPRESS`.
- Autenticación SQL: configura `User Id` y `Password`; no subas credenciales a Git.

## 3. Ejecutar API
Abre terminal en la carpeta con `ServiTable.Api.csproj`:
```bash
dotnet restore
dotnet run
```
Usa la URL que indique la terminal y abre `/swagger` en el entorno de desarrollo.

## 4. Endpoints
Cambia el ID 1 por el ID real del restaurante:
- `GET /api/restaurantes/1/menu`
- `GET /api/restaurantes/1/productos`
- `GET /api/restaurantes/1/productos?categoriaId=2`
- `GET /api/restaurantes/1/categorias`

## Alcance actual
No incluye aún interfaz web, autenticación, pedidos, pagos ni gestión administrativa. Los productos no disponibles no se muestran en el menú público. CORS está abierto para facilitar el desarrollo; antes de producción debe limitarse al origen real del frontend.
