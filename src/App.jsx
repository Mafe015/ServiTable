import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import HomeScreen from "./screens/HomeScreen";
import MenuScreen from "./screens/MenuScreen";
import WaiterScreen from "./screens/WaiterScreen";
import BillScreen from "./screens/BillScreen";

const MESA = "5"; // Luego vendrá del backend o de la configuración de la pantalla.

const Shell = () => {
  const [screen, setScreen] = useState("home"); // home | menu | waiter | bill
  const { toast } = useApp();
  const home = () => setScreen("home");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      <div aria-hidden className="pointer-events-none fixed -top-40 -left-40 w-[42rem] h-[42rem] rounded-full bg-coffee-600/40 blur-[140px]" />
      <div aria-hidden className="pointer-events-none fixed -bottom-48 -right-40 w-[44rem] h-[44rem] rounded-full bg-coffee-800/70 blur-[140px]" />
      <div aria-hidden className="pointer-events-none fixed top-1/3 left-1/2 w-[30rem] h-[30rem] rounded-full bg-navy-700/50 blur-[120px]" />
      <div className="relative">
        {screen === "home" && <HomeScreen mesa={MESA} go={setScreen} />}
        {screen === "menu" && <MenuScreen mesa={MESA} onHome={home} onPay={() => setScreen("bill")} />}
        {screen === "waiter" && <WaiterScreen mesa={MESA} onHome={home} />}
        {screen === "bill" && <BillScreen mesa={MESA} onHome={home} onMenu={() => setScreen("menu")} />}
      </div>
      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-primary text-navy-900 font-semibold rounded-full px-6 py-3 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
};

const App = () => (
  <AppProvider>
    <Shell />
  </AppProvider>
);

export default App;
