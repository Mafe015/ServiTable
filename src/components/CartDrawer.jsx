import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { formatPrice } from "../data/menu";

export const CartList = ({ editable }) => {
  const { items, total, add, remove } = useApp();
  if (!items.length) return <p className="text-muted">Aún no has agregado productos a tu pedido.</p>;
  return (
    <div>
      <ul className="divide-y divide-white/10">
        {items.map(({ product, qty }) => (
          <li key={product.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-muted text-sm">
                {qty} × {formatPrice(product.price)} = {formatPrice(qty * product.price)}
              </p>
            </div>
            {editable && (
              <div className="flex gap-2">
                <button onClick={() => remove(product.id)} className="glass rounded-full min-h-[44px] px-4 active:scale-95">Quitar</button>
                <button onClick={() => add(product)} className="glass rounded-full min-h-[44px] px-4 active:scale-95">Agregar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <p className="flex justify-between text-xl font-semibold mt-4">
        <span>Total</span>
        <span className="text-primary">{formatPrice(total)}</span>
      </p>
    </div>
  );
};

const CartDrawer = ({ onClose, onPay }) => {
  const { items, clear } = useApp();
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mi pedido"
        onClick={(e) => e.stopPropagation()}
        className="bg-navy-800 border-l border-white/10 w-full max-w-md h-full p-6 flex flex-col"
      >
        <h2 className="font-display text-3xl font-semibold mb-4">Mi pedido</h2>
        <div className="flex-1 overflow-y-auto"><CartList editable /></div>
        <div className="mt-4 space-y-3">
          {items.length > 0 && (
            <button onClick={clear} className="glass rounded-full min-h-[48px] w-full active:scale-95">Vaciar pedido</button>
          )}
          <button onClick={onPay} className="primary-btn w-full min-h-[56px] text-lg active:scale-95">Ir a pagar</button>
          <button onClick={onClose} className="glass rounded-full min-h-[48px] w-full active:scale-95">Seguir viendo el menú</button>
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;
