// Solicitudes al mesero y a la cuenta: por ahora simuladas (otras historias).
const simular = (ms = 600) => new Promise((ok) => setTimeout(ok, ms));

export const enviarSolicitud = async (tipo) => { await simular(); return { ok: true, tipo }; };
export const pedirCuenta = async () => { await simular(); return { ok: true }; };
