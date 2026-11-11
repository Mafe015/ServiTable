// Servicio de pedidos (US-2 y US-3).
// Sin VITE_API_URL usa datos simulados en memoria (se pierden al recargar); con VITE_API_URL llama al backend.
// Contrato propuesto, para confirmar con el backend:
//   POST {API}/pedidos      body: { mesa, items: [{ productoId, cantidad }] }  -> 201 { id, estado, total }
//   GET  {API}/pedidos/:id                                                     -> 200 { id, estado, total, items } | 404
const API = import.meta.env.VITE_API_URL;
const espera = (ms) => new Promise((ok) => setTimeout(ok, ms));
const memoria = new Map();
let contador = 100;

export class PedidoNoEncontrado extends Error {}

export async function registrarPedido({ mesa, items }) {
  if (!items.length || items.some((i) => !(i.qty > 0))) throw new Error("Las cantidades deben ser mayores que cero");
  const total = items.reduce((n, i) => n + i.qty * i.product.price, 0);
  if (API) {
    const r = await fetch(`${API}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mesa, items: items.map((i) => ({ productoId: i.product.id, cantidad: i.qty })) }),
    });
    if (!r.ok) throw new Error("No se pudo registrar el pedido");
    return r.json();
  }
  await espera(500);
  const pedido = { id: ++contador, estado: "Recibido", total };
  memoria.set(pedido.id, pedido);
  return pedido;
}

export async function consultarPedido(id) {
  if (API) {
    const r = await fetch(`${API}/pedidos/${encodeURIComponent(id)}`);
    if (r.status === 404) throw new PedidoNoEncontrado();
    if (!r.ok) throw new Error("No se pudo consultar el pedido");
    return r.json();
  }
  await espera(300);
  const pedido = memoria.get(Number(id));
  if (!pedido) throw new PedidoNoEncontrado();
  return pedido;
}
