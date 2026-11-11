import { FiPlus } from "react-icons/fi";
import { formatPrice } from "../data/menu";

// Sin `onAdd`, el botón "Agregar" se ve pero queda deshabilitado.
const ProductCard = ({ product, onSelect, onAdd }) => (
  <article className="glass rounded-3xl p-5 lg:p-6 flex flex-col">
    <button
      onClick={() => onSelect(product)}
      className="text-left flex-1 rounded-2xl transition active:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <img src={product.image} alt={product.name} className="w-40 lg:w-[200px] aspect-square mx-auto object-cover rounded-full img-shadow" />
      <p className="font-display text-2xl font-semibold mt-4">{product.name}</p>
      <p className="text-muted line-clamp-2 mt-2">{product.description}</p>
    </button>
    <div className="flex items-center justify-between gap-3 mt-4">
      <p className="text-xl font-semibold text-primary">{formatPrice(product.price)}</p>
      <button
        type="button"
        onClick={() => onAdd?.(product)}
        disabled={!onAdd}
        aria-label={`Agregar ${product.name} al pedido`}
        className="min-h-[48px] px-5 rounded-full bg-primary text-navy-900 font-semibold flex items-center gap-2 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FiPlus size={20} aria-hidden="true" />
        Agregar
      </button>
    </div>
  </article>
);

export default ProductCard;
