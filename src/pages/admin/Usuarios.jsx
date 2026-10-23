import { useState } from "react";

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

    const [listaUsuarios, setListaUsuarios] = useState(
        obtenerUsuarios()
    );

    const [busqueda, setBusqueda] = useState("");

    const [usuarioSeleccionado, setUsuarioSeleccionado] =
        useState(null);

    const [usuarioEditando, setUsuarioEditando] =
        useState(null);

    const [usuarioAEliminar, setUsuarioAEliminar] =
        useState(null);

    const [mostrarDetalle, setMostrarDetalle] =
        useState(false);

    const [mostrarFormulario, setMostrarFormulario] =
        useState(false);

    const [errores, setErrores] =
        useState({});


    const [datosFormulario, setDatosFormulario] =
        useState({
            nombre: "",
            correo: "",
            telefono: "",
            rol: "Cliente"
        });


    const usuariosFiltrados = listaUsuarios.filter(
        (usuario) => {

            const texto = busqueda.toLowerCase();

            return (
                usuario.nombre
                    .toLowerCase()
                    .includes(texto) ||

                usuario.correo
                    .toLowerCase()
                    .includes(texto)
            );
        }
    );


    const obtenerHistorialUsuario = (usuario) => {

        if (!usuario) {
            return [];
        }

        const pedidos = obtenerPedidos();

        return pedidos.filter(
            (pedido) =>
                pedido.cliente
                    .toLowerCase()
                    .trim() ===
                usuario.nombre
                    .toLowerCase()
                    .trim()
        );
    };


    const verUsuario = (id) => {

        const usuario = listaUsuarios.find(
            (usuario) => usuario.id === id
        );

        if (!usuario) {
            return;
        }

        setUsuarioSeleccionado(usuario);

        setMostrarDetalle(true);
    };


    const editarUsuario = (id) => {

        const usuario = listaUsuarios.find(
            (usuario) => usuario.id === id
        );

        if (!usuario) {
            return;
        }

        setUsuarioEditando(usuario);

        setDatosFormulario({
            nombre: usuario.nombre,
            correo: usuario.correo,
            telefono: usuario.telefono,
            rol: usuario.rol
        });

        setErrores({});

        setMostrarDetalle(false);

        setMostrarFormulario(true);
    };


    const handleChange = (e) => {

        const { name, value } = e.target;

        setDatosFormulario({
            ...datosFormulario,
            [name]: value
        });

        setErrores({
            ...errores,
            [name]: ""
        });
    };


    const validarFormulario = () => {

        const nuevosErrores = {};


        if (datosFormulario.nombre.trim() === "") {

            nuevosErrores.nombre =
                "El nombre es obligatorio";

        } else if (
            datosFormulario.nombre.trim().length < 3
        ) {

            nuevosErrores.nombre =
                "El nombre debe tener al menos 3 caracteres";
        }


        if (datosFormulario.correo.trim() === "") {

            nuevosErrores.correo =
                "El correo es obligatorio";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                datosFormulario.correo
            )
        ) {

            nuevosErrores.correo =
                "Ingresa un correo válido";
        }


        if (datosFormulario.telefono.trim() === "") {

            nuevosErrores.telefono =
                "El teléfono es obligatorio";

        } else if (
            !/^\+569\d{8}$/.test(
                datosFormulario.telefono
            )
        ) {

            nuevosErrores.telefono =
                "El teléfono debe tener formato +569XXXXXXXX";
        }


        setErrores(nuevosErrores);

        return Object.keys(nuevosErrores).length === 0;
    };


    const guardarUsuario = (e) => {

        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        actualizarUsuario(
            usuarioEditando.id,
            datosFormulario
        );

        setListaUsuarios(
            obtenerUsuarios()
        );

        setMostrarFormulario(false);

        setUsuarioEditando(null);

        setErrores({});
    };


    const eliminarUsuario = (id) => {

        const usuario = listaUsuarios.find(
            (usuario) => usuario.id === id
        );

        if (!usuario) {
            return;
        }

        if (usuario.rol === "Administrador") {
            return;
        }

        setUsuarioAEliminar(usuario);
    };

    const confirmarEliminarUsuario = () => {

        if (!usuarioAEliminar) {
            return;
        }

        eliminarUsuarioData(
            usuarioAEliminar.id
        );

        setListaUsuarios(
            obtenerUsuarios()
        );

        setUsuarioAEliminar(null);

        setMostrarDetalle(false);
    };


    const historialUsuario =
        obtenerHistorialUsuario(usuarioSeleccionado);


    return (

        <main className="usuarios-admin">


            <header className="encabezado-usuarios">

                <div>

                    <h1>USUARIOS</h1>

                    <p>
                        {listaUsuarios.length}{" "}
                        {listaUsuarios.length === 1
                            ? "usuario registrado"
                            : "usuarios registrados"}
                    </p>

                </div>

            </header>


            <section className="filtros-usuarios">

                <input
                    type="text"
                    placeholder="Buscar por nombre o correo..."
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(e.target.value)
                    }
                />

            </section>


            <section className="tabla-usuarios">

                <table>

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>NOMBRE</th>
                            <th>CORREO</th>
                            <th>TELÉFONO</th>
                            <th>ROL</th>
                            <th>ACCIONES</th>
                        </tr>

                    </thead>


                    <tbody>

                        {usuariosFiltrados.length > 0 ? (

                            usuariosFiltrados.map(
                                (usuario) => (

                                    <UsuarioFila
                                        key={usuario.id}
                                        id={usuario.id}
                                        nombre={usuario.nombre}
                                        correo={usuario.correo}
                                        telefono={usuario.telefono}
                                        rol={usuario.rol}
                                        onVer={verUsuario}
                                        onEditar={editarUsuario}
                                        onEliminar={eliminarUsuario}
                                    />

                                )
                            )

                        ) : (

                            <tr>

                                <td colSpan="6">
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
                                        {usuarioSeleccionado.nombre}
                                    </h2>

                                </div>

                            </div>


                            <section className="datos-usuario">

                                <div>
                                    <span>Correo</span>

                                    <strong>
                                        {usuarioSeleccionado.correo}
                                    </strong>
                                </div>


                                <div>
                                    <span>Teléfono</span>

                                    <strong>
                                        {usuarioSeleccionado.telefono}
                                    </strong>
                                </div>


                                <div>
                                    <span>Rol</span>

                                    <strong>
                                        {usuarioSeleccionado.rol}
                                    </strong>
                                </div>

                            </section>


                            <section className="historial-compras">

                                <div className="titulo-historial">

                                    <h3>
                                        Historial de compras
                                    </h3>

                                    <span>
                                        {historialUsuario.length}{" "}
                                        {historialUsuario.length === 1
                                            ? "compra"
                                            : "compras"}
                                    </span>

                                </div>


                                {historialUsuario.length > 0 ? (

                                    <div className="lista-historial">

                                        {historialUsuario.map(
                                            (pedido) => (

                                                <div
                                                    className="compra-historial"
                                                    key={pedido.codigo}
                                                >

                                                    <div>

                                                        <strong>
                                                            Pedido #{pedido.codigo}
                                                        </strong>

                                                        <span>
                                                            {pedido.fecha}
                                                        </span>

                                                    </div>


                                                    <strong className="total-historial">

                                                        $
                                                        {pedido.total.toLocaleString(
                                                            "es-CL"
                                                        )}

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
                                    className="btn-cerrar-usuario"
                                    onClick={() =>
                                        setMostrarDetalle(false)
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


                            <form onSubmit={guardarUsuario}>


                                <div className="campo-usuario">

                                    <label htmlFor="nombre">
                                        Nombre
                                    </label>

                                    <input
                                        id="nombre"
                                        type="text"
                                        name="nombre"
                                        value={
                                            datosFormulario.nombre
                                        }
                                        onChange={handleChange}
                                        className={
                                            errores.nombre
                                                ? "campo-error"
                                                : ""
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
                                        type="email"
                                        name="correo"
                                        value={
                                            datosFormulario.correo
                                        }
                                        onChange={handleChange}
                                        className={
                                            errores.correo
                                                ? "campo-error"
                                                : ""
                                        }
                                    />

                                    {errores.correo && (

                                        <span className="mensaje-error">
                                            {errores.correo}
                                        </span>

                                    )}

                                </div>


                                <div className="campo-usuario">

                                    <label htmlFor="telefono">
                                        Teléfono
                                    </label>

                                    <input
                                        id="telefono"
                                        type="text"
                                        name="telefono"
                                        placeholder="+56912345678"
                                        value={
                                            datosFormulario.telefono
                                        }
                                        onChange={handleChange}
                                        className={
                                            errores.telefono
                                                ? "campo-error"
                                                : ""
                                        }
                                    />

                                    {errores.telefono && (

                                        <span className="mensaje-error">
                                            {errores.telefono}
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
                                            datosFormulario.rol
                                        }
                                        onChange={handleChange}
                                    >

                                        <option value="Cliente">
                                            Cliente
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
                                            setMostrarFormulario(false)
                                        }
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
                                {usuarioAEliminar.nombre}
                            </strong>
                            ?
                        </p>


                        <p className="texto-advertencia">
                            Esta acción eliminará el usuario del sistema.
                        </p>


                        <div className="acciones-confirmar-eliminar">

                            <button
                                className="btn-cancelar-eliminar"
                                onClick={() =>
                                    setUsuarioAEliminar(null)
                                }
                            >
                                Cancelar
                            </button>


                            <button
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