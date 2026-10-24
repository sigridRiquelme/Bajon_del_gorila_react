import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Inicio from "./pages/Inicio.jsx";
import Menu from "./pages/Menu.jsx";
import Promociones from "./pages/Promociones.jsx";

function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/promociones" element={<Promociones />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
