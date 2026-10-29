import { useEffect, useState } from "react";
import Header from "../components/Header";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CartDrawer from "../components/CartDrawer";
import Mensaje from "../components/Mensaje";
import { useApp } from "../context/AppContext";
import { FUNCIONES } from "../config";
import { categories, fetchMenu, formatPrice } from "../data/menu";

const MenuScreen = ({ mesa, onHome, onPay }) => {
  const { count, total, add } = useApp();
  const [category, setCategory] = useState(categories[0]);
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchMenu()
      .then((d) => !cancelled && (setProducts(d), setStatus("ready")))
      .catch(() => !cancelled && setStatus("error"));
    return () => { cancelled = true; };
  }, [attempt]);

  const items = products.filter((p) => p.category === category);

  return (
    <>
      <Header
        mesa={mesa}
        onBack={onHome}
        right={
          FUNCIONES.pedidos ? (
            <button onClick={() => setCartOpen(true)} className="primary-btn min-h-[48px] px-5 text-lg active:scale-95">
              Mi pedido ({count}) · {formatPrice(total)}
            </button>
          ) : (
            <button disabled className="glass rounded-full min-h-[48px] px-5 text-lg opacity-50 cursor-not-allowed">
              Mi pedido 
            </button>
          )
        }
      />
      <main className="container pb-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
        <CategoryTabs categories={categories} active={category} onChange={setCategory} />
        <section className="flex-1">
          <h1 className="font-display text-4xl font-semibold">{category}</h1>
          {status === "ready" && (
            <p className="text-muted mt-1 mb-6">
              {items.length} {items.length === 1 ? "producto" : "productos"} · Precios en pesos colombianos
            </p>
          )}
          
          {status === "loading" && <Mensaje>Cargando el menú…</Mensaje>}
          {status === "error" && (
            <Mensaje>
              <p className="mb-4">No pudimos cargar el menú. Revisa la conexión e inténtalo de nuevo.</p>
              <button onClick={() => setAttempt((n) => n + 1)} className="primary-btn min-h-[56px] px-8 text-lg active:scale-95">Reintentar</button>
            </Mensaje>
          )}
          {status === "ready" && items.length === 0 && <Mensaje>Por ahora no hay productos disponibles en esta categoría.</Mensaje>}
          {status === "ready" && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((p) => <ProductCard key={p.id} product={p} onSelect={setSelected} onAdd={FUNCIONES.pedidos ? add : undefined} />)}
            </div>
          )}
        </section>
      </main>
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={FUNCIONES.pedidos ? add : undefined} />}
      {FUNCIONES.pedidos && cartOpen && <CartDrawer onClose={() => setCartOpen(false)} onPay={onPay} />}
    </>
  );
};

export default MenuScreen;
