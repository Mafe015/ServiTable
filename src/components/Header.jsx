const Header = ({ mesa }) => (
  <header className="container flex items-center justify-between py-4 lg:py-6">
    <p className="font-display text-3xl lg:text-4xl font-semibold">
      Servi<span className="text-primary">table</span>
    </p>
    <p className="glass rounded-full px-5 py-2 text-lg font-medium">Mesa {mesa}</p>
  </header>
);

export default Header;
