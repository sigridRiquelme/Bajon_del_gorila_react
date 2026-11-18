import {
    useEffect,
    useState
} from "react";

import "../../styles/usuarios.css";

import {
    actualizarMiPerfilApi,
    obtenerMiPerfilApi
} from "../../api/auth.js";


function PerfilAdmin() {

    const [
        usuario,
        setUsuario
    ] = useState(null);


    const [
        cargando,
        setCargando
    ] = useState(true);


    const [
        modoEdicion,
        setModoEdicion
    ] = useState(false);


    const [
        datosFormulario,
        setDatosFormulario
    ] = useState({

        nombre: "",
        correo: "",
        telefono: "",
        direccion: "",
        password: ""
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


    const cargarPerfil = async () => {

        try {

            const datos =
                await obtenerMiPerfilApi();


            setUsuario(
                datos
            );


            setDatosFormulario({

                nombre:
                    datos.nombre ||
                    "",

                correo:
                    datos.correo ||
                    "",

                telefono:
                    datos.telefono ||
                    "",

                direccion:
                    datos.direccion ||
                    "",

                password:
                    ""
            });


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
                "No fue posible cargar el perfil."
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

        cargarPerfil();

    }, []);


    const manejarCambio = (
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


        setMensaje("");
    };


    const validarFormulario = () => {

        const nuevosErrores = {};


        const nombre =
            datosFormulario.nombre
                .trim();


        const correo =
            datosFormulario.correo
                .trim()
                .toLowerCase();


        const telefono =
            datosFormulario.telefono
                .trim();


        const direccion =
            datosFormulario.direccion
                .trim();


        if (
            nombre.length <
            3
        ) {

            nuevosErrores.nombre =
                "El nombre debe tener al menos 3 caracteres.";
        }


        const correoValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !correoValido.test(
                correo
            )
        ) {

            nuevosErrores.correo =
                "Ingresa un correo válido.";
        }


        if (
            telefono !==
                "" &&
            !/^\+569\s?\d{8}$/.test(
                telefono
            )
        ) {

            nuevosErrores.telefono =
                "El teléfono debe tener formato +569 12345678.";
        }


        if (
            direccion !==
                "" &&
            direccion.length <
                5
        ) {

            nuevosErrores.direccion =
                "La dirección debe tener al menos 5 caracteres.";
        }


        if (
            datosFormulario.password !==
                "" &&
            datosFormulario.password.length <
                6
        ) {

            nuevosErrores.password =
                "La nueva contraseña debe tener al menos 6 caracteres.";
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


    const guardarCambios = async (
        e
    ) => {

        e.preventDefault();


        if (
            !validarFormulario()
        ) {

            return;
        }


        try {

            const datosActualizar = {

                nombre:
                    datosFormulario.nombre
                        .trim(),

                correo:
                    datosFormulario.correo
                        .trim()
                        .toLowerCase(),

                telefono:
                    datosFormulario.telefono
                        .trim(),

                direccion:
                    datosFormulario.direccion
                        .trim()
            };


            if (
                datosFormulario.password !==
                ""
            ) {

                datosActualizar.password =
                    datosFormulario.password;
            }


            const actualizado =
                await actualizarMiPerfilApi(
                    datosActualizar
                );


            setUsuario(
                actualizado
            );


            localStorage.setItem(
                "usuarioNombre",
                actualizado.nombre
            );


            localStorage.setItem(
                "usuarioCorreo",
                actualizado.correo
            );


            setDatosFormulario({

                nombre:
                    actualizado.nombre ||
                    "",

                correo:
                    actualizado.correo ||
                    "",

                telefono:
                    actualizado.telefono ||
                    "",

                direccion:
                    actualizado.direccion ||
                    "",

                password:
                    ""
            });


            setModoEdicion(
                false
            );


            setMensaje(
                "Los datos del perfil fueron actualizados correctamente."
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
                error.response
                    ?.data
                    ?.mensaje ||
                "No fue posible actualizar el perfil."
            );


            setHayError(
                true
            );
        }
    };


    const cancelarEdicion = () => {

        if (
            !usuario
        ) {

            return;
        }


        setDatosFormulario({

            nombre:
                usuario.nombre ||
                "",

            correo:
                usuario.correo ||
                "",

            telefono:
                usuario.telefono ||
                "",

            direccion:
                usuario.direccion ||
                "",

            password:
                ""
        });


        setErrores({});

        setMensaje("");

        setModoEdicion(
            false
        );
    };


    if (
        cargando
    ) {

        return (

            <main className="reporte-admin">

                <p>
                    Cargando perfil...
                </p>

            </main>
        );
    }


    if (
        !usuario
    ) {

        return (

            <main className="reporte-admin">

                <h1>
                    Perfil
                </h1>

                <p>
                    No fue posible cargar la información de tu cuenta.
                </p>

            </main>
        );
    }


    const rolVisible =
        usuario.rol ===
        "ADMINISTRADOR"
            ? "Administrador"
            : usuario.rol ===
                "VENDEDOR"
                ? "Vendedor"
                : "Cliente";


    return (

        <main className="reporte-admin">

            <div className="mb-4">

                <h1>
                    Perfil
                </h1>

                <p className="text-secondary">
                    Información de tu cuenta
                </p>

            </div>


            <div className="card border-0 shadow-sm">

                <div className="card-body p-4">


                    <div className="d-flex align-items-center gap-3 mb-4">

                        <div className="reporte-icono mb-0">

                            <i className="bi bi-person-fill"></i>

                        </div>


                        <div>

                            <h2 className="h5 mb-1">

                                {
                                    usuario.nombre
                                }

                            </h2>

                            <span className="badge bg-dark">

                                {
                                    rolVisible
                                }

                            </span>

                        </div>

                    </div>


                    {mensaje && (

                        <div
                            className={
                                hayError
                                    ? "alert alert-danger"
                                    : "alert alert-success"
                            }
                        >

                            {
                                mensaje
                            }

                        </div>

                    )}


                    {!modoEdicion ? (

                        <div className="row g-4">


                            <div className="col-12 col-md-6">

                                <label className="form-label text-secondary">
                                    ID
                                </label>

                                <p className="fw-semibold mb-0">

                                    #
                                    {
                                        usuario.idUsuario
                                    }

                                </p>

                            </div>


                            <div className="col-12 col-md-6">

                                <label className="form-label text-secondary">
                                    Rol
                                </label>

                                <p className="fw-semibold mb-0">

                                    {
                                        rolVisible
                                    }

                                </p>

                            </div>


                            <div className="col-12 col-md-6">

                                <label className="form-label text-secondary">
                                    Nombre
                                </label>

                                <p className="fw-semibold mb-0">

                                    {
                                        usuario.nombre
                                    }

                                </p>

                            </div>


                            <div className="col-12 col-md-6">

                                <label className="form-label text-secondary">
                                    Correo
                                </label>

                                <p className="fw-semibold mb-0">

                                    {
                                        usuario.correo
                                    }

                                </p>

                            </div>


                            <div className="col-12 col-md-6">

                                <label className="form-label text-secondary">
                                    Teléfono
                                </label>

                                <p className="fw-semibold mb-0">

                                    {
                                        usuario.telefono ||
                                        "Sin teléfono registrado"
                                    }

                                </p>

                            </div>


                            <div className="col-12 col-md-6">

                                <label className="form-label text-secondary">
                                    Dirección
                                </label>

                                <p className="fw-semibold mb-0">

                                    {
                                        usuario.direccion ||
                                        "Sin dirección registrada"
                                    }

                                </p>

                            </div>


                            <div className="col-12">

                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onClick={() =>
                                        setModoEdicion(
                                            true
                                        )
                                    }
                                >

                                    <i className="bi bi-pencil me-2"></i>

                                    Editar perfil

                                </button>

                            </div>

                        </div>

                    ) : (

                        <form
                            onSubmit={
                                guardarCambios
                            }
                        >

                            <div className="row g-3">


                                <div className="col-12 col-md-6">

                                    <label
                                        htmlFor="nombre"
                                        className="form-label"
                                    >
                                        Nombre
                                    </label>


                                    <input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        className={`form-control ${
                                            errores.nombre
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={
                                            datosFormulario.nombre
                                        }
                                        onChange={
                                            manejarCambio
                                        }
                                    />


                                    {errores.nombre && (

                                        <div className="invalid-feedback">
                                            {
                                                errores.nombre
                                            }
                                        </div>

                                    )}

                                </div>


                                <div className="col-12 col-md-6">

                                    <label
                                        htmlFor="correo"
                                        className="form-label"
                                    >
                                        Correo
                                    </label>


                                    <input
                                        id="correo"
                                        name="correo"
                                        type="email"
                                        className={`form-control ${
                                            errores.correo
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={
                                            datosFormulario.correo
                                        }
                                        onChange={
                                            manejarCambio
                                        }
                                    />


                                    {errores.correo && (

                                        <div className="invalid-feedback">
                                            {
                                                errores.correo
                                            }
                                        </div>

                                    )}

                                </div>


                                <div className="col-12 col-md-6">

                                    <label
                                        htmlFor="telefono"
                                        className="form-label"
                                    >
                                        Teléfono
                                    </label>


                                    <input
                                        id="telefono"
                                        name="telefono"
                                        type="text"
                                        className={`form-control ${
                                            errores.telefono
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        placeholder="+569 12345678"
                                        value={
                                            datosFormulario.telefono
                                        }
                                        onChange={
                                            manejarCambio
                                        }
                                    />


                                    {errores.telefono && (

                                        <div className="invalid-feedback">
                                            {
                                                errores.telefono
                                            }
                                        </div>

                                    )}

                                </div>


                                <div className="col-12 col-md-6">

                                    <label
                                        htmlFor="direccion"
                                        className="form-label"
                                    >
                                        Dirección
                                    </label>


                                    <input
                                        id="direccion"
                                        name="direccion"
                                        type="text"
                                        className={`form-control ${
                                            errores.direccion
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={
                                            datosFormulario.direccion
                                        }
                                        onChange={
                                            manejarCambio
                                        }
                                    />


                                    {errores.direccion && (

                                        <div className="invalid-feedback">
                                            {
                                                errores.direccion
                                            }
                                        </div>

                                    )}

                                </div>


                                <div className="col-12 col-md-6">

                                    <label
                                        htmlFor="password"
                                        className="form-label"
                                    >
                                        Nueva contraseña
                                    </label>


                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className={`form-control ${
                                            errores.password
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        placeholder="Dejar vacío para mantener la actual"
                                        value={
                                            datosFormulario.password
                                        }
                                        onChange={
                                            manejarCambio
                                        }
                                    />


                                    {errores.password && (

                                        <div className="invalid-feedback">
                                            {
                                                errores.password
                                            }
                                        </div>

                                    )}

                                </div>


                                <div className="col-12 col-md-6">

                                    <label className="form-label">
                                        Rol
                                    </label>


                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            rolVisible
                                        }
                                        disabled
                                    />

                                </div>


                                <div className="col-12 mt-4">

                                    <div className="d-flex gap-2">

                                        <button
                                            type="submit"
                                            className="btn btn-dark"
                                        >
                                            Guardar cambios
                                        </button>


                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={
                                                cancelarEdicion
                                            }
                                        >
                                            Cancelar
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </form>

                    )}

                </div>

            </div>

        </main>
    );
}


export default PerfilAdmin;