import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import Login from "./components/Login.jsx";
import Registro from "./components/Registro.jsx";
import Nosotros from "./components/Nosotros.jsx";
import Contacto from "./components/Contacto.jsx";

import Inicio from "./pages/Inicio.jsx";
import Menu from "./pages/Menu.jsx";
import DetalleProducto from "./pages/DetalleProducto.jsx";
import Promociones from "./pages/Promociones.jsx";
import PerfilCliente from "./pages/PerfilCliente.jsx";

import Carrito from "./pages/carrito/Carrito.jsx";
import Checkout from "./pages/carrito/Checkout.jsx";
import CompraExitosa from "./pages/carrito/CompraExitosa.jsx";
import CompraError from "./pages/carrito/CompraError.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import Productos from "./pages/admin/Productos.jsx";
import ProductosCriticos from "./pages/admin/ProductosCriticos.jsx";
import ReporteInventario from "./pages/admin/ReporteInventario.jsx";
import Pedidos from "./pages/admin/Pedidos.jsx";
import Usuarios from "./pages/admin/Usuarios.jsx";
import PerfilAdmin from "./pages/admin/PerfilAdmin.jsx";

import ReporteUsuarios from "./pages/admin/ReporteUsuarios.jsx";
import ReporteVentas from "./pages/admin/ReporteVentas.jsx";
import ReporteProductosVendidos from "./pages/admin/ReporteProductosVendidos.jsx";


function App() {

    return (

        <Routes>

            {/* PAGINAS PUBLICAS */}

            <Route element={<PublicLayout />}>

                <Route path="/" element={<Inicio />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/producto/:codigo" element={<DetalleProducto />} />
                <Route path="/promociones" element={<Promociones />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/perfil" element={<PerfilCliente />} />

                {/* FLUJO DE COMPRA */}

                <Route path="/carrito" element={<Carrito />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/compra-exitosa" element={<CompraExitosa />} />
                <Route path="/compra-error" element={<CompraError />} />

            </Route>


            {/* PANEL ADMIN */}

            <Route path="/admin" element={<AdminLayout />}>

                <Route index element={<Dashboard />} />

                <Route path="productos" element={<Productos />} />
                <Route path="productos/criticos" element={<ProductosCriticos />} />
                <Route path="productos/reporte" element={<ReporteInventario />} />

                <Route path="pedidos" element={<Pedidos />} />
                <Route path="usuarios" element={<Usuarios />} />

                <Route path="reportes/usuarios" element={<ReporteUsuarios />} />
                <Route path="reportes/ventas" element={<ReporteVentas />} />
                <Route path="reportes/productos-vendidos" element={<ReporteProductosVendidos />} />

                <Route path="perfil" element={<PerfilAdmin />} />

            </Route>

        </Routes>
    );
}


export default App;