// Aquí se conecta el backend. Por ahora solo simula el envío (600 ms).
// Con el backend sería, por ejemplo:
//   const r = await fetch("https://tu-api.com/solicitudes", { method: "POST",
//     headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mesa, tipo }) });
//   if (!r.ok) throw new Error("No se pudo enviar");
const simular = () => new Promise((ok) => setTimeout(ok, 600));

export const enviarSolicitud = async (tipo) => {
  await simular();
  return { ok: true, tipo };
};

export const pedirCuenta = async (items, total) => {
  await simular();
  return { ok: true, items, total };
};
