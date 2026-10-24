import {
    useState
} from "react";

import {
    Navigate,
    useNavigate
} from "react-router-dom";

import {
    obtenerUsuarioPorId,
    actualizarUsuario
} from "../data/usuarios.js";

import {
    obtenerPedidos
} from "../data/pedidos.js";

import "../styles/perfilCliente.css";


function PerfilCliente() {

    const navigate =
        useNavigate();


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


    const [
        usuario,
        setUsuario
    ] = useState(
        usuarioActual
    );


    const [
        editando,
        setEditando
    ] = useState(false);


    const [
        nombre,
        setNombre
    ] = useState(
        usuarioActual?.nombre || ""
    );


    const [
        correo,
        setCorreo
    ] = useState(
        usuarioActual?.correo || ""
    );


    const [
        telefono,
        setTelefono
    ] = useState(
        usuarioActual?.telefono || ""
    );


    const [
        direccion,
        setDireccion
    ] = useState(
        usuarioActual?.direccion || ""
    );


    const [
        errores,
        setErrores
    ] = useState({});


    const [
        mensaje,
        setMensaje
    ] = useState("");


    const [
        pedidoAbierto,
        setPedidoAbierto
    ] = useState(null);


    // SI NO HAY SESION VUELVO AL LOGIN

    if (
        !usuarioActual
    ) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // EL ADMIN TIENE SU PROPIO PERFIL

    if (
        usuarioActual.rol ===
        "Administrador"
    ) {

        return (
            <Navigate
                to="/admin/perfil"
                replace
            />
        );
    }


    // MUESTRO SOLO LOS PEDIDOS DEL CLIENTE

    const pedidosUsuario =
        obtenerPedidos()
            .filter(
                (pedido) =>
                    pedido.usuarioId ===
                    usuario.id
            )
            .sort(
                (a, b) =>
                    b.codigo -
                    a.codigo
            );


    // VALIDO LOS DATOS DEL PERFIL

    const validarDatos = () => {

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
            direccion.trim() !== "" &&
            direccion.trim().length <
            10
        ) {

            nuevosErrores.direccion =
                "La dirección debe tener al menos 10 caracteres.";
        }


        if (
            direccion.trim().length >
            100
        ) {

            nuevosErrores.direccion =
                "La dirección no puede superar los 100 caracteres.";
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


    // GUARDO LOS CAMBIOS DEL PERFIL

    const guardarCambios = () => {

        setMensaje("");


        if (
            !validarDatos()
        ) {

            return;
        }


        actualizarUsuario(
            usuario.id,
            {
                nombre:
                    nombre.trim(),

                correo:
                    correo.trim(),

                telefono:
                    telefono.trim(),

                direccion:
                    direccion.trim()
            }
        );


        const usuarioActualizado =
            obtenerUsuarioPorId(
                usuario.id
            );


        setUsuario(
            usuarioActualizado
        );


        setEditando(false);
        setErrores({});


        setMensaje(
            "Datos actualizados correctamente."
        );
    };


    // CANCELO LA EDICION

    const cancelarEdicion = () => {

        setNombre(
            usuario.nombre || ""
        );

        setCorreo(
            usuario.correo || ""
        );

        setTelefono(
            usuario.telefono || ""
        );

        setDireccion(
            usuario.direccion || ""
        );

        setErrores({});
        setMensaje("");
        setEditando(false);
    };


    // CIERRO LA SESION

    const cerrarSesion = () => {

        localStorage.removeItem(
            "usuarioActualId"
        );


        navigate(
            "/login"
        );
    };


    // ABRO O CIERRO EL DETALLE DE LA BOLETA

    const mostrarPedido = (
        codigo
    ) => {

        if (
            pedidoAbierto ===
            codigo
        ) {

            setPedidoAbierto(
                null
            );

        } else {

            setPedidoAbierto(
                codigo
            );
        }
    };


    return (

        <main className="pagina-perfil-cliente">

            <div className="perfil-cliente-contenedor">


                <section className="perfil-cliente-encabezado">

                    <div>

                        <p className="perfil-antetitulo">
                            MI CUENTA
                        </p>

                        <h1>
                            MI PERFIL
                        </h1>

                        <p>
                            Revisa tus datos y tus pedidos realizados.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="btn-cerrar-sesion-cliente"
                        onClick={
                            cerrarSesion
                        }
                    >
                        CERRAR SESIÓN
                    </button>

                </section>


                {mensaje && (

                    <div className="perfil-mensaje-exito">
                        {
                            mensaje
                        }
                    </div>

                )}


                <div className="perfil-cliente-grid">


                    <section className="perfil-datos">

                        <div className="perfil-seccion-titulo">

                            <div>

                                <p>
                                    DATOS PERSONALES
                                </p>

                                <h2>
                                    {
                                        usuario.nombre
                                    }
                                </h2>

                            </div>


                            {!editando && (

                                <button
                                    type="button"
                                    className="btn-editar-perfil"
                                    onClick={() => {

                                        setEditando(
                                            true
                                        );

                                        setMensaje(
                                            ""
                                        );
                                    }}
                                >
                                    EDITAR
                                </button>

                            )}

                        </div>


                        {!editando ? (

                            <div className="perfil-datos-lista">


                                <div className="perfil-dato">

                                    <span>
                                        Nombre
                                    </span>

                                    <strong>
                                        {
                                            usuario.nombre
                                        }
                                    </strong>

                                </div>


                                <div className="perfil-dato">

                                    <span>
                                        Correo
                                    </span>

                                    <strong>
                                        {
                                            usuario.correo
                                        }
                                    </strong>

                                </div>


                                <div className="perfil-dato">

                                    <span>
                                        Teléfono
                                    </span>

                                    <strong>
                                        {
                                            usuario.telefono
                                        }
                                    </strong>

                                </div>


                                <div className="perfil-dato">

                                    <span>
                                        Dirección
                                    </span>

                                    <strong>
                                        {
                                            usuario.direccion ||
                                            "Sin dirección registrada"
                                        }
                                    </strong>

                                </div>


                                <div className="perfil-dato">

                                    <span>
                                        Tipo de cuenta
                                    </span>

                                    <strong>
                                        {
                                            usuario.rol
                                        }
                                    </strong>

                                </div>

                            </div>

                        ) : (

                            <div className="perfil-formulario">


                                <div className="perfil-campo">

                                    <label htmlFor="nombre">
                                        Nombre
                                    </label>


                                    <input
                                        id="nombre"
                                        type="text"
                                        value={
                                            nombre
                                        }
                                        onChange={(e) => {

                                            setNombre(
                                                e.target.value
                                            );

                                            setErrores({
                                                ...errores,
                                                nombre: ""
                                            });
                                        }}
                                    />


                                    {errores.nombre && (

                                        <small className="perfil-error">
                                            {
                                                errores.nombre
                                            }
                                        </small>

                                    )}

                                </div>


                                <div className="perfil-campo">

                                    <label htmlFor="correo">
                                        Correo
                                    </label>


                                    <input
                                        id="correo"
                                        type="email"
                                        value={
                                            correo
                                        }
                                        onChange={(e) => {

                                            setCorreo(
                                                e.target.value
                                            );

                                            setErrores({
                                                ...errores,
                                                correo: ""
                                            });
                                        }}
                                    />


                                    {errores.correo && (

                                        <small className="perfil-error">
                                            {
                                                errores.correo
                                            }
                                        </small>

                                    )}

                                </div>


                                <div className="perfil-campo">

                                    <label htmlFor="telefono">
                                        Teléfono
                                    </label>


                                    <input
                                        id="telefono"
                                        type="text"
                                        value={
                                            telefono
                                        }
                                        onChange={(e) => {

                                            setTelefono(
                                                e.target.value
                                            );

                                            setErrores({
                                                ...errores,
                                                telefono: ""
                                            });
                                        }}
                                    />


                                    {errores.telefono && (

                                        <small className="perfil-error">
                                            {
                                                errores.telefono
                                            }
                                        </small>

                                    )}

                                </div>


                                <div className="perfil-campo">

                                    <label htmlFor="direccion">
                                        Dirección
                                    </label>


                                    <input
                                        id="direccion"
                                        type="text"
                                        value={
                                            direccion
                                        }
                                        onChange={(e) => {

                                            setDireccion(
                                                e.target.value
                                            );

                                            setErrores({
                                                ...errores,
                                                direccion: ""
                                            });
                                        }}
                                    />


                                    {errores.direccion && (

                                        <small className="perfil-error">
                                            {
                                                errores.direccion
                                            }
                                        </small>

                                    )}

                                </div>


                                <div className="perfil-botones-edicion">

                                    <button
                                        type="button"
                                        className="btn-guardar-perfil"
                                        onClick={
                                            guardarCambios
                                        }
                                    >
                                        GUARDAR CAMBIOS
                                    </button>


                                    <button
                                        type="button"
                                        className="btn-cancelar-perfil"
                                        onClick={
                                            cancelarEdicion
                                        }
                                    >
                                        CANCELAR
                                    </button>

                                </div>

                            </div>

                        )}

                    </section>


                    <section className="perfil-pedidos">

                        <div className="perfil-seccion-titulo">

                            <div>

                                <p>
                                    HISTORIAL
                                </p>

                                <h2>
                                    MIS BOLETAS
                                </h2>

                            </div>

                        </div>


                        {pedidosUsuario.length ===
                        0 ? (

                            <div className="perfil-sin-pedidos">

                                <p>
                                    Todavía no tienes pedidos realizados.
                                </p>

                            </div>

                        ) : (

                            <div className="perfil-lista-pedidos">


                                {pedidosUsuario.map(
                                    (pedido) => {


                                        // CALCULO NETO E IVA SI ES UN PEDIDO ANTIGUO

                                        const netoPedido =
                                            pedido.neto ??
                                            Math.round(
                                                pedido.total /
                                                1.19
                                            );


                                        const ivaPedido =
                                            pedido.iva ??
                                            (
                                                pedido.total -
                                                netoPedido
                                            );


                                        const subtotalPedido =
                                            pedido.subtotal ??
                                            (
                                                pedido.total -
                                                (
                                                    pedido.costoDelivery ||
                                                    0
                                                )
                                            );


                                        return (

                                            <article
                                                key={
                                                    pedido.codigo
                                                }
                                                className="perfil-pedido"
                                            >


                                                <div className="perfil-pedido-resumen">


                                                    <div>

                                                        <span>
                                                            BOLETA
                                                        </span>

                                                        <strong>
                                                            #
                                                            {
                                                                pedido.codigo
                                                            }
                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            FECHA
                                                        </span>

                                                        <strong>
                                                            {
                                                                pedido.fecha
                                                            }
                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            TOTAL
                                                        </span>

                                                        <strong>

                                                            $
                                                            {
                                                                pedido.total.toLocaleString(
                                                                    "es-CL"
                                                                )
                                                            }

                                                        </strong>

                                                    </div>


                                                    <button
                                                        type="button"
                                                        className="btn-ver-boleta"
                                                        onClick={() =>
                                                            mostrarPedido(
                                                                pedido.codigo
                                                            )
                                                        }
                                                    >

                                                        {
                                                            pedidoAbierto ===
                                                            pedido.codigo
                                                                ? "OCULTAR"
                                                                : "VER DETALLE"
                                                        }

                                                    </button>

                                                </div>


                                                {pedidoAbierto ===
                                                pedido.codigo && (

                                                    <div className="perfil-pedido-detalle">


                                                        <div className="perfil-boleta-datos">


                                                            <div>

                                                                <span>
                                                                    Fecha
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        pedido.fecha
                                                                    }
                                                                </strong>

                                                            </div>


                                                            <div>

                                                                <span>
                                                                    Hora
                                                                </span>

                                                                <strong>

                                                                    {
                                                                        pedido.hora ||
                                                                        "No registrada"
                                                                    }

                                                                </strong>

                                                            </div>


                                                            <div>

                                                                <span>
                                                                    Medio de pago
                                                                </span>

                                                                <strong>

                                                                    {
                                                                        pedido.medioPago ||
                                                                        "No registrado"
                                                                    }

                                                                </strong>

                                                            </div>

                                                        </div>


                                                        <div className="perfil-boleta-productos">

                                                            {pedido.productos.map(
                                                                (
                                                                    producto,
                                                                    index
                                                                ) => (

                                                                    <div
                                                                        key={
                                                                            `${pedido.codigo}-${index}`
                                                                        }
                                                                        className="perfil-producto-pedido"
                                                                    >

                                                                        <span>
                                                                            {
                                                                                producto.nombre
                                                                            }
                                                                        </span>


                                                                        <span>

                                                                            $
                                                                            {
                                                                                producto.precio.toLocaleString(
                                                                                    "es-CL"
                                                                                )
                                                                            }

                                                                            {" "}
                                                                            ×
                                                                            {" "}

                                                                            {
                                                                                producto.cantidad
                                                                            }

                                                                        </span>


                                                                        <strong>

                                                                            $
                                                                            {
                                                                                (
                                                                                    producto.precio *
                                                                                    producto.cantidad
                                                                                ).toLocaleString(
                                                                                    "es-CL"
                                                                                )
                                                                            }

                                                                        </strong>

                                                                    </div>

                                                                )
                                                            )}

                                                        </div>


                                                        <div className="perfil-boleta-totales">


                                                            <div>

                                                                <span>
                                                                    Subtotal
                                                                </span>

                                                                <strong>

                                                                    $
                                                                    {
                                                                        subtotalPedido.toLocaleString(
                                                                            "es-CL"
                                                                        )
                                                                    }

                                                                </strong>

                                                            </div>


                                                            {/* SI ES DELIVERY MUESTRO EL COSTO */}

                                                            {pedido.tipoEntrega ===
                                                            "Delivery" && (

                                                                <div>

                                                                    <span>
                                                                        Delivery
                                                                    </span>

                                                                    <strong>

                                                                        $
                                                                        {
                                                                            (
                                                                                pedido.costoDelivery ||
                                                                                0
                                                                            ).toLocaleString(
                                                                                "es-CL"
                                                                            )
                                                                        }

                                                                    </strong>

                                                                </div>

                                                            )}


                                                            {/* SI ES RETIRO LO INDICO EN LA BOLETA */}

                                                            {pedido.tipoEntrega ===
                                                            "Retiro en local" && (

                                                                <div>

                                                                    <span>
                                                                        Tipo de entrega
                                                                    </span>

                                                                    <strong>
                                                                        Retiro en local
                                                                    </strong>

                                                                </div>

                                                            )}


                                                            <div>

                                                                <span>
                                                                    Neto
                                                                </span>

                                                                <strong>

                                                                    $
                                                                    {
                                                                        netoPedido.toLocaleString(
                                                                            "es-CL"
                                                                        )
                                                                    }

                                                                </strong>

                                                            </div>


                                                            <div>

                                                                <span>
                                                                    IVA 19%
                                                                </span>

                                                                <strong>

                                                                    $
                                                                    {
                                                                        ivaPedido.toLocaleString(
                                                                            "es-CL"
                                                                        )
                                                                    }

                                                                </strong>

                                                            </div>


                                                            <div className="perfil-pedido-total">

                                                                <span>
                                                                    TOTAL
                                                                </span>

                                                                <strong>

                                                                    $
                                                                    {
                                                                        pedido.total.toLocaleString(
                                                                            "es-CL"
                                                                        )
                                                                    }

                                                                </strong>

                                                            </div>

                                                        </div>

                                                    </div>

                                                )}

                                            </article>

                                        );
                                    }
                                )}

                            </div>

                        )}

                    </section>

                </div>

            </div>

        </main>
    );
}


export default PerfilCliente;