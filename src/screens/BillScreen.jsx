import { useState } from "react";
import Header from "../components/Header";
import Mensaje from "../components/Mensaje";
import { useApp } from "../context/AppContext";
import { formatPrice } from "../data/menu";
import { FUNCIONES } from "../config";
import { pedirCuenta } from "../services/mesa";

const BillScreen = ({ mesa, onHome, onMenu, onPay }) => {
  const { order } = useApp();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const pedir = async () => {
    setStatus("sending");
    try {
      await pedirCuenta(order);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Header mesa={mesa} onBack={onHome} />
      <main className="container pb-10 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold mb-6">Pedir la cuenta</h1>
        {!order ? (
          <div className="mb-6">
            <Mensaje>
              <p className="mb-4">Aún no tienes productos pedidos. Cuando envíes un pedido a cocina, aquí verás tu cuenta.</p>
              <button onClick={onMenu} className="primary-btn min-h-[56px] px-8 text-lg active:scale-95">Ver menú</button>
            </Mensaje>
          </div>
        ) : (
          <section className="glass rounded-3xl p-6 mb-6" aria-label="Resumen de la cuenta">
            <h2 className="font-display text-2xl font-semibold mb-3">Tu consumo</h2>
            <ul className="divide-y divide-white/10">
              {order.items.map(({ product, qty }) => (
                <li key={product.id} className="py-3 flex justify-between gap-3">
                  <span>{qty} × {product.name}</span>
                  <span className="text-muted">{formatPrice(qty * product.price)}</span>
                </li>
              ))}
            </ul>
            <p className="flex justify-between text-xl font-semibold mt-4">
              <span>Total a pagar</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </p>
          </section>
        )}
        {status === "sent" && <div className="mb-6"><Mensaje>Pedimos tu cuenta. El mesero llegará a tu mesa en un momento.</Mensaje></div>}
        {status === "error" && <div className="mb-6"><Mensaje>No pudimos pedir la cuenta. Inténtalo de nuevo.</Mensaje></div>}
        <div className="grid sm:grid-cols-2 gap-4">
          <button onClick={pedir} disabled={!order || status === "sending" || status === "sent"} className="primary-btn min-h-[56px] text-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {status === "sending" ? "Enviando…" : status === "sent" ? "Cuenta solicitada" : "Pedir la cuenta al mesero"}
          </button>
          <button onClick={onPay} disabled={!order || !FUNCIONES.pago} className="glass rounded-full min-h-[56px] text-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {FUNCIONES.pago ? "Pagar en esta pantalla" : "Pagar en esta pantalla (próximamente)"}
          </button>
        </div>
        <button onClick={onMenu} className="glass rounded-full min-h-[48px] px-6 mt-4 active:scale-95">Volver al menú</button>
      </main>
    </>
  );
};

export default BillScreen;
