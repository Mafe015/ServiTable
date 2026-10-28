import { FiPlus } from "react-icons/fi";
import { formatPrice } from "../data/menu";

// `onAdd` es opcional: sin él, el botón "+" se ve pero queda deshabilitado.
const ProductCard = ({ product, onSelect, onAdd }) => (
  <article className="glass rounded-3xl p-5 lg:p-6 flex flex-col">
    <button
      onClick={() => onSelect(product)}
      className="text-left flex-1 rounded-2xl transition active:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-40 lg:w-[200px] aspect-square mx-auto object-cover rounded-full img-shadow"
      />
      <p className="font-display text-2xl font-semibold mt-4">{product.name}</p>
      <p className="text-muted line-clamp-2 mt-2">{product.description}</p>
    </button>
    <div className="flex items-center justify-between mt-4">
      <p className="text-xl font-semibold text-primary">{formatPrice(product.price)}</p>
      <button
        type="button"
        onClick={() => onAdd?.(product)}
        disabled={!onAdd}
        aria-label={`Agregar ${product.name} al carrito`}
        title={onAdd ? "Agregar al carrito" : "Próximamente"}
        className="w-12 h-12 rounded-full bg-primary text-navy-900 flex items-center justify-center transition active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FiPlus size={26} />
      </button>
    </div>
  </article>
);

export default ProductCard;
