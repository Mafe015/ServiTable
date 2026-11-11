import { useEffect, useState } from "react";
import Header from "../components/Header";
import Mensaje from "../components/Mensaje";
import { useApp } from "../context/AppContext";
import { formatPrice } from "../data/menu";
import { consultarPedido, PedidoNoEncontrado } from "../services/pedidos";

const MENSAJES = {
  vacio: "Escribe el número de tu pedido para consultarlo.",
  cargando: "Consultando tu pedido…",
  noExiste: "No encontramos un pedido con ese número. Revisa el número e inténtalo de nuevo.",
  error: "No pudimos consultar tu pedido. Inténtalo de nuevo.",
};

const StatusScreen = ({ mesa, onHome, onMenu }) => {
  const { order } = useApp();
  const [numero, setNumero] = useState(order ? String(order.id) : "");
  const [estado, setEstado] = useState("idle"); // idle | vacio | cargando | ok | noExiste | error
  const [pedido, setPedido] = useState(null);

  const consultar = async (e) => {
    e?.preventDefault();
    const id = numero.trim();
    if (!id) return setEstado("vacio");
    setEstado("cargando");
    setPedido(null);
    try {
      setPedido(await consultarPedido(id));
      setEstado("ok");
    } catch (err) {
      setEstado(err instanceof PedidoNoEncontrado ? "noExiste" : "error");
    }
  };

  useEffect(() => {
    if (order) consultar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header mesa={mesa} onBack={onHome} />
      <main className="container pb-10 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold mb-2">Estado de mi pedido</h1>
        {!order && estado === "idle" && (
          <p className="text-muted mb-6">Aún no has registrado un pedido. Confirma uno desde el menú o escribe un número de pedido para consultarlo.</p>
        )}
        <form onSubmit={consultar} className="glass rounded-3xl p-6 mb-6 flex flex-col sm:flex-row gap-4 sm:items-end">
          <label className="flex-1 text-lg">
            Número de pedido
            <input
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              inputMode="numeric"
              className="glass rounded-2xl px-5 min-h-[56px] text-lg w-full mt-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            />
          </label>
          <button type="submit" disabled={estado === "cargando"} className="primary-btn min-h-[56px] px-8 text-lg active:scale-95 disabled:opacity-50">
            Consultar pedido
          </button>
        </form>

        {["vacio", "cargando", "noExiste", "error"].includes(estado) && <Mensaje>{MENSAJES[estado]}</Mensaje>}

        {estado === "ok" && pedido && (
          <section className="glass rounded-3xl p-6" aria-label="Pedido consultado">
            <h2 className="font-display text-2xl font-semibold">Pedido N.º {pedido.id}</h2>
            <p className="text-xl mt-3">Estado: <span className="font-semibold text-primary">{pedido.estado}</span></p>
            {pedido.total != null && <p className="text-muted mt-2">Total: {formatPrice(pedido.total)}</p>}
          </section>
        )}
        <button onClick={onMenu} className="glass rounded-full min-h-[48px] px-6 mt-6 active:scale-95">Volver al menú</button>
      </main>
    </>
  );
};

export default StatusScreen;
