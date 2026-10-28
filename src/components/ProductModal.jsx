import { useEffect } from "react";
import { formatPrice } from "../data/menu";

const ProductModal = ({ product, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
        className="bg-navy-800 border border-white/10 rounded-3xl w-full max-w-4xl p-6 lg:p-10 grid md:grid-cols-2 gap-6 items-center"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-56 md:w-full max-w-[340px] aspect-square mx-auto object-cover rounded-full img-shadow"
        />
        <div className="space-y-4">
          <h2 className="font-display text-4xl font-semibold">{product.name}</h2>
          <p className="text-lg text-muted">{product.description}</p>
          <p className="text-3xl font-semibold text-primary">{formatPrice(product.price)}</p>
          <button onClick={onClose} className="primary-btn min-h-[56px] px-10 text-lg active:scale-95">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
