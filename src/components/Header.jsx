import { Link, NavLink } from "react-router-dom";
import "../styles/header.css";

function Header() {
    return (
        <header className="header-checkout">

            <Link
                className="logo-checkout"
                to="/"
                aria-label="Ir al inicio"
            >
                <img
                    src="/img/logo-bajon-2.png"
                    alt="El Bajón del Gorila"
                />
            </Link>

            <nav
                className="navbar-checkout"
                aria-label="Navegación principal"
            >

                <NavLink to="/">
                    Inicio
                </NavLink>

                <NavLink to="/menu">
                    Menú
                </NavLink>

                <NavLink to="/promociones">
                    Promociones
                </NavLink>

                <NavLink to="/nosotros">
                    Quiénes Somos
                </NavLink>

                <NavLink to="/contacto">
                    Contacto
                </NavLink>

            </nav>

            <div className="acciones-header">

                <Link
                    to="/login"
                    className="icono-header"
                    aria-label="Mi cuenta"
                >
                    <i className="bi bi-person"></i>
                </Link>

                <Link
                    to="/carrito"
                    className="carrito-header"
                    aria-label="Carrito"
                >
                    <i className="bi bi-bag"></i>

                    <span className="contador-header">
                        0
                    </span>
                </Link>

                <Link
                    to="/menu"
                    className="btn-pedir-header"
                >
                    PEDIR AHORA
                </Link>

            </div>

        </header>
    );
}

export default Header;