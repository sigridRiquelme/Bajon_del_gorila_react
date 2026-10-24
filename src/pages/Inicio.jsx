import {
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import ProductoCard
    from "../components/ProductoCard.jsx";

import {
    obtenerProductos,
    obtenerPrecioFinal
} from "../data/productos.js";

import {
    obtenerUsuarioPorId
} from "../data/usuarios.js";

import {
    agregarAlCarrito,
    obtenerCarrito
} from "../data/carrito.js";

import "../styles/componentes.css";
import "../styles/inicio.css";
import "../styles/Menu.css";
import "../styles/responsive.css";


function Inicio() {

    const categorias = [
        "🍔 Hamburguesas",
        "🌭 Completos",
        "🥩 Churrascos",
        "🍟 Papas",
        "🔥 Combos",
        "🥤 Bebidas"
    ];


    const [
        carritoActual,
        setCarritoActual
    ] = useState(
        obtenerCarrito()
    );


    const [
        mensajeCarrito,
        setMensajeCarrito
    ] = useState("");


    const [
        hayErrorCarrito,
        setHayErrorCarrito
    ] = useState(false);


    // OBTENGO EL USUARIO ACTUAL

    const usuarioActualId =
        localStorage.getItem(
            "usuarioActualId"
        );


    const usuarioActual =
        usuarioActualId !== null
            ? obtenerUsuarioPorId(
                Number(
                    usuarioActualId
                )
            )
            : null;


    const esAdministrador =
        usuarioActual?.rol ===
        "Administrador";


    // USO LOS PRODUCTOS DEL ADMIN

    const productosDestacados =
        obtenerProductos()
            .filter(
                (producto) =>
                    producto.estado !==
                    "Oculto"
            )
            .slice(
                0,
                4
            )
            .map(
                (producto) => {

                    const productoEnCarrito =
                        carritoActual.find(
                            (item) =>
                                item.codigo ===
                                producto.codigo
                        );


                    const cantidadEnCarrito =
                        productoEnCarrito
                            ? productoEnCarrito.cantidad
                            : 0;


                    const stockDisponible =
                        Math.max(
                            producto.stock -
                            cantidadEnCarrito,
                            0
                        );


                    return {

                        ...producto,

                        id:
                            producto.codigo,

                        valoracion:
                            producto.valoracion ||
                            4.8,

                        stockDisponible:
                            stockDisponible
                    };
                }
            );


    // OBTENGO LA PRIMERA PROMOCION ACTIVA

    const promocionDestacada =
        obtenerProductos().find(
            (producto) =>
                producto.promocion ===
                    true &&
                producto.descuento >
                    0 &&
                producto.estado !==
                    "Oculto"
        );


    const precioPromocion =
        promocionDestacada
            ? obtenerPrecioFinal(
                promocionDestacada
            )
            : 0;


    // AGREGO EL PRODUCTO AL CARRITO

    const agregarProducto = (
        producto,
        cantidad
    ) => {

        setMensajeCarrito("");
        setHayErrorCarrito(false);


        // EL ADMIN NO PUEDE COMPRAR

        if (
            esAdministrador
        ) {

            setMensajeCarrito(
                "La cuenta de administrador no puede realizar compras."
            );


            setHayErrorCarrito(
                true
            );


            return;
        }


        if (
            producto.stockDisponible <=
                0 ||
            producto.estado ===
                "Sin stock"
        ) {

            setMensajeCarrito(
                "Este producto no tiene stock disponible."
            );


            setHayErrorCarrito(
                true
            );


            return;
        }


        if (
            cantidad >
            producto.stockDisponible
        ) {

            setMensajeCarrito(
                `Solo puedes agregar ${producto.stockDisponible} unidades más de ${producto.nombre}.`
            );


            setHayErrorCarrito(
                true
            );


            return;
        }


        for (
            let i = 0;
            i < cantidad;
            i++
        ) {

            agregarAlCarrito(
                producto
            );
        }


        setCarritoActual(
            obtenerCarrito()
        );


        setMensajeCarrito(
            `${cantidad} ${producto.nombre} agregado al carrito.`
        );


        setHayErrorCarrito(
            false
        );
    };


    return (

        <>


            <section className="portada">

                <div
                    className="imagen-portada"
                    aria-hidden="true"
                ></div>


                <div className="contenedor contenido-portada">

                    <div className="texto-portada">


                        <div className="antetitulo-portada">

                            <div className="circulo-gorila">

                                <img
                                    src="/img/logo-bajon.png"
                                    alt="Logo del gorila"
                                />

                            </div>


                            <span className="texto-antetitulo">
                                STREET FOOD • SANTIAGO CHILE
                            </span>

                        </div>


                        <h1>

                            ¿TE PEGÓ

                            <br />

                            EL BAJÓN?

                        </h1>


                        <p className="descripcion-portada">

                            Nosotros nos encargamos del resto.

                            <br />

                            <strong>
                                Hamburguesas, completos, churrascos
                            </strong>

                            {" "}

                            y más.

                        </p>


                        <div className="botones-portada">

                            <Link
                                className="boton boton-principal"
                                to="/menu"
                            >
                                VER EL MENÚ
                            </Link>


                            <Link
                                className="boton boton-borde boton-borde-amarillo"
                                to="/menu"
                            >
                                PEDIR AHORA →
                            </Link>

                        </div>


                        <div className="estadisticas-portada">


                            <div>

                                <div className="numero-estadistica">
                                    5.000+
                                </div>

                                <div className="etiqueta-estadistica">
                                    Clientes felices
                                </div>

                            </div>


                            <div>

                                <div className="numero-estadistica">
                                    4.9★
                                </div>

                                <div className="etiqueta-estadistica">
                                    Valoración
                                </div>

                            </div>


                            <div>

                                <div className="numero-estadistica">
                                    30 min
                                </div>

                                <div className="etiqueta-estadistica">
                                    Delivery promedio
                                </div>

                            </div>


                        </div>

                    </div>

                </div>

            </section>


            <section
                className="franja-categorias"
                aria-label="Categorías del menú"
            >

                <div className="contenedor lista-categorias">

                    {categorias.map(
                        (categoria) => (

                            <Link
                                key={
                                    categoria
                                }
                                className="opcion-categoria"
                                to="/menu"
                            >
                                {
                                    categoria
                                }
                            </Link>

                        )
                    )}

                </div>

            </section>


            <section className="seccion-clara">

                <div className="contenedor">


                    <div className="fila-encabezado-seccion">

                        <div>

                            <p className="antetitulo">
                                🦍 SELECCIÓN DEL GORILA
                            </p>


                            <h2 className="titulo-seccion">

                                LOS FAVORITOS

                                <br />

                                DEL GORILA

                            </h2>

                        </div>


                        <Link
                            className="boton boton-borde"
                            to="/menu"
                        >
                            VER MENÚ COMPLETO →
                        </Link>

                    </div>


                    {mensajeCarrito && (

                        <div
                            className={
                                hayErrorCarrito
                                    ? "mensaje-menu error"
                                    : "mensaje-menu"
                            }
                        >
                            {
                                mensajeCarrito
                            }
                        </div>

                    )}


                    {productosDestacados.length >
                    0 ? (

                        <div className="grilla-productos">

                            {productosDestacados.map(
                                (producto) => (

                                    <ProductoCard
                                        key={
                                            producto.codigo
                                        }
                                        producto={
                                            producto
                                        }
                                        onAgregar={
                                            esAdministrador
                                                ? undefined
                                                : agregarProducto
                                        }
                                    />

                                )
                            )}

                        </div>

                    ) : (

                        <div className="estado-vacio mostrar">

                            <div className="emoji">
                                🦍
                            </div>


                            <h3>
                                NO HAY PRODUCTOS DISPONIBLES
                            </h3>


                            <p>
                                Vuelve a revisar más tarde.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* PROMOCION DESTACADA */}

            {promocionDestacada && (

                <section className="promocion-semanal">

                    <div className="contenedor grilla-promocion-semanal">


                        <div>

                            <span className="etiqueta etiqueta-naranja">
                                🔥 OFERTA DE LA SEMANA
                            </span>


                            <h2 className="titulo-seccion">

                                EL BAJÓN

                                <br />

                                DE LA SEMANA

                            </h2>


                            <p className="texto-principal-promocion">
                                {
                                    promocionDestacada.nombre
                                }
                            </p>


                            <p className="texto-secundario-promocion">
                                {
                                    promocionDestacada.descripcion
                                }
                            </p>


                            <div className="fila-precio">


                                <span className="precio-grande">

                                    $
                                    {
                                        precioPromocion.toLocaleString(
                                            "es-CL"
                                        )
                                    }

                                </span>


                                <span className="precio-anterior">

                                    $
                                    {
                                        promocionDestacada.precio.toLocaleString(
                                            "es-CL"
                                        )
                                    }

                                </span>


                                <span className="etiqueta etiqueta-verde">

                                    -
                                    {
                                        promocionDestacada.descuento
                                    }%

                                </span>


                            </div>


                            <Link
                                className="boton boton-amarillo"
                                to={`/producto/${promocionDestacada.codigo}`}
                            >
                                QUIERO ESTA PROMO 🔥
                            </Link>

                        </div>


                        <div className="contenedor-imagen-promocion-semanal">

                            <img
                                className="imagen-promocion-semanal"
                                src={
                                    promocionDestacada.imagen
                                }
                                alt={
                                    promocionDestacada.nombre
                                }
                            />


                            <div className="caja-ahorro">

                                <small>
                                    DESCUENTO
                                </small>


                                <strong>

                                    {
                                        promocionDestacada.descuento
                                    }%

                                </strong>

                            </div>

                        </div>


                    </div>

                </section>

            )}


            <section className="seccion-clara">

                <div className="contenedor">


                    <div className="encabezado-razones">

                        <p className="antetitulo">
                            NUESTRO COMPROMISO
                        </p>


                        <h2 className="titulo-seccion">
                            ¿POR QUÉ ELEGIRNOS?
                        </h2>

                    </div>


                    <div className="grilla-razones">


                        <article className="tarjeta-razon">

                            <div className="icono-razon">
                                🔥
                            </div>


                            <h3>
                                Preparado al momento
                            </h3>


                            <p>
                                Cada pedido sale fresco desde la parrilla,
                                sin excepciones.
                            </p>

                        </article>


                        <article className="tarjeta-razon">

                            <div className="icono-razon">
                                🍔
                            </div>


                            <h3>
                                Ingredientes seleccionados
                            </h3>


                            <p>
                                Solo usamos insumos de calidad para que
                                el bajón valga la pena.
                            </p>

                        </article>


                        <article className="tarjeta-razon">

                            <div className="icono-razon">
                                🛵
                            </div>


                            <h3>
                                Delivery rápido
                            </h3>


                            <p>
                                Tu pedido llega en menos de 40 minutos
                                o te damos un descuento.
                            </p>

                        </article>


                        <article className="tarjeta-razon">

                            <div className="icono-razon">
                                💳
                            </div>


                            <h3>
                                Pago fácil
                            </h3>


                            <p>
                                Efectivo, débito, crédito y transferencia.
                                Como a ti te acomode.
                            </p>

                        </article>


                    </div>

                </div>

            </section>


            <section className="banner-accion">

                <div className="contenedor">

                    <h2 className="titulo-seccion">
                        EL BAJÓN NO ESPERA
                    </h2>


                    <p>
                        Pide ahora y recíbelo en menos de 40 minutos.
                    </p>


                    <Link
                        className="boton boton-amarillo"
                        to="/menu"
                    >
                        PEDIR AHORA 🍔
                    </Link>

                </div>

            </section>


        </>
    );
}


export default Inicio;