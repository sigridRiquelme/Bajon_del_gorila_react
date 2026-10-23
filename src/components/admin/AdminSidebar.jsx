import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../../styles/admin.css";


function AdminSidebar() {

    const location = useLocation();

    const estaEnProductos =
        location.pathname.startsWith("/admin/productos");

    const estaEnReportes =
        location.pathname.startsWith("/admin/reportes");


    const [menuProductosAbierto, setMenuProductosAbierto] = useState(
        estaEnProductos
    );

    const [menuReportesAbierto, setMenuReportesAbierto] = useState(
        estaEnReportes
    );


    useEffect(() => {

        if (estaEnProductos) {
            setMenuProductosAbierto(true);
        }

        if (estaEnReportes) {
            setMenuReportesAbierto(true);
        }

    }, [location.pathname]);


    const claseNav = ({ isActive }) =>
        isActive
            ? "nav-link nav-link-activo"
            : "nav-link";


    const claseSubmenu = ({ isActive }) =>
        isActive
            ? "submenu-link submenu-link-activo"
            : "submenu-link";


    return (

        <aside className="admin-sidebar">

            <h2>ADMINISTRACIÓN</h2>


            <nav className="nav flex-column">

                <NavLink
                    to="/admin"
                    end
                    className={claseNav}
                >
                    <i className="bi bi-speedometer2"></i>
                    Dashboard
                </NavLink>


                <div className="nav-productos">

                    <button
                        type="button"
                        className={`nav-link nav-productos-btn ${
                            estaEnProductos || menuProductosAbierto
                                ? "menu-abierto"
                                : ""
                        }`}
                        onClick={() =>
                            setMenuProductosAbierto(
                                !menuProductosAbierto
                            )
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
                                className={claseSubmenu}
                            >
                                Productos
                            </NavLink>

                            <NavLink
                                to="/admin/productos/criticos"
                                className={claseSubmenu}
                            >
                                Productos críticos
                            </NavLink>

                            <NavLink
                                to="/admin/productos/reporte"
                                className={claseSubmenu}
                            >
                                Reporte inventario
                            </NavLink>

                        </div>

                    )}

                </div>


                <NavLink
                    to="/admin/pedidos"
                    className={claseNav}
                >
                    <i className="bi bi-receipt"></i>
                    Pedidos
                </NavLink>


                <NavLink
                    to="/admin/usuarios"
                    className={claseNav}
                >
                    <i className="bi bi-people"></i>
                    Usuarios
                </NavLink>


                <div className="nav-reportes">

                    <button
                        type="button"
                        className={`nav-link nav-reportes-btn ${
                            estaEnReportes || menuReportesAbierto
                                ? "menu-abierto"
                                : ""
                        }`}
                        onClick={() =>
                            setMenuReportesAbierto(
                                !menuReportesAbierto
                            )
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
                                className={claseSubmenu}
                            >
                                Reporte de usuarios
                            </NavLink>

                            <NavLink
                                to="/admin/reportes/ventas"
                                className={claseSubmenu}
                            >
                                Reporte de ventas
                            </NavLink>

                            <NavLink
                                to="/admin/reportes/productos-vendidos"
                                className={claseSubmenu}
                            >
                                Productos vendidos
                            </NavLink>

                        </div>

                    )}

                </div>


                <NavLink
                    to="/admin/perfil"
                    className={claseNav}
                >
                    <i className="bi bi-person-circle"></i>
                    Perfil
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