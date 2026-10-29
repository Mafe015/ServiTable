import { useState } from "react";
import Header from "../components/Header";
import Mensaje from "../components/Mensaje";
import { CartList } from "../components/CartDrawer";
import { useApp } from "../context/AppContext";
import { pedirCuenta } from "../services/mesa";

const BillScreen = ({ mesa, onHome, onMenu }) => {
  const { items, total } = useApp();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const pedir = async () => {
    setStatus("sending");
    try {
      await pedirCuenta(items, total);
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
        <section className="glass rounded-3xl p-6 mb-6" aria-label="Resumen del pedido">
          <h2 className="font-display text-2xl font-semibold mb-3">Resumen de tu pedido</h2>
          <CartList />
        </section>
        {status === "sent" && <div className="mb-6"><Mensaje>Pedimos tu cuenta. El mesero llegará a tu mesa en un momento.</Mensaje></div>}
        {status === "error" && <div className="mb-6"><Mensaje>No pudimos pedir la cuenta. Inténtalo de nuevo.</Mensaje></div>}
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={pedir}
            disabled={status === "sending" || status === "sent"}
            className="primary-btn min-h-[56px] text-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending" ? "Enviando…" : status === "sent" ? "Cuenta solicitada" : "Pedir la cuenta al mesero"}
          </button>
          <button disabled className="glass rounded-full min-h-[56px] text-lg opacity-50 cursor-not-allowed">
            Pagar en esta pantalla (próximamente)
          </button>
        </div>
        <button onClick={onMenu} className="glass rounded-full min-h-[48px] px-6 mt-4 active:scale-95">Volver al menú</button>
      </main>
    </>
  );
};

export default BillScreen;
