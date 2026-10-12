import { Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import Productos from "./pages/admin/Productos.jsx";
import Pedidos from "./pages/admin/Pedidos.jsx";
import Usuarios from "./pages/admin/Usuarios.jsx";

function App() {
    return (
        <Routes>

            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="productos" element={<Productos />} />
                <Route path="pedidos" element={<Pedidos />} />
                <Route path="usuarios" element={<Usuarios />} />
            </Route>

        </Routes>
    );
}

export default App;