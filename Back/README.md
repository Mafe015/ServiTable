# ServiTable — Backend (Sprint 1: Menú digital · Sprint 2: Pedidos)

Backend con C# / ASP.NET Core Web API y SQL Server. Sprint 1: menú, productos y categorías. Sprint 2: registrar pedidos (US-2) y consultar su estado (US-3).

## Requisitos
- SQL Server y SSMS.
- .NET 10 SDK (el proyecto apunta a `net10.0`).

## 1. Crear la base de datos
En SSMS ejecuta `sql/01_crear_base_y_tablas.sql`. Luego `sql/02_datos_prueba.sql` y, para el Sprint 2, `sql/03_pedidos.sql` (tablas `pedido` y `detalle_pedido`, mesas 1–5 y 3 pedidos de prueba). `sql/04_verificacion_pedidos.sql` trae consultas para comprobar lo que guarda la API.
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

Sprint 2:
- `POST /api/pedidos` — cuerpo `{ "mesa": "5", "items": [{ "productoId": 1, "cantidad": 2 }] }` → `201 { id, estado, total }`.
  `400 { mensaje, errores[] }` si no hay productos, la cantidad no es mayor que cero (o supera 99), el producto no existe o no está disponible; `404` si la mesa no existe.
  El total se calcula en el servidor con los precios de la base de datos; el precio nunca se toma del cliente.
- `GET /api/pedidos/{id}` — `200 { id, mesa, estado, estadoCodigo, total, creadoEn, items[] }`; `404 { mensaje }` si el ID no existe o no es un número válido.
- Estados permitidos: `recibido`, `en_preparacion`, `listo`, `entregado`, `cancelado` (se muestran como «Recibido», «En preparación», etc.).

## 5. Conectar con el frontend
En la raíz del proyecto, copia `.env.example` como `.env.local` (`VITE_API_URL=/api`), arranca la API y luego `npm run dev`. Vite reenvía `/api` a `https://localhost:58573` (ver `vite.config.js`).
El restaurante de los pedidos se configura en `appsettings.json` → `Pedidos:IdRestaurante` (por defecto 1, igual que el menú del frontend).

## 6. Pruebas
- Automáticas (servicio de pedidos): desde la raíz, `dotnet test Back.Tests`.
- Manuales: `pruebas/pedidos.http`. Casos y evidencias para Jira: `docs/pruebas-sprint2.md`.

## Alcance actual
No incluye autenticación, cambio de estado de pedidos (cocina), pagos ni gestión administrativa. Los productos no disponibles no se muestran en el menú público. CORS está abierto para facilitar el desarrollo; antes de producción debe limitarse al origen real del frontend.
