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
    vaciarCarrito
} from "../../data/carrito.js";

import {
    obtenerProductos,
    actualizarProducto
} from "../../data/productos.js";

import {
    obtenerUsuarioPorId
} from "../../data/usuarios.js";

import {
    crearPedido
} from "../../data/pedidos.js";

import "../../styles/checkout.css";


function Checkout() {

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


    // GUARDO EL CARRITO AL ENTRAR

    const [
        carrito
    ] = useState(
        obtenerCarrito()
    );


    // SI HAY USUARIO CARGO SUS DATOS

    const [
        nombre,
        setNombre
    ] = useState(
        usuarioActual?.nombre ||
        ""
    );


    const [
        correo,
        setCorreo
    ] = useState(
        usuarioActual?.correo ||
        ""
    );


    const [
        telefono,
        setTelefono
    ] = useState(
        usuarioActual?.telefono ||
        ""
    );


    const [
        tipoEntrega,
        setTipoEntrega
    ] = useState(
        "Delivery"
    );


    const [
        direccion,
        setDireccion
    ] = useState(
        usuarioActual?.direccion ||
        ""
    );


    const [
        comuna,
        setComuna
    ] = useState("");


    const [
        referencia,
        setReferencia
    ] = useState("");


    const [
        medioPago,
        setMedioPago
    ] = useState(
        "Tarjeta"
    );


    const [
        errores,
        setErrores
    ] = useState({});


    // EL ADMIN NO PUEDE COMPRAR

    if (
        usuarioActual?.rol ===
        "Administrador"
    ) {

        return (
            <Navigate
                to="/admin"
                replace
            />
        );
    }


    // SI NO HAY PRODUCTOS VUELVO AL CARRITO

    if (
        carrito.length ===
        0
    ) {

        return (
            <Navigate
                to="/carrito"
                replace
            />
        );
    }


    // CALCULO LOS TOTALES

    const subtotal =
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


    const costoDelivery =
        tipoEntrega ===
            "Delivery"
            ? 2000
            : 0;


    const total =
        subtotal +
        costoDelivery;


    const neto =
        Math.round(
            total /
            1.19
        );


    const iva =
        total -
        neto;


    // VOY AL LOGIN PERO RECUERDO QUE ESTABA COMPRANDO

    const iniciarSesion = () => {

        navigate(
            "/login",
            {
                state: {
                    desdeCheckout: true
                }
            }
        );
    };


    const limpiarError = (
        campo
    ) => {

        setErrores({
            ...errores,
            [campo]: ""
        });
    };


    // VALIDO LOS DATOS

    const validarFormulario = () => {

        const nuevosErrores = {};


        if (
            nombre.trim().length <
            3
        ) {

            nuevosErrores.nombre =
                "El nombre debe tener al menos 3 caracteres.";

        } else if (
            nombre.trim().length >
            50
        ) {

            nuevosErrores.nombre =
                "El nombre no puede superar los 50 caracteres.";
        }


        const correoValido =
            /^[^\s@]+@(gmail\.com|duoc\.cl|duocuc\.cl)$/i;


        if (
            !correoValido.test(
                correo.trim()
            )
        ) {

            nuevosErrores.correo =
                "Ingresa un correo Gmail, Duoc o DuocUC válido.";
        }


        const telefonoValido =
            /^\+569\s?\d{8}$/;


        if (
            !telefonoValido.test(
                telefono.trim()
            )
        ) {

            nuevosErrores.telefono =
                "Ingresa un teléfono válido. Ej: +569 12345678.";
        }


        // SI ES DELIVERY PIDO DIRECCION Y COMUNA

        if (
            tipoEntrega ===
            "Delivery"
        ) {

            if (
                direccion.trim().length <
                10
            ) {

                nuevosErrores.direccion =
                    "La dirección debe tener al menos 10 caracteres.";

            } else if (
                direccion.trim().length >
                100
            ) {

                nuevosErrores.direccion =
                    "La dirección no puede superar los 100 caracteres.";
            }


            if (
                comuna ===
                ""
            ) {

                nuevosErrores.comuna =
                    "Selecciona una comuna.";
            }
        }


        setErrores(
            nuevosErrores
        );


        return (
            Object.keys(
                nuevosErrores
            ).length === 0
        );
    };


    // GUARDO EL ERROR Y VOY A LA PAGINA DE ERROR

    const irAError = (
        mensaje
    ) => {

        sessionStorage.setItem(
            "compraError",
            mensaje
        );


        navigate(
            "/compra-error"
        );
    };


    // CONFIRMO EL PEDIDO

    const confirmarPedido = (
        e
    ) => {

        e.preventDefault();


        if (
            !validarFormulario()
        ) {

            return;
        }


        // REVISO EL STOCK ANTES DE COMPRAR

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


            if (
                !productoActual
            ) {

                irAError(
                    `${item.nombre} ya no está disponible.`
                );

                return;
            }


            if (
                productoActual.estado ===
                "Oculto"
            ) {

                irAError(
                    `${item.nombre} ya no está disponible.`
                );

                return;
            }


            if (
                productoActual.stock <
                item.cantidad
            ) {

                irAError(
                    `No hay suficiente stock de ${item.nombre}. Actualmente quedan ${productoActual.stock}.`
                );

                return;
            }
        }


        try {

            // OBTENGO FECHA Y HORA

            const fechaActual =
                new Date();


            const fecha =
                `${String(
                    fechaActual.getDate()
                ).padStart(
                    2,
                    "0"
                )}/${String(
                    fechaActual.getMonth() +
                    1
                ).padStart(
                    2,
                    "0"
                )}/${fechaActual.getFullYear()}`;


            const hora =
                `${String(
                    fechaActual.getHours()
                ).padStart(
                    2,
                    "0"
                )}:${String(
                    fechaActual.getMinutes()
                ).padStart(
                    2,
                    "0"
                )}`;


            // CREO EL PEDIDO

            const nuevoPedido =
                crearPedido({

                    usuarioId:
                        usuarioActual
                            ? usuarioActual.id
                            : null,

                    cliente:
                        nombre.trim(),

                    correo:
                        correo.trim(),

                    telefono:
                        telefono.trim(),

                    fecha:
                        fecha,

                    hora:
                        hora,

                    tipoEntrega:
                        tipoEntrega,

                    direccion:
                        tipoEntrega ===
                            "Delivery"
                            ? direccion.trim()
                            : "Retiro en local",

                    comuna:
                        tipoEntrega ===
                            "Delivery"
                            ? comuna
                            : "",

                    referencia:
                        tipoEntrega ===
                            "Delivery"
                            ? referencia.trim()
                            : "",

                    medioPago:
                        medioPago,

                    subtotal:
                        subtotal,

                    costoDelivery:
                        costoDelivery,

                    neto:
                        neto,

                    iva:
                        iva,

                    total:
                        total,

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
                                    item.precio,

                                imagen:
                                    item.imagen
                            })
                        )
                });


            // DESCUENTO EL STOCK

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
                                nuevoStock ===
                                    0
                                    ? "Sin stock"
                                    : productoActual.estado
                        }
                    );
                }
            );


            // GUARDO LA COMPRA PARA LA CONFIRMACION

            sessionStorage.setItem(
                "ultimaCompra",
                JSON.stringify(
                    nuevoPedido
                )
            );


            sessionStorage.setItem(
                "compraFueInvitado",
                usuarioActual
                    ? "false"
                    : "true"
            );


            sessionStorage.removeItem(
                "compraError"
            );


            // VACIO EL CARRITO

            vaciarCarrito();


            navigate(
                "/compra-exitosa"
            );

        } catch {

            irAError(
                "Ocurrió un problema al registrar tu pedido. Tu carrito sigue guardado."
            );
        }
    };


    return (

        <main className="pagina-checkout">

            <div className="checkout-contenedor">


                <section className="pasos-checkout">

                    <div className="paso completado">

                        <span className="numero-paso">
                            ✓
                        </span>

                        <span>
                            Carrito
                        </span>

                    </div>


                    <div className="linea-paso completada"></div>


                    <div className="paso activo">

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


                <div className="checkout-grid">


                    <section className="checkout-formulario">

                        <p className="checkout-antetitulo">
                            PASO 2
                        </p>


                        <h1>
                            DATOS DE ENTREGA
                        </h1>


                        {/* AVISO PARA INVITADO */}

                        {!usuarioActual && (

                            <div className="checkout-aviso-invitado">

                                <strong>
                                    Estás comprando como invitado
                                </strong>


                                <span>
                                    Puedes continuar así o iniciar sesión para usar tus datos guardados.
                                </span>


                                <button
                                    type="button"
                                    className="btn-iniciar-sesion-invitado"
                                    onClick={
                                        iniciarSesion
                                    }
                                >
                                    INICIAR SESIÓN
                                </button>

                            </div>

                        )}


                        <form
                            id="formCheckout"
                            onSubmit={
                                confirmarPedido
                            }
                        >


                            <div className="checkout-campo">

                                <label htmlFor="nombreCheckout">
                                    Nombre completo *
                                </label>


                                <input
                                    id="nombreCheckout"
                                    type="text"
                                    value={
                                        nombre
                                    }
                                    onChange={(e) => {

                                        setNombre(
                                            e.target.value
                                        );

                                        limpiarError(
                                            "nombre"
                                        );
                                    }}
                                    className={
                                        errores.nombre
                                            ? "campo-error"
                                            : ""
                                    }
                                />


                                {errores.nombre && (

                                    <small className="checkout-error">
                                        {
                                            errores.nombre
                                        }
                                    </small>

                                )}

                            </div>


                            <div className="checkout-fila">


                                <div className="checkout-campo">

                                    <label htmlFor="telefonoCheckout">
                                        Teléfono *
                                    </label>


                                    <input
                                        id="telefonoCheckout"
                                        type="text"
                                        placeholder="+569 12345678"
                                        value={
                                            telefono
                                        }
                                        onChange={(e) => {

                                            setTelefono(
                                                e.target.value
                                            );

                                            limpiarError(
                                                "telefono"
                                            );
                                        }}
                                        className={
                                            errores.telefono
                                                ? "campo-error"
                                                : ""
                                        }
                                    />


                                    {errores.telefono && (

                                        <small className="checkout-error">
                                            {
                                                errores.telefono
                                            }
                                        </small>

                                    )}

                                </div>


                                <div className="checkout-campo">

                                    <label htmlFor="correoCheckout">
                                        Correo electrónico *
                                    </label>


                                    <input
                                        id="correoCheckout"
                                        type="email"
                                        placeholder="ejemplo@gmail.com"
                                        value={
                                            correo
                                        }
                                        onChange={(e) => {

                                            setCorreo(
                                                e.target.value
                                            );

                                            limpiarError(
                                                "correo"
                                            );
                                        }}
                                        className={
                                            errores.correo
                                                ? "campo-error"
                                                : ""
                                        }
                                    />


                                    {errores.correo && (

                                        <small className="checkout-error">
                                            {
                                                errores.correo
                                            }
                                        </small>

                                    )}

                                </div>

                            </div>


                            <h2 className="checkout-subtitulo">
                                TIPO DE ENTREGA
                            </h2>


                            <div className="checkout-opciones">


                                <button
                                    type="button"
                                    className={
                                        tipoEntrega ===
                                            "Delivery"
                                            ? "checkout-opcion activa"
                                            : "checkout-opcion"
                                    }
                                    onClick={() => {

                                        setTipoEntrega(
                                            "Delivery"
                                        );

                                        setErrores({
                                            ...errores,
                                            direccion: "",
                                            comuna: ""
                                        });
                                    }}
                                >

                                    <span className="checkout-opcion-icono">
                                        🛵
                                    </span>

                                    <strong>
                                        Delivery
                                    </strong>

                                    <small>
                                        + $2.000
                                    </small>

                                </button>


                                <button
                                    type="button"
                                    className={
                                        tipoEntrega ===
                                            "Retiro en local"
                                            ? "checkout-opcion activa"
                                            : "checkout-opcion"
                                    }
                                    onClick={() => {

                                        setTipoEntrega(
                                            "Retiro en local"
                                        );

                                        setErrores({
                                            ...errores,
                                            direccion: "",
                                            comuna: ""
                                        });
                                    }}
                                >

                                    <span className="checkout-opcion-icono">
                                        🏪
                                    </span>

                                    <strong>
                                        Retiro en local
                                    </strong>

                                    <small>
                                        Gratis
                                    </small>

                                </button>

                            </div>


                            {tipoEntrega ===
                            "Delivery" && (

                                <>


                                    <div className="checkout-campo">

                                        <label htmlFor="direccionCheckout">
                                            Dirección *
                                        </label>


                                        <input
                                            id="direccionCheckout"
                                            type="text"
                                            placeholder="Ej: Av. Principal 1234"
                                            value={
                                                direccion
                                            }
                                            onChange={(e) => {

                                                setDireccion(
                                                    e.target.value
                                                );

                                                limpiarError(
                                                    "direccion"
                                                );
                                            }}
                                            className={
                                                errores.direccion
                                                    ? "campo-error"
                                                    : ""
                                            }
                                        />


                                        {errores.direccion && (

                                            <small className="checkout-error">
                                                {
                                                    errores.direccion
                                                }
                                            </small>

                                        )}

                                    </div>


                                    <div className="checkout-campo">

                                        <label htmlFor="comunaCheckout">
                                            Comuna *
                                        </label>


                                        <select
                                            id="comunaCheckout"
                                            value={
                                                comuna
                                            }
                                            onChange={(e) => {

                                                setComuna(
                                                    e.target.value
                                                );

                                                limpiarError(
                                                    "comuna"
                                                );
                                            }}
                                            className={
                                                errores.comuna
                                                    ? "campo-error"
                                                    : ""
                                            }
                                        >

                                            <option value="">
                                                Selecciona una comuna
                                            </option>

                                            <option value="Santiago">
                                                Santiago
                                            </option>

                                            <option value="Estación Central">
                                                Estación Central
                                            </option>

                                            <option value="Quinta Normal">
                                                Quinta Normal
                                            </option>

                                            <option value="Maipú">
                                                Maipú
                                            </option>

                                            <option value="Cerrillos">
                                                Cerrillos
                                            </option>

                                        </select>


                                        {errores.comuna && (

                                            <small className="checkout-error">
                                                {
                                                    errores.comuna
                                                }
                                            </small>

                                        )}

                                    </div>


                                    <div className="checkout-campo">

                                        <label htmlFor="referenciaCheckout">
                                            Referencia
                                        </label>


                                        <textarea
                                            id="referenciaCheckout"
                                            placeholder="Ej: Casa con portón negro..."
                                            value={
                                                referencia
                                            }
                                            onChange={(e) =>
                                                setReferencia(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </>

                            )}


                            <h2 className="checkout-subtitulo">
                                MÉTODO DE PAGO
                            </h2>


                            <div className="checkout-pagos">


                                <button
                                    type="button"
                                    className={
                                        medioPago ===
                                            "Tarjeta"
                                            ? "checkout-pago activa"
                                            : "checkout-pago"
                                    }
                                    onClick={() =>
                                        setMedioPago(
                                            "Tarjeta"
                                        )
                                    }
                                >

                                    <span className="radio-pago"></span>


                                    <div>

                                        <strong>
                                            Tarjeta de débito / crédito
                                        </strong>

                                        <small>
                                            Visa, Mastercard
                                        </small>

                                    </div>

                                </button>


                                <button
                                    type="button"
                                    className={
                                        medioPago ===
                                            "Efectivo"
                                            ? "checkout-pago activa"
                                            : "checkout-pago"
                                    }
                                    onClick={() =>
                                        setMedioPago(
                                            "Efectivo"
                                        )
                                    }
                                >

                                    <span className="radio-pago"></span>


                                    <div>

                                        <strong>
                                            Efectivo al recibir
                                        </strong>

                                        <small>
                                            Ten el monto exacto
                                        </small>

                                    </div>

                                </button>

                            </div>

                        </form>

                    </section>


                    <aside className="checkout-resumen">

                        <h2>
                            RESUMEN
                        </h2>


                        <div className="checkout-productos">

                            {carrito.map(
                                (item) => (

                                    <div
                                        key={
                                            item.codigo
                                        }
                                        className="checkout-producto"
                                    >

                                        <div>

                                            <strong>
                                                {
                                                    item.nombre
                                                }
                                            </strong>

                                            <span>
                                                x
                                                {
                                                    item.cantidad
                                                }
                                            </span>

                                        </div>


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

                                    </div>

                                )
                            )}

                        </div>


                        <div className="checkout-resumen-fila">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                $
                                {
                                    subtotal.toLocaleString(
                                        "es-CL"
                                    )
                                }
                            </strong>

                        </div>


                        {tipoEntrega ===
                        "Delivery" && (

                            <div className="checkout-resumen-fila">

                                <span>
                                    Delivery
                                </span>

                                <strong>
                                    $
                                    {
                                        costoDelivery.toLocaleString(
                                            "es-CL"
                                        )
                                    }
                                </strong>

                            </div>

                        )}


                        {tipoEntrega ===
                        "Retiro en local" && (

                            <div className="checkout-resumen-fila">

                                <span>
                                    Entrega
                                </span>

                                <strong>
                                    Retiro en local
                                </strong>

                            </div>

                        )}


                        <div className="checkout-resumen-fila">

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


                        <div className="checkout-resumen-fila">

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


                        <div className="checkout-total">

                            <span>
                                TOTAL
                            </span>

                            <strong>
                                $
                                {
                                    total.toLocaleString(
                                        "es-CL"
                                    )
                                }
                            </strong>

                        </div>


                        <button
                            type="submit"
                            form="formCheckout"
                            className="btn-confirmar-pedido"
                        >
                            CONFIRMAR PEDIDO →
                        </button>


                        <Link
                            to="/carrito"
                            className="checkout-volver"
                        >
                            ← Volver al carrito
                        </Link>

                    </aside>

                </div>

            </div>

        </main>
    );
}


export default Checkout;