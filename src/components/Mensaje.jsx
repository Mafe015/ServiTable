const Mensaje = ({ children }) => (
  <div role="status" className="glass rounded-3xl p-6 text-lg text-muted">
    {children}
  </div>
);

export default Mensaje;
