import {
    useState
} from "react";

import {
    Link,
    Navigate,
    useNavigate
} from "react-router-dom";

import {
    obtenerCarrito,
    cambiarCantidad,
    eliminarDelCarrito
} from "../../data/carrito.js";

import {
    obtenerProductos
} from "../../data/productos.js";

import {
    obtenerUsuarioPorId
} from "../../data/usuarios.js";

import "../../styles/carrito.css";


function Carrito() {

    const navigate =
        useNavigate();


    // OBTENGO EL USUARIO SI HAY SESION

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


    const [
        carrito,
        setCarrito
    ] = useState(
        obtenerCarrito()
    );


    const [
        mensaje,
        setMensaje
    ] = useState("");


    const [
        hayError,
        setHayError
    ] = useState(false);


    // EL ADMIN NO PUEDE COMPRAR

    if (
        esAdministrador
    ) {

        return (
            <Navigate
                to="/admin"
                replace
            />
        );
    }


    // BUSCO EL STOCK ACTUAL

    const obtenerStockActual = (
        codigo
    ) => {

        const producto =
            obtenerProductos().find(
                (producto) =>
                    producto.codigo ===
                    codigo
            );


        return producto
            ? producto.stock
            : 0;
    };


    const aumentarCantidad = (
        item
    ) => {

        setMensaje("");
        setHayError(false);


        const stockActual =
            obtenerStockActual(
                item.codigo
            );


        if (
            item.cantidad >=
            stockActual
        ) {

            setMensaje(
                `Solo hay ${stockActual} unidades disponibles de ${item.nombre}.`
            );

            setHayError(true);

            return;
        }


        const carritoActualizado =
            cambiarCantidad(
                item.codigo,
                item.cantidad + 1
            );


        setCarrito(
            carritoActualizado
        );
    };


    const disminuirCantidad = (
        item
    ) => {

        setMensaje("");
        setHayError(false);


        if (
            item.cantidad <=
            1
        ) {

            const carritoActualizado =
                eliminarDelCarrito(
                    item.codigo
                );


            setCarrito(
                carritoActualizado
            );

            return;
        }


        const carritoActualizado =
            cambiarCantidad(
                item.codigo,
                item.cantidad - 1
            );


        setCarrito(
            carritoActualizado
        );
    };


    const eliminarProducto = (
        codigo
    ) => {

        const carritoActualizado =
            eliminarDelCarrito(
                codigo
            );


        setCarrito(
            carritoActualizado
        );


        setMensaje(
            "Producto eliminado del carrito."
        );

        setHayError(false);
    };


    // CALCULO LOS TOTALES

    const totalPedido =
        carrito.reduce(
            (
                total,
                item
            ) =>
                total +
                item.precio *
                item.cantidad,
            0
        );


    const neto =
        Math.round(
            totalPedido /
            1.19
        );


    const iva =
        totalPedido -
        neto;


    // CLIENTE O INVITADO PUEDEN CONTINUAR

    const continuarCompra = () => {

        setMensaje("");
        setHayError(false);


        if (
            carrito.length ===
            0
        ) {

            setMensaje(
                "Tu carrito está vacío."
            );

            setHayError(true);

            return;
        }


        navigate(
            "/checkout"
        );
    };


    return (

        <main className="pagina-carrito">

            <div className="carrito-contenedor">


                <section className="pasos-checkout">

                    <div className="paso activo">

                        <span className="numero-paso">
                            1
                        </span>

                        <span>
                            Carrito
                        </span>

                    </div>


                    <div className="linea-paso"></div>


                    <div className="paso">

                        <span className="numero-paso">
                            2
                        </span>

                        <span>
                            Entrega y pago
                        </span>

                    </div>


                    <div className="linea-paso"></div>


                    <div className="paso">

                        <span className="numero-paso">
                            3
                        </span>

                        <span>
                            Confirmación
                        </span>

                    </div>

                </section>


                <div className="carrito-encabezado">

                    <div>

                        <p className="carrito-antetitulo">
                            TU PEDIDO
                        </p>

                        <h1>
                            CARRITO
                        </h1>

                    </div>


                    <Link
                        to="/menu"
                        className="btn-seguir-comprando"
                    >
                        ← SEGUIR COMPRANDO
                    </Link>

                </div>


                {mensaje && (

                    <div
                        className={
                            hayError
                                ? "carrito-mensaje error"
                                : "carrito-mensaje"
                        }
                    >
                        {
                            mensaje
                        }
                    </div>

                )}


                {carrito.length ===
                0 ? (

                    <section className="carrito-vacio">

                        <div className="carrito-vacio-icono">
                            🦍
                        </div>


                        <h2>
                            TU CARRITO ESTÁ VACÍO
                        </h2>


                        <p>
                            Agrega algo del menú para comenzar tu pedido.
                        </p>


                        <Link
                            to="/menu"
                            className="btn-ir-menu"
                        >
                            VER MENÚ
                        </Link>

                    </section>

                ) : (

                    <div className="carrito-grid">


                        <section className="carrito-productos">

                            {carrito.map(
                                (item) => (

                                    <article
                                        key={
                                            item.codigo
                                        }
                                        className="carrito-producto"
                                    >

                                        <div className="carrito-producto-imagen">

                                            <img
                                                src={
                                                    item.imagen
                                                }
                                                alt={
                                                    item.nombre
                                                }
                                            />

                                        </div>


                                        <div className="carrito-producto-info">

                                            <h3>
                                                {
                                                    item.nombre
                                                }
                                            </h3>


                                            <span className="carrito-precio-unitario">

                                                $
                                                {
                                                    item.precio.toLocaleString(
                                                        "es-CL"
                                                    )
                                                }

                                                {" "}
                                                c/u

                                            </span>


                                            <div className="carrito-controles">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        disminuirCantidad(
                                                            item
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>


                                                <span>
                                                    {
                                                        item.cantidad
                                                    }
                                                </span>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        aumentarCantidad(
                                                            item
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>

                                        </div>


                                        <div className="carrito-producto-final">

                                            <strong>

                                                $
                                                {
                                                    (
                                                        item.precio *
                                                        item.cantidad
                                                    ).toLocaleString(
                                                        "es-CL"
                                                    )
                                                }

                                            </strong>


                                            <button
                                                type="button"
                                                className="btn-eliminar-carrito"
                                                onClick={() =>
                                                    eliminarProducto(
                                                        item.codigo
                                                    )
                                                }
                                            >
                                                Eliminar
                                            </button>

                                        </div>

                                    </article>

                                )
                            )}

                        </section>


                        <aside className="carrito-resumen">

                            <h2>
                                RESUMEN DEL PEDIDO
                            </h2>


                            <div className="carrito-resumen-fila">

                                <span>
                                    Productos
                                </span>

                                <strong>

                                    {
                                        carrito.reduce(
                                            (
                                                total,
                                                item
                                            ) =>
                                                total +
                                                item.cantidad,
                                            0
                                        )
                                    }

                                </strong>

                            </div>


                            <div className="carrito-resumen-fila">

                                <span>
                                    Neto
                                </span>

                                <span>

                                    $
                                    {
                                        neto.toLocaleString(
                                            "es-CL"
                                        )
                                    }

                                </span>

                            </div>


                            <div className="carrito-resumen-fila">

                                <span>
                                    IVA 19%
                                </span>

                                <span>

                                    $
                                    {
                                        iva.toLocaleString(
                                            "es-CL"
                                        )
                                    }

                                </span>

                            </div>


                            <div className="carrito-resumen-total">

                                <span>
                                    TOTAL
                                </span>

                                <strong>

                                    $
                                    {
                                        totalPedido.toLocaleString(
                                            "es-CL"
                                        )
                                    }

                                </strong>

                            </div>


                            <button
                                type="button"
                                className="btn-confirmar-compra"
                                onClick={
                                    continuarCompra
                                }
                            >
                                CONTINUAR A ENTREGA →
                            </button>

                        </aside>

                    </div>

                )}

            </div>

        </main>
    );
}


export default Carrito;