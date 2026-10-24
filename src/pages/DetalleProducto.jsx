import {
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    obtenerProductoPorCodigo,
    obtenerPrecioFinal
} from "../data/productos.js";

import {
    obtenerUsuarioPorId
} from "../data/usuarios.js";

import {
    agregarAlCarrito,
    obtenerCarrito
} from "../data/carrito.js";

import "../styles/detalleProducto.css";


function DetalleProducto() {

    const {
        codigo
    } = useParams();


    const producto =
        obtenerProductoPorCodigo(
            Number(
                codigo
            )
        );


    const [
        carritoActual,
        setCarritoActual
    ] = useState(
        obtenerCarrito()
    );


    const [
        cantidad,
        setCantidad
    ] = useState(1);


    const [
        mensaje,
        setMensaje
    ] = useState("");


    const [
        hayError,
        setHayError
    ] = useState(false);


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


    // SI EL PRODUCTO NO EXISTE NO LO MUESTRO

    if (
        !producto ||
        producto.estado ===
        "Oculto"
    ) {

        return (

            <main className="detalle-producto-pagina">

                <div className="detalle-producto-no-disponible">

                    <span>
                        🦍
                    </span>


                    <h1>
                        Producto no disponible
                    </h1>


                    <p>
                        Este producto no existe o ya no está disponible.
                    </p>


                    <Link
                        to="/menu"
                        className="detalle-btn-volver"
                    >
                        VOLVER AL MENÚ
                    </Link>

                </div>

            </main>
        );
    }


    const precioFinal =
        obtenerPrecioFinal(
            producto
        );


    const tienePromocion =
        producto.promocion &&
        producto.descuento >
        0;


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


    const sinStock =
        stockDisponible <=
            0 ||
        producto.estado ===
            "Sin stock";


    const aumentarCantidad = () => {

        if (
            cantidad <
            stockDisponible
        ) {

            setCantidad(
                cantidad + 1
            );
        }
    };


    const disminuirCantidad = () => {

        if (
            cantidad >
            1
        ) {

            setCantidad(
                cantidad - 1
            );
        }
    };


    // AGREGO EL PRODUCTO CON EL PRECIO FINAL

    const agregarProducto = () => {

        setMensaje("");
        setHayError(false);


        if (
            esAdministrador
        ) {

            setMensaje(
                "La cuenta de administrador no puede realizar compras."
            );

            setHayError(
                true
            );

            return;
        }


        if (
            sinStock
        ) {

            setMensaje(
                "Este producto no tiene stock disponible."
            );

            setHayError(
                true
            );

            return;
        }


        if (
            cantidad >
            stockDisponible
        ) {

            setMensaje(
                `Solo quedan ${stockDisponible} unidades disponibles.`
            );

            setHayError(
                true
            );

            return;
        }


        const productoCarrito = {

            ...producto,

            precio:
                precioFinal
        };


        for (
            let i = 0;
            i < cantidad;
            i++
        ) {

            agregarAlCarrito(
                productoCarrito
            );
        }


        setCarritoActual(
            obtenerCarrito()
        );


        setMensaje(
            `${cantidad} ${producto.nombre} agregado al carrito.`
        );


        setCantidad(
            1
        );
    };


    return (

        <main className="detalle-producto-pagina">

            <div className="detalle-producto-contenedor">


                <Link
                    to="/menu"
                    className="detalle-volver-link"
                >
                    ← Volver al menú
                </Link>


                <section className="detalle-producto-card">


                    <div className="detalle-producto-imagen">

                        <img
                            src={
                                producto.imagen
                            }
                            alt={
                                producto.nombre
                            }
                        />


                        {tienePromocion && (

                            <span className="detalle-etiqueta-promocion">

                                -{
                                    producto.descuento
                                }% OFF

                            </span>

                        )}

                    </div>


                    <div className="detalle-producto-info">


                        <span className="detalle-producto-categoria">
                            {
                                producto.categoria
                            }
                        </span>


                        <h1>
                            {
                                producto.nombre
                            }
                        </h1>


                        <p className="detalle-producto-descripcion">
                            {
                                producto.descripcion
                            }
                        </p>


                        {tienePromocion ? (

                            <div className="detalle-precio-promocion">

                                <span className="detalle-precio-anterior">

                                    $
                                    {
                                        producto.precio.toLocaleString(
                                            "es-CL"
                                        )
                                    }

                                </span>


                                <span className="detalle-producto-precio">

                                    $
                                    {
                                        precioFinal.toLocaleString(
                                            "es-CL"
                                        )
                                    }

                                </span>

                            </div>

                        ) : (

                            <div className="detalle-producto-precio">

                                $
                                {
                                    producto.precio.toLocaleString(
                                        "es-CL"
                                    )
                                }

                            </div>

                        )}


                        <div
                            className={
                                sinStock
                                    ? "detalle-producto-stock sin-stock"
                                    : stockDisponible <=
                                        5
                                        ? "detalle-producto-stock stock-bajo"
                                        : "detalle-producto-stock"
                            }
                        >

                            {
                                sinStock
                                    ? "Sin stock disponible"
                                    : stockDisponible <=
                                        5
                                        ? `Últimas ${stockDisponible} unidades disponibles`
                                        : `Stock disponible: ${stockDisponible}`
                            }

                        </div>


                        {mensaje && (

                            <div
                                className={
                                    hayError
                                        ? "detalle-mensaje error"
                                        : "detalle-mensaje"
                                }
                            >
                                {
                                    mensaje
                                }
                            </div>

                        )}


                        {!esAdministrador && (

                            <div className="detalle-compra">


                                <div className="detalle-selector-cantidad">

                                    <span>
                                        Cantidad
                                    </span>


                                    <div>

                                        <button
                                            type="button"
                                            onClick={
                                                disminuirCantidad
                                            }
                                            disabled={
                                                cantidad <=
                                                    1 ||
                                                sinStock
                                            }
                                        >
                                            −
                                        </button>


                                        <strong>
                                            {
                                                sinStock
                                                    ? 0
                                                    : cantidad
                                            }
                                        </strong>


                                        <button
                                            type="button"
                                            onClick={
                                                aumentarCantidad
                                            }
                                            disabled={
                                                sinStock ||
                                                cantidad >=
                                                    stockDisponible
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    className="detalle-btn-agregar"
                                    onClick={
                                        agregarProducto
                                    }
                                    disabled={
                                        sinStock
                                    }
                                >

                                    {
                                        sinStock
                                            ? "SIN STOCK"
                                            : "AGREGAR AL CARRITO"
                                    }

                                </button>

                            </div>

                        )}


                        {esAdministrador && (

                            <div className="detalle-aviso-admin">
                                La cuenta de administrador no puede realizar compras.
                            </div>

                        )}

                    </div>

                </section>

            </div>

        </main>
    );
}


export default DetalleProducto;