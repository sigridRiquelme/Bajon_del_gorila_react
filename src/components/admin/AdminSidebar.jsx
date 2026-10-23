import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/admin.css";

function AdminSidebar() {

    const [menuProductosAbierto, setMenuProductosAbierto] = useState(false);
    const [menuReportesAbierto, setMenuReportesAbierto] = useState(false);

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


                <div className="nav-reportes">

                    <button
                        type="button"
                        className="nav-link nav-reportes-btn"
                        onClick={() =>
                            setMenuReportesAbierto(!menuReportesAbierto)
                        }
                    >
                        <span className="nav-reportes-texto">
                            <i className="bi bi-bar-chart"></i>
                            Reportes
                        </span>

                        <i
                            className={
                                menuReportesAbierto
                                    ? "bi bi-chevron-up"
                                    : "bi bi-chevron-down"
                            }
                        ></i>
                    </button>


                    {menuReportesAbierto && (

                        <div className="submenu-reportes">

                            <NavLink
                                to="/admin/reportes/usuarios"
                                className="submenu-link"
                            >
                                Reporte de usuarios
                            </NavLink>

                            <NavLink
                                to="/admin/reportes/pedidos"
                                className="submenu-link"
                            >
                                Reporte de ventas
                            </NavLink>

                            <NavLink
                                to="/admin/reportes/productos-vendidos"
                                className="submenu-link"
                            >
                                Productos vendidos
                            </NavLink>

                        </div>

                    )}

                    <NavLink
                        to="/admin/perfil"
                        className="nav-link"
                    >
                        <i className="bi bi-person-circle"></i>
                        Perfil
                    </NavLink>

                </div>


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