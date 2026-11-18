import {
    useEffect,
    useState
} from "react";

import {
    Link,
    NavLink,
    useLocation
} from "react-router-dom";

import {
    obtenerCantidadCarrito
} from "../data/carrito.js";

import "../styles/Header.css";


function Header() {

    const location =
        useLocation();


    const token =
        localStorage.getItem(
            "token"
        );


    const rol =
        localStorage.getItem(
            "usuarioRol"
        );


    const esAdministrador =
        rol ===
        "ADMINISTRADOR";


    const esVendedor =
        rol ===
        "VENDEDOR";


    const esCliente =
        rol ===
        "CLIENTE";


    // DEFINO A QUE PERFIL DEBE IR CADA USUARIO

    let rutaCuenta =
        "/login";


    if (
        token
        &&
        esCliente
    ) {

        rutaCuenta =
            "/perfil";
    }


    if (
        token
        &&
        (
            esAdministrador
            ||
            esVendedor
        )
    ) {

        rutaCuenta =
            "/admin/perfil";
    }


    const [
        cantidadCarrito,
        setCantidadCarrito
    ] = useState(
        obtenerCantidadCarrito()
    );


    // ACTUALIZO EL CONTADOR DEL CARRITO

    useEffect(() => {

        const actualizarContador = () => {

            setCantidadCarrito(
                obtenerCantidadCarrito()
            );
        };


        actualizarContador();


        window.addEventListener(
            "carritoActualizado",
            actualizarContador
        );


        window.addEventListener(
            "storage",
            actualizarContador
        );


        return () => {

            window.removeEventListener(
                "carritoActualizado",
                actualizarContador
            );


            window.removeEventListener(
                "storage",
                actualizarContador
            );
        };

    }, [
        location.pathname
    ]);


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
                    to={
                        rutaCuenta
                    }
                    className="icono-header"
                    aria-label="Mi cuenta"
                >

                    <i className="bi bi-person"></i>

                </Link>


                {/* CLIENTES E INVITADOS PUEDEN USAR CARRITO */}

                {!esAdministrador
                &&
                !esVendedor && (

                    <Link
                        to="/carrito"
                        className="carrito-header"
                        aria-label="Carrito"
                    >

                        <i className="bi bi-bag"></i>


                        <span className="contador-header">

                            {
                                cantidadCarrito
                            }

                        </span>

                    </Link>

                )}


                {/* ADMINISTRADOR */}

                {esAdministrador && (

                    <Link
                        to="/admin"
                        className="btn-pedir-header"
                    >
                        PANEL ADMIN
                    </Link>

                )}


                {/* VENDEDOR */}

                {esVendedor && (

                    <Link
                        to="/admin"
                        className="btn-pedir-header"
                    >
                        PANEL VENDEDOR
                    </Link>

                )}


                {/* CLIENTE O INVITADO */}

                {!esAdministrador
                &&
                !esVendedor && (

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