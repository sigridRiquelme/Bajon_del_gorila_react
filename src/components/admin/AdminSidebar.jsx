import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/admin.css";

function AdminSidebar() {

    const [menuProductosAbierto, setMenuProductosAbierto] = useState(false);

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


                {/* PRODUCTOS */}

                <div className="nav-productos">

                    <button
                        type="button"
                        className="nav-link nav-productos-btn"
                        onClick={() =>
                            setMenuProductosAbierto(!menuProductosAbierto)
                        }
                    >
                        <span className="nav-productos-texto">
                            <i className="bi bi-box-seam"></i>
                            Productos
                        </span>

                        <i
                            className={
                                menuProductosAbierto
                                    ? "bi bi-chevron-up"
                                    : "bi bi-chevron-down"
                            }
                        ></i>
                    </button>


                    {menuProductosAbierto && (

                        <div className="submenu-productos">

                            <NavLink
                                to="/admin/productos"
                                end
                                className="submenu-link"
                            >
                                Productos
                            </NavLink>

                            <NavLink
                                to="/admin/productos/criticos"
                                className="submenu-link"
                            >
                                Productos críticos
                            </NavLink>

                            <NavLink
                                to="/admin/productos/reporte"
                                className="submenu-link"
                            >
                                Reporte inventario
                            </NavLink>

                        </div>

                    )}

                </div>


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