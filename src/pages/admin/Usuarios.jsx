import {
    useState
} from "react";

import "../../styles/usuarios.css";

import UsuarioFila from "../../components/admin/UsuarioFila.jsx";

import {
    obtenerUsuarios,
    actualizarUsuario,
    eliminarUsuario as eliminarUsuarioData
} from "../../data/usuarios.js";

import {
    obtenerPedidos
} from "../../data/pedidos.js";


function Usuarios() {

    const [
        listaUsuarios,
        setListaUsuarios
    ] = useState(
        obtenerUsuarios()
    );


    const [
        busqueda,
        setBusqueda
    ] = useState("");


    const [
        usuarioSeleccionado,
        setUsuarioSeleccionado
    ] = useState(null);


    const [
        usuarioEditando,
        setUsuarioEditando
    ] = useState(null);


    const [
        usuarioAEliminar,
        setUsuarioAEliminar
    ] = useState(null);


    const [
        mostrarDetalle,
        setMostrarDetalle
    ] = useState(false);


    const [
        mostrarFormulario,
        setMostrarFormulario
    ] = useState(false);


    const [
        errores,
        setErrores
    ] = useState({});


    const [
        datosFormulario,
        setDatosFormulario
    ] = useState({

        nombre: "",
        correo: "",
        telefono: "",
        direccion: "",
        rol: "Cliente"
    });


    // FILTRO LOS USUARIOS

    const usuariosFiltrados =
        listaUsuarios.filter(
            (usuario) => {

                const texto =
                    busqueda
                        .toLowerCase()
                        .trim();


                return (
                    usuario.nombre
                        .toLowerCase()
                        .includes(
                            texto
                        ) ||

                    usuario.correo
                        .toLowerCase()
                        .includes(
                            texto
                        ) ||

                    (
                        usuario.direccion ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            texto
                        )
                );
            }
        );


    // OBTENGO LAS COMPRAS DEL USUARIO

    const obtenerHistorialUsuario = (
        usuario
    ) => {

        if (
            !usuario
        ) {

            return [];
        }


        const pedidos =
            obtenerPedidos();


        return pedidos.filter(
            (pedido) =>
                pedido.usuarioId ===
                usuario.id
        );
    };


    // MUESTRO EL DETALLE DEL USUARIO

    const verUsuario = (
        id
    ) => {

        const usuario =
            listaUsuarios.find(
                (usuario) =>
                    usuario.id ===
                    id
            );


        if (
            !usuario
        ) {

            return;
        }


        setUsuarioSeleccionado(
            usuario
        );


        setMostrarDetalle(
            true
        );
    };


    // CARGO LOS DATOS PARA EDITAR

    const editarUsuario = (
        id
    ) => {

        const usuario =
            listaUsuarios.find(
                (usuario) =>
                    usuario.id ===
                    id
            );


        if (
            !usuario
        ) {

            return;
        }


        setUsuarioEditando(
            usuario
        );


        setDatosFormulario({

            nombre:
                usuario.nombre,

            correo:
                usuario.correo,

            telefono:
                usuario.telefono,

            direccion:
                usuario.direccion ||
                "",

            rol:
                usuario.rol
        });


        setErrores({});


        setMostrarDetalle(
            false
        );


        setMostrarFormulario(
            true
        );
    };


    // ACTUALIZO LOS CAMPOS

    const handleChange = (
        e
    ) => {

        const {
            name,
            value
        } = e.target;


        setDatosFormulario({
            ...datosFormulario,
            [name]:
                value
        });


        setErrores({
            ...errores,
            [name]:
                ""
        });
    };


    // VALIDO EL FORMULARIO

    const validarFormulario = () => {

        const nuevosErrores = {};


        const nombre =
            datosFormulario.nombre.trim();


        const correo =
            datosFormulario.correo
                .trim()
                .toLowerCase();


        const telefono =
            datosFormulario.telefono.trim();


        const direccion =
            datosFormulario.direccion.trim();


        // NOMBRE

        if (
            nombre ===
            ""
        ) {

            nuevosErrores.nombre =
                "El nombre es obligatorio";

        } else if (
            nombre.length <
            3
        ) {

            nuevosErrores.nombre =
                "El nombre debe tener al menos 3 caracteres";

        } else if (
            nombre.length >
            50
        ) {

            nuevosErrores.nombre =
                "El nombre no puede superar los 50 caracteres";
        }


        // CORREO

        const correoValido =
            /^[^\s@]+@(gmail\.com|duoc\.cl|duocuc\.cl)$/i;


        if (
            correo ===
            ""
        ) {

            nuevosErrores.correo =
                "El correo es obligatorio";

        } else if (
            !correoValido.test(
                correo
            )
        ) {

            nuevosErrores.correo =
                "El correo debe ser Gmail, Duoc o Duoc UC";

        } else {

            const correoRepetido =
                listaUsuarios.some(
                    (usuario) =>
                        usuario.id !==
                            usuarioEditando.id &&
                        usuario.correo
                            .toLowerCase()
                            .trim() ===
                            correo
                );


            if (
                correoRepetido
            ) {

                nuevosErrores.correo =
                    "Este correo ya está registrado";
            }
        }


        // TELEFONO

        if (
            telefono ===
            ""
        ) {

            nuevosErrores.telefono =
                "El teléfono es obligatorio";

        } else if (
            !/^\+569 \d{8}$/.test(
                telefono
            )
        ) {

            nuevosErrores.telefono =
                "El teléfono debe tener formato +569 12345678";
        }


        // DIRECCION

        if (
            direccion ===
            ""
        ) {

            nuevosErrores.direccion =
                "La dirección es obligatoria";

        } else if (
            direccion.length <
            10
        ) {

            nuevosErrores.direccion =
                "La dirección debe tener al menos 10 caracteres";

        } else if (
            direccion.length >
            100
        ) {

            nuevosErrores.direccion =
                "La dirección no puede superar los 100 caracteres";
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


    // GUARDO LOS CAMBIOS

    const guardarUsuario = (
        e
    ) => {

        e.preventDefault();


        if (
            !validarFormulario()
        ) {

            return;
        }


        const datosActualizados = {

            nombre:
                datosFormulario.nombre.trim(),

            correo:
                datosFormulario.correo
                    .trim()
                    .toLowerCase(),

            telefono:
                datosFormulario.telefono.trim(),

            direccion:
                datosFormulario.direccion.trim(),

            rol:
                usuarioEditando.id ===
                    0
                    ? "Administrador"
                    : datosFormulario.rol
        };


        actualizarUsuario(
            usuarioEditando.id,
            datosActualizados
        );


        setListaUsuarios(
            obtenerUsuarios()
        );


        setMostrarFormulario(
            false
        );


        setUsuarioEditando(
            null
        );


        setErrores({});
    };


    // PREPARO LA ELIMINACION

    const eliminarUsuario = (
        id
    ) => {

        const usuario =
            listaUsuarios.find(
                (usuario) =>
                    usuario.id ===
                    id
            );


        if (
            !usuario
        ) {

            return;
        }


        // EL ADMIN NO SE PUEDE ELIMINAR

        if (
            usuario.rol ===
            "Administrador"
        ) {

            return;
        }


        setUsuarioAEliminar(
            usuario
        );
    };


    // CONFIRMO LA ELIMINACION

    const confirmarEliminarUsuario = () => {

        if (
            !usuarioAEliminar
        ) {

            return;
        }


        eliminarUsuarioData(
            usuarioAEliminar.id
        );


        setListaUsuarios(
            obtenerUsuarios()
        );


        setUsuarioAEliminar(
            null
        );


        setMostrarDetalle(
            false
        );
    };


    const historialUsuario =
        obtenerHistorialUsuario(
            usuarioSeleccionado
        );


    return (

        <main className="usuarios-admin">


            <header className="encabezado-usuarios">

                <div>

                    <h1>
                        USUARIOS
                    </h1>


                    <p>

                        {
                            listaUsuarios.length
                        }

                        {" "}

                        {
                            listaUsuarios.length ===
                            1
                                ? "usuario registrado"
                                : "usuarios registrados"
                        }

                    </p>

                </div>

            </header>


            <section className="filtros-usuarios">

                <input
                    type="text"
                    placeholder="Buscar por nombre, correo o dirección..."
                    value={
                        busqueda
                    }
                    onChange={(e) =>
                        setBusqueda(
                            e.target.value
                        )
                    }
                />

            </section>


            <section className="tabla-usuarios">

                <table>

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                NOMBRE
                            </th>

                            <th>
                                CORREO
                            </th>

                            <th>
                                TELÉFONO
                            </th>

                            <th>
                                DIRECCIÓN
                            </th>

                            <th>
                                ROL
                            </th>

                            <th>
                                ACCIONES
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {usuariosFiltrados.length >
                        0 ? (

                            usuariosFiltrados.map(
                                (usuario) => (

                                    <UsuarioFila
                                        key={
                                            usuario.id
                                        }
                                        id={
                                            usuario.id
                                        }
                                        nombre={
                                            usuario.nombre
                                        }
                                        correo={
                                            usuario.correo
                                        }
                                        telefono={
                                            usuario.telefono
                                        }
                                        direccion={
                                            usuario.direccion
                                        }
                                        rol={
                                            usuario.rol
                                        }
                                        onVer={
                                            verUsuario
                                        }
                                        onEditar={
                                            editarUsuario
                                        }
                                        onEliminar={
                                            eliminarUsuario
                                        }
                                    />

                                )
                            )

                        ) : (

                            <tr>

                                <td colSpan="7">
                                    No se encontraron usuarios.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </section>


            {mostrarDetalle &&
            usuarioSeleccionado && (

                <div className="modal-usuario-fondo">

                    <div className="modal-usuario modal-detalle-usuario">


                        <div className="encabezado-detalle-usuario">

                            <div>

                                <span className="etiqueta-usuario">
                                    USUARIO
                                </span>


                                <h2>
                                    {
                                        usuarioSeleccionado.nombre
                                    }
                                </h2>

                            </div>

                        </div>


                        <section className="datos-usuario">


                            <div>

                                <span>
                                    Correo
                                </span>

                                <strong>
                                    {
                                        usuarioSeleccionado.correo
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Teléfono
                                </span>

                                <strong>
                                    {
                                        usuarioSeleccionado.telefono
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Dirección
                                </span>

                                <strong>
                                    {
                                        usuarioSeleccionado.direccion ||
                                        "Sin dirección registrada"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Rol
                                </span>

                                <strong>
                                    {
                                        usuarioSeleccionado.rol
                                    }
                                </strong>

                            </div>

                        </section>


                        <section className="historial-compras">

                            <div className="titulo-historial">

                                <h3>
                                    Historial de compras
                                </h3>


                                <span>

                                    {
                                        historialUsuario.length
                                    }

                                    {" "}

                                    {
                                        historialUsuario.length ===
                                        1
                                            ? "compra"
                                            : "compras"
                                    }

                                </span>

                            </div>


                            {historialUsuario.length >
                            0 ? (

                                <div className="lista-historial">

                                    {historialUsuario.map(
                                        (pedido) => (

                                            <div
                                                className="compra-historial"
                                                key={
                                                    pedido.codigo
                                                }
                                            >

                                                <div>

                                                    <strong>
                                                        Pedido #
                                                        {
                                                            pedido.codigo
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            pedido.fecha
                                                        }
                                                    </span>

                                                </div>


                                                <strong className="total-historial">

                                                    $
                                                    {
                                                        pedido.total.toLocaleString(
                                                            "es-CL"
                                                        )
                                                    }

                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="sin-compras">
                                    Este usuario no registra compras.
                                </p>

                            )}

                        </section>


                        <div className="acciones-detalle-usuario">

                            <button
                                type="button"
                                className="btn-editar-detalle"
                                onClick={() =>
                                    editarUsuario(
                                        usuarioSeleccionado.id
                                    )
                                }
                            >
                                Editar usuario
                            </button>


                            <button
                                type="button"
                                className="btn-cerrar-usuario"
                                onClick={() =>
                                    setMostrarDetalle(
                                        false
                                    )
                                }
                            >
                                Cerrar
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {mostrarFormulario &&
            usuarioEditando && (

                <div className="modal-usuario-fondo">

                    <div className="modal-usuario">

                        <h2>
                            Editar usuario
                        </h2>


                        <form
                            onSubmit={
                                guardarUsuario
                            }
                        >


                            <div className="campo-usuario">

                                <label htmlFor="nombre">
                                    Nombre
                                </label>


                                <input
                                    id="nombre"
                                    type="text"
                                    name="nombre"
                                    maxLength="50"
                                    value={
                                        datosFormulario.nombre
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className={
                                        errores.nombre
                                            ? "campo-error"
                                            : ""
                                    }
                                />


                                {errores.nombre && (

                                    <span className="mensaje-error">
                                        {
                                            errores.nombre
                                        }
                                    </span>

                                )}

                            </div>


                            <div className="campo-usuario">

                                <label htmlFor="correo">
                                    Correo
                                </label>


                                <input
                                    id="correo"
                                    type="email"
                                    name="correo"
                                    value={
                                        datosFormulario.correo
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className={
                                        errores.correo
                                            ? "campo-error"
                                            : ""
                                    }
                                />


                                {errores.correo && (

                                    <span className="mensaje-error">
                                        {
                                            errores.correo
                                        }
                                    </span>

                                )}

                            </div>


                            <div className="campo-usuario">

                                <label htmlFor="telefono">
                                    Teléfono
                                </label>


                                <div className="telefono-input">

                                    <span className="prefijo-telefono">
                                        +569
                                    </span>


                                    <input
                                        id="telefono"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="8"
                                        placeholder="12345678"
                                        value={
                                            datosFormulario.telefono
                                                .replace(
                                                    "+569 ",
                                                    ""
                                                )
                                        }
                                        onChange={(e) => {

                                            const soloNumeros =
                                                e.target.value
                                                    .replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                    .slice(
                                                        0,
                                                        8
                                                    );


                                            setDatosFormulario({
                                                ...datosFormulario,

                                                telefono:
                                                    soloNumeros.length >
                                                    0
                                                        ? `+569 ${soloNumeros}`
                                                        : ""
                                            });


                                            setErrores({
                                                ...errores,
                                                telefono: ""
                                            });
                                        }}
                                        className={
                                            errores.telefono
                                                ? "campo-error"
                                                : ""
                                        }
                                    />

                                </div>


                                {errores.telefono && (

                                    <span className="mensaje-error">
                                        {
                                            errores.telefono
                                        }
                                    </span>

                                )}

                            </div>


                            <div className="campo-usuario">

                                <label htmlFor="direccion">
                                    Dirección
                                </label>


                                <input
                                    id="direccion"
                                    type="text"
                                    name="direccion"
                                    maxLength="100"
                                    placeholder="Ej: Av. Principal 1234, Santiago"
                                    value={
                                        datosFormulario.direccion
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className={
                                        errores.direccion
                                            ? "campo-error"
                                            : ""
                                    }
                                />


                                {errores.direccion && (

                                    <span className="mensaje-error">
                                        {
                                            errores.direccion
                                        }
                                    </span>

                                )}

                            </div>


                            <div className="campo-usuario">

                                <label htmlFor="rol">
                                    Rol
                                </label>


                                {usuarioEditando.id ===
                                0 ? (

                                    <input
                                        id="rol"
                                        type="text"
                                        value="Administrador"
                                        disabled
                                    />

                                ) : (

                                    <select
                                        id="rol"
                                        name="rol"
                                        value={
                                            datosFormulario.rol
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="Cliente">
                                            Cliente
                                        </option>

                                        <option value="Administrador">
                                            Administrador
                                        </option>

                                    </select>

                                )}

                            </div>


                            <div className="acciones-modal-usuario">

                                <button
                                    type="button"
                                    className="btn-cancelar-usuario"
                                    onClick={() => {

                                        setMostrarFormulario(
                                            false
                                        );

                                        setUsuarioEditando(
                                            null
                                        );

                                        setErrores({});
                                    }}
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="submit"
                                    className="btn-guardar-usuario"
                                >
                                    Guardar cambios
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {usuarioAEliminar && (

                <div className="modal-usuario-fondo">

                    <div className="modal-confirmar-eliminar">

                        <h2>
                            Eliminar usuario
                        </h2>


                        <p>

                            ¿Seguro que deseas eliminar a{" "}

                            <strong>
                                {
                                    usuarioAEliminar.nombre
                                }
                            </strong>

                            ?

                        </p>


                        <p className="texto-advertencia">
                            Esta acción eliminará el usuario del sistema.
                        </p>


                        <div className="acciones-confirmar-eliminar">

                            <button
                                type="button"
                                className="btn-cancelar-eliminar"
                                onClick={() =>
                                    setUsuarioAEliminar(
                                        null
                                    )
                                }
                            >
                                Cancelar
                            </button>


                            <button
                                type="button"
                                className="btn-confirmar-eliminar"
                                onClick={
                                    confirmarEliminarUsuario
                                }
                            >
                                Eliminar
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </main>
    );
}


export default Usuarios;