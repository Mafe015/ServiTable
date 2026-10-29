import { useState } from "react";
import Header from "../components/Header";
import Mensaje from "../components/Mensaje";
import { enviarSolicitud } from "../services/mesa";

const SOLICITUDES = [
  { id: "mesero", titulo: "Llamar al mesero", texto: "Un mesero se acercará a tu mesa.", ok: "Listo, avisamos al mesero. Llegará a tu mesa en un momento." },
  { id: "agua", titulo: "Pedir agua", texto: "Te llevamos agua a la mesa.", ok: "Listo, pedimos agua para tu mesa. El mesero te la llevará en un momento." },
  { id: "cubiertos", titulo: "Pedir cubiertos", texto: "Tenedor, cuchillo o cuchara.", ok: "Listo, pedimos cubiertos para tu mesa. El mesero te los llevará en un momento." },
  { id: "servilletas", titulo: "Pedir servilletas", texto: "Te llevamos más servilletas.", ok: "Listo, pedimos servilletas para tu mesa. El mesero te las llevará en un momento." },
];

const WaiterScreen = ({ mesa, onHome }) => {
  const [sent, setSent] = useState({});
  const [busy, setBusy] = useState(null);
  const [msg, setMsg] = useState(null);

  const pedir = async (s) => {
    setBusy(s.id);
    setMsg(null);
    try {
      await enviarSolicitud(s.id);
      setSent((x) => ({ ...x, [s.id]: true }));
      setMsg(s.ok);
    } catch {
      setMsg("No pudimos enviar tu solicitud. Inténtalo de nuevo.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <Header mesa={mesa} onBack={onHome} />
      <main className="container pb-10">
        <h1 className="font-display text-4xl font-semibold mb-2">Llamar al mesero</h1>
        <p className="text-muted mb-6">Elige lo que necesitas y avisamos a tu mesero sin que pierdas tu lugar.</p>
        {msg && <div className="mb-6"><Mensaje>{msg}</Mensaje></div>}
        <div className="grid sm:grid-cols-2 gap-6">
          {SOLICITUDES.map((s) => (
            <article key={s.id} className="glass rounded-3xl p-6 flex flex-col gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold">{s.titulo}</h2>
                <p className="text-muted mt-1">{s.texto}</p>
              </div>
              <button
                onClick={() => pedir(s)}
                disabled={busy !== null || sent[s.id]}
                className="primary-btn min-h-[56px] text-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy === s.id ? "Enviando…" : sent[s.id] ? "Solicitud enviada" : "Enviar solicitud"}
              </button>
            </article>
          ))}
        </div>
      </main>
    </>
  );
};

export default WaiterScreen;