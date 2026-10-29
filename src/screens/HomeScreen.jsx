import { FiBell, FiBookOpen, FiCreditCard } from "react-icons/fi";
import Header from "../components/Header";
import { useApp } from "../context/AppContext";
import { formatPrice } from "../data/menu";
import { FUNCIONES } from "../config";

const Opcion = ({ icon: Icon, title, text, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`glass rounded-3xl p-6 lg:p-8 text-left flex items-center gap-5 min-h-[140px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${disabled ? "opacity-50 cursor-not-allowed" : "transition active:scale-[0.98]"}`}
  >
    <span className="w-16 h-16 rounded-full bg-primary text-navy-900 flex items-center justify-center shrink-0">
      <Icon size={30} aria-hidden="true" />
    </span>
    <span>
      <span className="block font-display text-3xl font-semibold">{title}</span>
      <span className="block text-muted mt-1">{text}</span>
      {disabled && <span className="block text-primary font-medium mt-2">Próximamente</span>}
    </span>
  </button>
);

const HomeScreen = ({ mesa, go }) => {
  const { count, total } = useApp();
  return (
    <>
      <Header mesa={mesa} />
      <main className="container pb-10">
        <h1 className="font-display text-4xl font-semibold mb-6">¿Qué deseas hacer?</h1>
        <div className="grid lg:grid-cols-[1fr_22rem] gap-6">
          <div className="grid gap-6">
            <Opcion icon={FiBookOpen} title="Ver menú" text="Consulta los platos, bebidas y precios, y arma tu pedido." onClick={() => go("menu")} />
            <Opcion icon={FiBell} title="Llamar al mesero" text="Pide atención, agua, cubiertos o servilletas sin esperar." onClick={() => go("waiter")} disabled={!FUNCIONES.mesero} />
            <Opcion icon={FiCreditCard} title="Pedir la cuenta" text="Revisa tu pedido, pide la cuenta y paga." onClick={() => go("bill")} disabled={!FUNCIONES.cuenta} />
          </div>
          <section className="glass rounded-3xl p-6 flex flex-col gap-4 self-start" aria-label="Mi pedido">
            <h2 className="font-display text-2xl font-semibold">Mi pedido</h2>
            {count === 0 ? (
              <p className="text-muted">Aún no has agregado productos a tu pedido.</p>
            ) : (
              <p className="text-muted">
                {count} {count === 1 ? "producto" : "productos"}
                <span className="block text-2xl font-semibold text-primary mt-1">{formatPrice(total)}</span>
              </p>
            )}
            <button onClick={() => go("bill")} disabled={!FUNCIONES.cuenta} className="primary-btn min-h-[56px] text-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">Pagar</button>
            {!FUNCIONES.cuenta && <p className="text-primary font-medium">Próximamente</p>}
          </section>
        </div>
      </main>
    </>
  );
};

export default HomeScreen;
