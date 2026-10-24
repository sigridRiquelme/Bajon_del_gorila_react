import {
    useEffect,
    useState
} from "react";

import {
    Link,
    NavLink
} from "react-router-dom";

import {
    obtenerUsuarioPorId
} from "../data/usuarios.js";

import {
    obtenerCantidadCarrito
} from "../data/carrito.js";

import "../styles/Header.css";


function Header() {

    const usuarioActualId =
        localStorage.getItem(
            "usuarioActualId"
        );


    const usuarioActual =
        usuarioActualId !== null
            ? obtenerUsuarioPorId(
                Number(usuarioActualId)
            )
            : null;


    const esAdministrador =
        usuarioActual?.rol ===
        "Administrador";


    // CADA USUARIO ENTRA A SU PERFIL CORRESPONDIENTE

    let rutaCuenta = "/login";

    if (usuarioActual) {

        if (esAdministrador) {

            rutaCuenta =
                "/admin/perfil";

        } else {

            rutaCuenta =
                "/perfil";
        }
    }


    const [
        cantidadCarrito,
        setCantidadCarrito
    ] = useState(
        obtenerCantidadCarrito()
    );


    // ACTUALIZO EL CONTADOR CUANDO CAMBIA EL CARRITO

    useEffect(() => {

        const actualizarContador = () => {

            setCantidadCarrito(
                obtenerCantidadCarrito()
            );
        };


        window.addEventListener(
            "carritoActualizado",
            actualizarContador
        );


        return () => {

            window.removeEventListener(
                "carritoActualizado",
                actualizarContador
            );
        };

    }, []);


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
                    to={rutaCuenta}
                    className="icono-header"
                    aria-label="Mi cuenta"
                >
                    <i className="bi bi-person"></i>
                </Link>


                {/* EL ADMIN NO PUEDE COMPRAR */}

                {!esAdministrador && (

                    <Link
                        to="/carrito"
                        className="carrito-header"
                        aria-label="Carrito"
                    >
                        <i className="bi bi-bag"></i>

                        <span className="contador-header">
                            {cantidadCarrito}
                        </span>
                    </Link>

                )}


                {esAdministrador ? (

                    <Link
                        to="/admin"
                        className="btn-pedir-header"
                    >
                        PANEL ADMIN
                    </Link>

                ) : (

                    <Link
                        to="/menu"
                        className="btn-pedir-header"
                    >
                        PEDIR AHORA
                    </Link>

                )}

            </div>

        </header>

    );
}


export default Header;