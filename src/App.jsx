import { useState } from "react";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import { categories, products } from "./data/menu";

const App = () => {
  const [category, setCategory] = useState(categories[0]);
  const [selected, setSelected] = useState(null);
  const items = products.filter((p) => p.category === category);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Fondo: manchas difuminadas de café y azul (estáticas, sin animación) */}
      <div aria-hidden className="pointer-events-none fixed -top-40 -left-40 w-[42rem] h-[42rem] rounded-full bg-coffee-600/40 blur-[140px]" />
      <div aria-hidden className="pointer-events-none fixed -bottom-48 -right-40 w-[44rem] h-[44rem] rounded-full bg-coffee-800/70 blur-[140px]" />
      <div aria-hidden className="pointer-events-none fixed top-1/3 left-1/2 w-[30rem] h-[30rem] rounded-full bg-navy-700/50 blur-[120px]" />

      <div className="relative">
        <Header mesa="5" />
        <main className="container pb-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
          <CategoryTabs categories={categories} active={category} onChange={setCategory} />
          <section className="flex-1">
            <h1 className="font-display text-4xl font-semibold mb-6">{category}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((p) => (
                // Para activar el carrito más adelante: <ProductCard onAdd={agregarAlCarrito} />
                <ProductCard key={p.id} product={p} onSelect={setSelected} />
              ))}
            </div>
          </section>
        </main>
        {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
};

export default App;
