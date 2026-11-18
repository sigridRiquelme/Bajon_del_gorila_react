import {
    useEffect,
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
    obtenerMiPerfilApi
} from "../../api/auth.js";

import {
    crearPedidoApi
} from "../../api/pedidos.js";

import "../../styles/checkout.css";


function Checkout() {

    const navigate =
        useNavigate();


    const token =
        localStorage.getItem(
            "token"
        );


    const rol =
        localStorage.getItem(
            "usuarioRol"
        );


    const usuarioActualId =
        localStorage.getItem(
            "usuarioActualId"
        );


    const esCliente =
        token &&
        rol ===
        "CLIENTE";


    const esAdministrador =
        rol ===
        "ADMINISTRADOR";


    const esVendedor =
        rol ===
        "VENDEDOR";


    const [
        carrito
    ] = useState(
        obtenerCarrito()
    );


    const [
        nombre,
        setNombre
    ] = useState(
        localStorage.getItem(
            "usuarioNombre"
        ) || ""
    );


    const [
        correo,
        setCorreo
    ] = useState(
        localStorage.getItem(
            "usuarioCorreo"
        ) || ""
    );


    const [
        telefono,
        setTelefono
    ] = useState("");


    const [
        tipoEntrega,
        setTipoEntrega
    ] = useState(
        "Delivery"
    );


    const [
        direccion,
        setDireccion
    ] = useState("");


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


    const [
        enviando,
        setEnviando
    ] = useState(false);


    // CARGO LOS DATOS DEL CLIENTE DESDE MYSQL

    useEffect(() => {

        const cargarPerfil = async () => {

            if (
                !esCliente
            ) {

                return;
            }


            try {

                const usuario =
                    await obtenerMiPerfilApi();


                setNombre(
                    usuario.nombre ||
                    ""
                );


                setCorreo(
                    usuario.correo ||
                    ""
                );


                setTelefono(
                    usuario.telefono ||
                    ""
                );


                setDireccion(
                    usuario.direccion ||
                    ""
                );

            } catch (
                error
            ) {

                console.error(
                    error
                );
            }
        };


        cargarPerfil();

    }, [
        esCliente
    ]);


    // ADMIN Y VENDEDOR NO PUEDEN COMPRAR

    if (
        esAdministrador ||
        esVendedor
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


    // ESTOS TOTALES SON SOLO PARA MOSTRAR
    // EL BACKEND LOS CALCULA NUEVAMENTE

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


    // VALIDO FORMULARIO

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
            ).length ===
            0
        );
    };


    // GUARDO ERROR Y VOY A PAGINA DE ERROR

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


    // CONFIRMO PEDIDO REAL EN BACKEND

    const confirmarPedido = async (
        e
    ) => {

        e.preventDefault();


        if (
            !validarFormulario()
        ) {

            return;
        }


        if (
            enviando
        ) {

            return;
        }


        setEnviando(
            true
        );


        try {

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


            const pedidoGuardado =
                await crearPedidoApi(
                    {

                        cliente:
                            nombre.trim(),

                        correo:
                            correo
                                .trim()
                                .toLowerCase(),

                        telefono:
                            telefono.trim(),

                        fecha:
                            fecha,

                        hora:
                            hora,

                        tipoEntrega:
                            tipoEntrega,

                        direccion:
                            direccion.trim(),

                        comuna:
                            comuna,

                        referencia:
                            referencia.trim(),

                        medioPago:
                            medioPago
                    },
                    carrito
                );


            // ADAPTO RESPUESTA PARA COMPRA EXITOSA

            const compraConfirmada = {

                codigo:
                    pedidoGuardado.idPedido,

                usuarioId:
                    pedidoGuardado.usuario
                        ?.idUsuario ??
                    (
                        usuarioActualId
                            ? Number(
                                usuarioActualId
                            )
                            : null
                    ),

                cliente:
                    pedidoGuardado.cliente,

                correo:
                    pedidoGuardado.correo,

                telefono:
                    pedidoGuardado.telefono,

                fecha:
                    pedidoGuardado.fecha,

                hora:
                    pedidoGuardado.hora,

                tipoEntrega:
                    pedidoGuardado.tipoEntrega ===
                    "DELIVERY"
                        ? "Delivery"
                        : "Retiro en local",

                direccion:
                    pedidoGuardado.direccion,

                comuna:
                    pedidoGuardado.comuna,

                referencia:
                    pedidoGuardado.referencia,

                medioPago:
                    pedidoGuardado.medioPago,

                subtotal:
                    pedidoGuardado.subtotal,

                costoDelivery:
                    pedidoGuardado.costoDelivery,

                neto:
                    pedidoGuardado.neto,

                iva:
                    pedidoGuardado.iva,

                total:
                    pedidoGuardado.total,

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
            };


            sessionStorage.setItem(
                "ultimaCompra",
                JSON.stringify(
                    compraConfirmada
                )
            );


            sessionStorage.setItem(
                "compraFueInvitado",
                esCliente
                    ? "false"
                    : "true"
            );


            sessionStorage.removeItem(
                "compraError"
            );


            // EL BACKEND YA DESCONTO EL STOCK

            vaciarCarrito();


            navigate(
                "/compra-exitosa"
            );

        } catch (
            error
        ) {

            console.error(
                error
            );


            const mensajeBackend =
                error.response
                    ?.data
                    ?.mensaje;


            irAError(
                mensajeBackend ||
                "Ocurrió un problema al registrar tu pedido. Tu carrito sigue guardado."
            );

        } finally {

            setEnviando(
                false
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


                        {!esCliente && (

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
                            disabled={
                                enviando
                            }
                        >

                            {
                                enviando
                                    ? "REGISTRANDO PEDIDO..."
                                    : "CONFIRMAR PEDIDO →"
                            }

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