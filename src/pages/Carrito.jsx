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
    eliminarDelCarrito,
    vaciarCarrito
} from "../data/carrito.js";

import {
    obtenerProductos,
    actualizarProducto
} from "../data/productos.js";

import {
    obtenerUsuarioPorId
} from "../data/usuarios.js";

import {
    crearPedido
} from "../data/pedidos.js";

import "../styles/carrito.css";


function Carrito() {

    const navigate =
        useNavigate();


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


    const [
        compraExitosa,
        setCompraExitosa
    ] = useState(false);


    const [
        codigoPedido,
        setCodigoPedido
    ] = useState(null);


    const [
        medioPago,
        setMedioPago
    ] = useState("Efectivo");


    if (esAdministrador) {

        return (
            <Navigate
                to="/admin"
                replace
            />
        );
    }


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
            item.cantidad <= 1
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


    const totalPedido =
        carrito.reduce(
            (total, item) =>
                total +
                item.precio *
                item.cantidad,
            0
        );


    const neto =
        Math.round(
            totalPedido / 1.19
        );


    const iva =
        totalPedido - neto;


    const confirmarCompra = () => {

        setMensaje("");
        setHayError(false);


        if (!usuarioActual) {

            navigate(
                "/login"
            );

            return;
        }


        if (
            usuarioActual.rol !==
            "Cliente"
        ) {

            setMensaje(
                "Solo los clientes pueden realizar compras."
            );

            setHayError(true);

            return;
        }


        if (
            carrito.length === 0
        ) {

            setMensaje(
                "Tu carrito está vacío."
            );

            setHayError(true);

            return;
        }


        const productosActuales =
            obtenerProductos();


        for (
            const item of carrito
        ) {

            const productoActual =
                productosActuales.find(
                    (producto) =>
                        producto.codigo ===
                        item.codigo
                );


            if (!productoActual) {

                setMensaje(
                    `${item.nombre} ya no está disponible.`
                );

                setHayError(true);

                return;
            }


            if (
                productoActual.estado ===
                "Oculto"
            ) {

                setMensaje(
                    `${item.nombre} ya no está disponible.`
                );

                setHayError(true);

                return;
            }


            if (
                productoActual.stock <
                item.cantidad
            ) {

                setMensaje(
                    `No hay suficiente stock de ${item.nombre}. Actualmente quedan ${productoActual.stock}.`
                );

                setHayError(true);

                return;
            }
        }


        const fechaActual =
            new Date();


        const fecha =
            `${String(
                fechaActual.getDate()
            ).padStart(2, "0")}/${String(
                fechaActual.getMonth() + 1
            ).padStart(2, "0")}/${fechaActual.getFullYear()}`;


        const hora =
            `${String(
                fechaActual.getHours()
            ).padStart(2, "0")}:${String(
                fechaActual.getMinutes()
            ).padStart(2, "0")}`;


        // GUARDO LOS DATOS COMPLETOS DE LA BOLETA

        const nuevoPedido =
            crearPedido({

                usuarioId:
                    usuarioActual.id,

                cliente:
                    usuarioActual.nombre,

                fecha:
                    fecha,

                hora:
                    hora,

                medioPago:
                    medioPago,

                neto:
                    neto,

                iva:
                    iva,

                total:
                    totalPedido,

                productos:
                    carrito.map(
                        (item) => ({

                            codigoProducto:
                                item.codigo,

                            nombre:
                                item.nombre,

                            cantidad:
                                item.cantidad,

                            precio:
                                item.precio
                        })
                    )
            });


        carrito.forEach(
            (item) => {

                const productoActual =
                    productosActuales.find(
                        (producto) =>
                            producto.codigo ===
                            item.codigo
                    );


                const nuevoStock =
                    productoActual.stock -
                    item.cantidad;


                actualizarProducto(
                    item.codigo,
                    {
                        stock:
                            nuevoStock,

                        estado:
                            nuevoStock === 0
                                ? "Sin stock"
                                : productoActual.estado
                    }
                );
            }
        );


        vaciarCarrito();


        setCarrito([]);


        setCodigoPedido(
            nuevoPedido.codigo
        );


        setCompraExitosa(
            true
        );
    };


    if (compraExitosa) {

        return (

            <main className="pagina-carrito">

                <div className="carrito-contenedor">

                    <section className="carrito-vacio">

                        <div className="carrito-vacio-icono">
                            🦍
                        </div>


                        <h2>
                            ¡PEDIDO REALIZADO!
                        </h2>


                        <p>
                            Tu compra fue registrada correctamente.
                        </p>


                        <p>
                            Boleta #{codigoPedido}
                        </p>


                        <Link
                            to="/perfil"
                            className="btn-ir-menu"
                        >
                            VER MIS BOLETAS
                        </Link>


                        <div className="carrito-volver-menu">

                            <Link
                                to="/menu"
                                className="btn-seguir-comprando"
                            >
                                VOLVER AL MENÚ
                            </Link>

                        </div>

                    </section>

                </div>

            </main>
        );
    }


    return (

        <main className="pagina-carrito">

            <div className="carrito-contenedor">


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
                        {mensaje}
                    </div>

                )}


                {carrito.length === 0 ? (

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
                                                {item.nombre}
                                            </h3>


                                            <span className="carrito-precio-unitario">

                                                $
                                                {item.precio.toLocaleString(
                                                    "es-CL"
                                                )}
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
                                                    {item.cantidad}
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
                                                {(
                                                    item.precio *
                                                    item.cantidad
                                                ).toLocaleString(
                                                    "es-CL"
                                                )}

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
                                RESUMEN
                            </h2>


                            <div className="carrito-resumen-fila">

                                <span>
                                    Productos
                                </span>

                                <strong>

                                    {carrito.reduce(
                                        (total, item) =>
                                            total +
                                            item.cantidad,
                                        0
                                    )}

                                </strong>

                            </div>


                            <div className="carrito-resumen-fila">

                                <span>
                                    Neto
                                </span>

                                <span>
                                    $
                                    {neto.toLocaleString(
                                        "es-CL"
                                    )}
                                </span>

                            </div>


                            <div className="carrito-resumen-fila">

                                <span>
                                    IVA 19%
                                </span>

                                <span>
                                    $
                                    {iva.toLocaleString(
                                        "es-CL"
                                    )}
                                </span>

                            </div>


                            <div className="carrito-resumen-total">

                                <span>
                                    TOTAL
                                </span>

                                <strong>
                                    $
                                    {totalPedido.toLocaleString(
                                        "es-CL"
                                    )}
                                </strong>

                            </div>


                            <div className="carrito-medio-pago">

                                <label htmlFor="medioPago">
                                    Medio de pago
                                </label>


                                <select
                                    id="medioPago"
                                    value={
                                        medioPago
                                    }
                                    onChange={(e) =>
                                        setMedioPago(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="Efectivo">
                                        Efectivo
                                    </option>

                                    <option value="Débito">
                                        Débito
                                    </option>

                                    <option value="Crédito">
                                        Crédito
                                    </option>

                                    <option value="Transferencia">
                                        Transferencia
                                    </option>

                                </select>

                            </div>


                            <button
                                type="button"
                                className="btn-confirmar-compra"
                                onClick={
                                    confirmarCompra
                                }
                            >
                                CONTINUAR COMPRA
                            </button>

                        </aside>

                    </div>

                )}

            </div>

        </main>
    );
}


export default Carrito;