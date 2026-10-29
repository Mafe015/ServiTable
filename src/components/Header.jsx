const Header = ({ mesa, onBack, right }) => (
  <header className="container flex flex-wrap items-center justify-between gap-3 py-4 lg:py-6">
    <div className="flex items-center gap-4">
      {onBack && (
        <button onClick={onBack} className="glass rounded-full min-h-[48px] px-5 text-lg font-medium active:scale-95">
          Volver al inicio
        </button>
      )}
      <p className="font-display text-3xl lg:text-4xl font-semibold">
        Servi<span className="text-primary">table</span>
      </p>
    </div>
    <div className="flex items-center gap-3">
      {right}
      <p className="glass rounded-full px-5 py-2 text-lg font-medium">Mesa {mesa}</p>
    </div>
  </header>
);

export default Header;
