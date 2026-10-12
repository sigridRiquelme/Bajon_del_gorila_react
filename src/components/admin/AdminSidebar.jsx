import { NavLink } from "react-router-dom";
import "../../styles/admin.css";

function AdminSidebar() {
    return (
        <aside className="admin-sidebar">

            <h2>ADMINISTRACIÓN</h2>

            <nav className="nav flex-column">

                <NavLink
                    to="/admin"
                    end
                    className="nav-link"
                >
                    <i className="bi bi-speedometer2"></i>
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/productos"
                    className="nav-link"
                >
                    <i className="bi bi-box-seam"></i>
                    Productos
                </NavLink>

                <NavLink
                    to="/admin/pedidos"
                    className="nav-link"
                >
                    <i className="bi bi-receipt"></i>
                    Pedidos
                </NavLink>

                <NavLink
                    to="/admin/usuarios"
                    className="nav-link"
                >
                    <i className="bi bi-people"></i>
                    Usuarios
                </NavLink>

                <hr />

                <NavLink
                    to="/"
                    className="nav-link"
                >
                    <i className="bi bi-arrow-left"></i>
                    Volver al sitio
                </NavLink>

            </nav>

        </aside>
    );
}

export default AdminSidebar;