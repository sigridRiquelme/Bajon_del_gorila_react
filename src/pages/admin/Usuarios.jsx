import {
    useEffect,
    useState
} from "react";

import "../../styles/usuarios.css";

import UsuarioFila
    from "../../components/admin/UsuarioFila.jsx";

import {
    cambiarRolUsuarioApi,
    crearUsuarioAdministrativoApi,
    eliminarUsuarioApi,
    obtenerUsuariosApi
} from "../../api/usuarios.js";

import {
    obtenerPedidosConDetallesApi
} from "../../api/pedidos.js";


const usuarioNuevoVacio = {

    nombre: "",
    correo: "",
    password: "",
    telefono: "",
    direccion: "",
    rol: "Vendedor"
};


function Usuarios() {

    const [
        listaUsuarios,
        setListaUsuarios
    ] = useState([]);


    const [
        pedidos,
        setPedidos
    ] = useState([]);


    const [
        cargando,
        setCargando
    ] = useState(true);


    const [
        busqueda,
        setBusqueda
    ] = useState("");


    const [
        usuarioSeleccionado,
        setUsuarioSeleccionado
    ] = useState(null);


    const [
        usuarioEditandoRol,
        setUsuarioEditandoRol
    ] = useState(null);


    const [
        nuevoRol,
        setNuevoRol
    ] = useState("Cliente");


    const [
        usuarioAEliminar,
        setUsuarioAEliminar
    ] = useState(null);


    const [
        mostrarFormulario,
        setMostrarFormulario
    ] = useState(false);


    const [
        datosNuevoUsuario,
        setDatosNuevoUsuario
    ] = useState({
        ...usuarioNuevoVacio
    });


    const [
        errores,
        setErrores
    ] = useState({});


    const [
        mensaje,
        setMensaje
    ] = useState("");


    const [
        hayError,
        setHayError
    ] = useState(false);


    const usuarioActualId =
        Number(
            localStorage.getItem(
                "usuarioActualId"
            )
        );


    const cargarDatos = async () => {

        try {

            const [
                usuariosApi,
                pedidosApi
            ] =
                await Promise.all([

                    obtenerUsuariosApi(),
                    obtenerPedidosConDetallesApi()
                ]);


            setListaUsuarios(
                usuariosApi.sort(
                    (
                        a,
                        b
                    ) => {

                        if (
                            a.administradorPrincipal
                        ) {

                            return -1;
                        }


                        if (
                            b.administradorPrincipal
                        ) {

                            return 1;
                        }


                        return (
                            a.id -
                            b.id
                        );
                    }
                )
            );


            setPedidos(
                pedidosApi
            );


            setHayError(
                false
            );

        } catch (
            error
        ) {

            console.error(
                error
            );


            setMensaje(
                "No fue posible cargar los usuarios."
            );


            setHayError(
                true
            );

        } finally {

            setCargando(
                false
            );
        }
    };


    useEffect(() => {

        cargarDatos();

    }, []);


    const usuariosFiltrados =
        listaUsuarios.filter(
            (
                usuario
            ) => {

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

                    usuario.direccion
                        .toLowerCase()
                        .includes(
                            texto
                        )
                );
            }
        );


    const obtenerHistorialUsuario = (
        usuario
    ) => {

        if (
            !usuario
        ) {

            return [];
        }


        return pedidos.filter(
            (
                pedido
            ) =>
                pedido.usuarioId ===
                usuario.id
        );
    };


    const verUsuario = (
        id
    ) => {

        const usuario =
            listaUsuarios.find(
                (
                    usuario
                ) =>
                    usuario.id ===
                    id
            );


        setUsuarioSeleccionado(
            usuario ||
            null
        );
    };


    const abrirCambioRol = (
        id
    ) => {

        const usuario =
            listaUsuarios.find(
                (
                    usuario
                ) =>
                    usuario.id ===
                    id
            );


        if (
            !usuario
        ) {

            return;
        }


        setUsuarioEditandoRol(
            usuario
        );


        setNuevoRol(
            usuario.rol
        );


        setMensaje("");
    };


    const guardarCambioRol = async () => {

        if (
            !usuarioEditandoRol
        ) {

            return;
        }


        try {

            await cambiarRolUsuarioApi(
                usuarioEditandoRol.id,
                nuevoRol
            );


            setMensaje(
                "Rol actualizado correctamente."
            );


            setHayError(
                false
            );


            setUsuarioEditandoRol(
                null
            );


            await cargarDatos();

        } catch (
            error
        ) {

            setMensaje(
                error.response
                    ?.data
                    ?.mensaje ||
                "No fue posible cambiar el rol."
            );


            setHayError(
                true
            );
        }
    };


    const prepararEliminarUsuario = (
        id
    ) => {

        const usuario =
            listaUsuarios.find(
                (
                    usuario
                ) =>
                    usuario.id ===
                    id
            );


        if (
            !usuario ||
            usuario.administradorPrincipal ||
            usuario.id ===
            usuarioActualId
        ) {

            return;
        }


        setUsuarioAEliminar(
            usuario
        );
    };


    const confirmarEliminarUsuario = async () => {

        if (
            !usuarioAEliminar
        ) {

            return;
        }


        try {

            await eliminarUsuarioApi(
                usuarioAEliminar.id
            );


            setMensaje(
                "Usuario eliminado correctamente."
            );


            setHayError(
                false
            );


            setUsuarioAEliminar(
                null
            );


            setUsuarioSeleccionado(
                null
            );


            await cargarDatos();

        } catch (
            error
        ) {

            setMensaje(
                error.response
                    ?.data
                    ?.mensaje ||
                "No fue posible eliminar el usuario."
            );


            setHayError(
                true
            );


            setUsuarioAEliminar(
                null
            );
        }
    };


    const handleNuevoUsuario = (
        e
    ) => {

        const {
            name,
            value
        } = e.target;


        setDatosNuevoUsuario({

            ...datosNuevoUsuario,

            [name]:
                value
        });


        setErrores({

            ...errores,

            [name]:
                ""
        });
    };


    const validarNuevoUsuario = () => {

        const nuevosErrores = {};


        if (
            datosNuevoUsuario.nombre
                .trim()
                .length <
            3
        ) {

            nuevosErrores.nombre =
                "El nombre debe tener al menos 3 caracteres.";
        }


        const correoValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !correoValido.test(
                datosNuevoUsuario.correo.trim()
            )
        ) {

            nuevosErrores.correo =
                "Ingresa un correo válido.";
        }


        if (
            datosNuevoUsuario.password.length <
            6
        ) {

            nuevosErrores.password =
                "La contraseña debe tener al menos 6 caracteres.";
        }


        const telefonoValido =
            /^\+569\s?\d{8}$/;


        if (
            !telefonoValido.test(
                datosNuevoUsuario.telefono.trim()
            )
        ) {

            nuevosErrores.telefono =
                "Usa el formato +569 12345678.";
        }


        if (
            datosNuevoUsuario.direccion
                .trim()
                .length <
            5
        ) {

            nuevosErrores.direccion =
                "Ingresa una dirección válida.";
        }


        if (
            datosNuevoUsuario.rol !==
                "Administrador" &&
            datosNuevoUsuario.rol !==
                "Vendedor"
        ) {

            nuevosErrores.rol =
                "Solo puedes crear administradores o vendedores.";
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


    const crearUsuario = async (
        e
    ) => {

        e.preventDefault();


        if (
            !validarNuevoUsuario()
        ) {

            return;
        }


        try {

            await crearUsuarioAdministrativoApi(
                datosNuevoUsuario
            );


            setMensaje(
                "Usuario administrativo creado correctamente."
            );


            setHayError(
                false
            );


            setDatosNuevoUsuario({
                ...usuarioNuevoVacio
            });


            setErrores({});


            setMostrarFormulario(
                false
            );


            await cargarDatos();

        } catch (
            error
        ) {

            setMensaje(
                error.response
                    ?.data
                    ?.mensaje ||
                "No fue posible crear el usuario."
            );


            setHayError(
                true
            );
        }
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
                            cargando
                                ? "Cargando..."
                                : `${listaUsuarios.length} usuarios registrados`
                        }

                    </p>

                </div>

            </header>


            {mensaje && (

                <div
                    className={
                        hayError
                            ? "mensaje-menu error"
                            : "mensaje-menu"
                    }
                >

                    {mensaje}

                </div>

            )}


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


            <div className="contenedor-btn-agregar">

                <button
                    type="button"
                    className="btn-agregar"
                    onClick={() => {

                        setDatosNuevoUsuario({
                            ...usuarioNuevoVacio
                        });

                        setErrores({});

                        setMostrarFormulario(
                            true
                        );
                    }}
                >
                    + AGREGAR USUARIO ADMINISTRATIVO
                </button>

            </div>


            <section className="tabla-usuarios">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>NOMBRE</th>
                            <th>CORREO</th>
                            <th>TELÉFONO</th>
                            <th>DIRECCIÓN</th>
                            <th>ROL</th>
                            <th>ACCIONES</th>

                        </tr>

                    </thead>


                    <tbody>

                        {!cargando &&
                        usuariosFiltrados.length >
                        0 ? (

                            usuariosFiltrados.map(
                                (
                                    usuario
                                ) => (

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

                                        administradorPrincipal={
                                            usuario.administradorPrincipal
                                        }

                                        esUsuarioActual={
                                            usuario.id ===
                                            usuarioActualId
                                        }

                                        onVer={
                                            verUsuario
                                        }

                                        onEditarRol={
                                            abrirCambioRol
                                        }

                                        onEliminar={
                                            prepararEliminarUsuario
                                        }
                                    />

                                )
                            )

                        ) : !cargando && (

                            <tr>

                                <td colSpan="7">
                                    No se encontraron usuarios.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </section>


            {usuarioSeleccionado && (

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
                                        usuarioSeleccionado.telefono ||
                                        "Sin teléfono registrado"
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
                                        (
                                            pedido
                                        ) => (

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

                                <p>
                                    Este usuario no registra compras.
                                </p>

                            )}

                        </section>


                        <div className="acciones-modal-usuario">

                            <button
                                type="button"
                                className="btn-cancelar-usuario"
                                onClick={() =>
                                    setUsuarioSeleccionado(
                                        null
                                    )
                                }
                            >
                                Cerrar
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {usuarioEditandoRol && (

                <div className="modal-usuario-fondo">

                    <div className="modal-usuario">

                        <h2>
                            Cambiar rol
                        </h2>


                        <p>
                            Usuario:{" "}
                            <strong>
                                {
                                    usuarioEditandoRol.nombre
                                }
                            </strong>
                        </p>


                        <div className="campo-usuario">

                            <label htmlFor="nuevoRol">
                                Rol
                            </label>


                            <select
                                id="nuevoRol"
                                value={
                                    nuevoRol
                                }
                                onChange={(e) =>
                                    setNuevoRol(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="Cliente">
                                    Cliente
                                </option>

                                <option value="Vendedor">
                                    Vendedor
                                </option>

                                <option value="Administrador">
                                    Administrador
                                </option>

                            </select>

                        </div>


                        <div className="acciones-modal-usuario">

                            <button
                                type="button"
                                className="btn-cancelar-usuario"
                                onClick={() =>
                                    setUsuarioEditandoRol(
                                        null
                                    )
                                }
                            >
                                Cancelar
                            </button>


                            <button
                                type="button"
                                className="btn-guardar-usuario"
                                onClick={
                                    guardarCambioRol
                                }
                            >
                                Guardar rol
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {mostrarFormulario && (

                <div className="modal-usuario-fondo">

                    <div className="modal-usuario">

                        <h2>
                            Crear usuario administrativo
                        </h2>


                        <form
                            onSubmit={
                                crearUsuario
                            }
                        >


                            <div className="campo-usuario">

                                <label htmlFor="nombre">
                                    Nombre
                                </label>

                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    value={
                                        datosNuevoUsuario.nombre
                                    }
                                    onChange={
                                        handleNuevoUsuario
                                    }
                                />

                                {errores.nombre && (
                                    <span className="mensaje-error">
                                        {errores.nombre}
                                    </span>
                                )}

                            </div>


                            <div className="campo-usuario">

                                <label htmlFor="correo">
                                    Correo
                                </label>

                                <input
                                    id="correo"
                                    name="correo"
                                    type="email"
                                    value={
                                        datosNuevoUsuario.correo
                                    }
                                    onChange={
                                        handleNuevoUsuario
                                    }
                                />

                                {errores.correo && (
                                    <span className="mensaje-error">
                                        {errores.correo}
                                    </span>
                                )}

                            </div>


                            <div className="campo-usuario">

                                <label htmlFor="password">
                                    Contraseña
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={
                                        datosNuevoUsuario.password
                                    }
                                    onChange={
                                        handleNuevoUsuario
                                    }
                                />

                                {errores.password && (
                                    <span className="mensaje-error">
                                        {errores.password}
                                    </span>
                                )}

                            </div>


                            <div className="campo-usuario">

                                <label htmlFor="telefono">
                                    Teléfono
                                </label>

                                <input
                                    id="telefono"
                                    name="telefono"
                                    type="text"
                                    placeholder="+569 12345678"
                                    value={
                                        datosNuevoUsuario.telefono
                                    }
                                    onChange={
                                        handleNuevoUsuario
                                    }
                                />

                                {errores.telefono && (
                                    <span className="mensaje-error">
                                        {errores.telefono}
                                    </span>
                                )}

                            </div>


                            <div className="campo-usuario">

                                <label htmlFor="direccion">
                                    Dirección
                                </label>

                                <input
                                    id="direccion"
                                    name="direccion"
                                    type="text"
                                    value={
                                        datosNuevoUsuario.direccion
                                    }
                                    onChange={
                                        handleNuevoUsuario
                                    }
                                />

                                {errores.direccion && (
                                    <span className="mensaje-error">
                                        {errores.direccion}
                                    </span>
                                )}

                            </div>


                            <div className="campo-usuario">

                                <label htmlFor="rol">
                                    Rol
                                </label>

                                <select
                                    id="rol"
                                    name="rol"
                                    value={
                                        datosNuevoUsuario.rol
                                    }
                                    onChange={
                                        handleNuevoUsuario
                                    }
                                >

                                    <option value="Vendedor">
                                        Vendedor
                                    </option>

                                    <option value="Administrador">
                                        Administrador
                                    </option>

                                </select>

                            </div>


                            <div className="acciones-modal-usuario">

                                <button
                                    type="button"
                                    className="btn-cancelar-usuario"
                                    onClick={() => {

                                        setMostrarFormulario(
                                            false
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
                                    Crear usuario
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
                            Sus pedidos históricos se conservarán.
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