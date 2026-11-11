# Sprint 2 · Entregables y pruebas verificables (backend)

Preparación: ejecutar `sql/01`, `02` y `03`, arrancar la API (`dotnet run`) y usar `pruebas/pedidos.http` o Swagger (`/swagger`).

## US-2 — Registrar pedidos (Andrés · Backend)
**Entregable:** `POST /api/pedidos` (`Services/PedidoService.cs`, `Endpoints/PedidoEndpoints.cs`).

| # | Caso | Entrada | Resultado esperado |
|---|------|---------|--------------------|
| 2.1 | Pedido válido | mesa 5; 2 × Limonada (5000) + 1 × Hamburguesa (18000) | `201`, `id` generado, `estado: "Recibido"`, `total: 28000` |
| 2.2 | Cantidad cero | `cantidad: 0` | `400` con mensaje de error; no se guarda nada |
| 2.3 | Sin productos | `items: []` | `400` |
| 2.4 | Producto inexistente | `productoId: 9999` | `400` |
| 2.5 | Producto no disponible | producto con `disponible = 0` | `400` |
| 2.6 | Mesa inexistente | `mesa: "99"` | `404` |
| 2.7 | Persistencia | tras 2.1 ejecutar `sql/04_verificacion_pedidos.sql` | fila en `pedido` (estado `recibido`, total 28000) y 2 filas en `detalle_pedido`; la consulta de coherencia devuelve 0 filas |

## US-3 — Consultar estado del pedido (Andrés · Backend)
**Entregable:** `GET /api/pedidos/{id}`.

| # | Caso | Entrada | Resultado esperado |
|---|------|---------|--------------------|
| 3.1 | Pedido existente | `GET /api/pedidos/1` (datos de prueba) | `200` con `id`, `estado: "Recibido"`, `total`, `items` |
| 3.2 | Estado distinto | `GET /api/pedidos/2` y `/3` | `"En preparación"` y `"Listo"` |
| 3.3 | ID inexistente | `GET /api/pedidos/99999` | `404 { mensaje }` |
| 3.4 | ID no numérico | `GET /api/pedidos/abc` | `404 { mensaje }` |

## Pruebas automáticas
`dotnet test Back.Tests` → 13 casos de prueba sobre `PedidoService` (casos 2.1–2.6, producto repetido, cantidad máxima, 3.1 y 3.3, y que el estado leído sea el guardado).

## Integración con el frontend (Mariana)
1. `.env.local` con `VITE_API_URL=/api`, API y `npm run dev` encendidos.
2. Menú → agregar productos → «Mi pedido» → «Confirmar pedido»: el mensaje muestra el número de pedido real.
3. Estado de mi pedido → consultar ese número (existente) y uno inexistente → mensaje «No encontramos un pedido…».
