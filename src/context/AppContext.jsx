import { createContext, useCallback, useContext, useMemo, useReducer, useRef, useState } from "react";

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

// Carrito + mensaje emergente compartidos por todas las pantallas.
export function AppProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const notify = useCallback((text) => {
    setToast(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3500);
  }, []);
  const value = useMemo(
    () => ({
      items,
      toast,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.product.price, 0),
      add: (product) => {
        dispatch({ type: "add", product });
        notify("Producto agregado a tu pedido.");
      },
      remove: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [items, toast, notify]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
