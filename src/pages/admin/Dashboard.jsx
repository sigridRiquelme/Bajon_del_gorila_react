import { NavLink } from "react-router-dom";
import "../../styles/dashboard.css";

function Dashboard() {

    return (
        <main className="dashboard-admin">

            <section className="dashboard-bienvenida">

                <span className="dashboard-etiqueta">
                    ADMINISTRACIÓN
                </span>

                <h1>
                    Panel de administración
                </h1>

                <p>
                    Bienvenido al panel de administración de
                    El Bajón del Gorila.
                </p>

            </section>


            <section className="dashboard-accesos">

                <NavLink
                    to="/admin/productos"
                    className="dashboard-card"
                >
                    <i className="bi bi-box-seam"></i>

                    <div>
                        <h2>Productos</h2>
                        <p>
                            Gestionar productos e inventario
                        </p>
                    </div>
                </NavLink>


                <NavLink
                    to="/admin/pedidos"
                    className="dashboard-card"
                >
                    <i className="bi bi-receipt"></i>

                    <div>
                        <h2>Pedidos</h2>
                        <p>
                            Revisar órdenes y boletas
                        </p>
                    </div>
                </NavLink>


                <NavLink
                    to="/admin/usuarios"
                    className="dashboard-card"
                >
                    <i className="bi bi-people"></i>

                    <div>
                        <h2>Usuarios</h2>
                        <p>
                            Revisar usuarios registrados
                        </p>
                    </div>
                </NavLink>


                <NavLink
                    to="/admin/reportes/ventas"
                    className="dashboard-card"
                >
                    <i className="bi bi-bar-chart"></i>

                    <div>
                        <h2>Reportes</h2>
                        <p>
                            Consultar reportes del sistema
                        </p>
                    </div>
                </NavLink>

            </section>

        </main>
    );
}

export default Dashboard;