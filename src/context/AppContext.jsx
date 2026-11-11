import { createContext, useCallback, useContext, useMemo, useReducer, useRef, useState } from "react";
import { registrarPedido } from "../services/pedidos";
import { MESA } from "../config";

const AppContext = createContext(null);

function cartReducer(state, a) {
  switch (a.type) {
    case "add": {
      const found = state.find((i) => i.product.id === a.product.id);
      return found
        ? state.map((i) => (i.product.id === a.product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...state, { product: a.product, qty: 1 }];
    }
    case "remove":
      return state.flatMap((i) => (i.product.id !== a.id ? [i] : i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []));
    case "clear":
      return [];
    default:
      return state;
  }
}

const merge = (a = [], b) =>
  b.reduce((acc, n) => {
    const f = acc.find((i) => i.product.id === n.product.id);
    return f ? acc.map((i) => (i === f ? { ...i, qty: i.qty + n.qty } : i)) : [...acc, n];
  }, a);

// Carrito, pedido enviado y mensaje emergente compartidos por todas las pantallas.
export function AppProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [order, setOrder] = useState(null); // pedido ya enviado a cocina
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const notify = useCallback((text) => {
    setToast(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3500);
  }, []);
  const total = items.reduce((n, i) => n + i.qty * i.product.price, 0);

  const value = useMemo(
    () => ({
      items, order, toast, total,
      count: items.reduce((n, i) => n + i.qty, 0),
      add: (product) => {
        dispatch({ type: "add", product });
        notify("Producto agregado a tu pedido.");
      },
      remove: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
      closeOrder: () => setOrder(null),
      enviar: async () => {
        try {
          const r = await registrarPedido({ mesa: MESA, items });
          setOrder((p) => ({ id: r.id, estado: r.estado, items: merge(p?.items, items), total: (p?.total || 0) + total }));
          dispatch({ type: "clear" });
          notify(`Pedido registrado. Tu número de pedido es ${r.id}.`);
          return true;
        } catch {
          notify("No pudimos registrar tu pedido. Inténtalo de nuevo.");
          return false;
        }
      },
    }),
    [items, order, toast, total, notify]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
