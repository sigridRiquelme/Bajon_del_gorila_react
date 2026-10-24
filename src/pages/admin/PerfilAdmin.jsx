import { useState } from "react";
import "../../styles/usuarios.css";

import {
    obtenerUsuarioPorId,
    obtenerUsuarios,
    actualizarUsuario
} from "../../data/usuarios.js";


function PerfilAdmin() {

    const administrador = obtenerUsuarioPorId(0);

    const [modoEdicion, setModoEdicion] = useState(false);

    const [datosFormulario, setDatosFormulario] = useState({
        nombre: administrador?.nombre || "",
        correo: administrador?.correo || "",
        telefono: administrador?.telefono || ""
    });

    const [errores, setErrores] = useState({});

    const [mensaje, setMensaje] = useState("");


    const manejarCambio = (e) => {

        const { name, value } = e.target;

        setDatosFormulario({
            ...datosFormulario,
            [name]: value
        });

        setErrores({
            ...errores,
            [name]: ""
        });

        setMensaje("");
    };


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


        // VALIDAR NOMBRE

        if (nombre === "") {

            nuevosErrores.nombre =
                "El nombre es obligatorio.";

        } else if (nombre.length < 3) {

            nuevosErrores.nombre =
                "El nombre debe tener al menos 3 caracteres.";

        } else if (nombre.length > 50) {

            nuevosErrores.nombre =
                "El nombre no puede superar los 50 caracteres.";
        }


        // VALIDAR CORREO

        const correoValido =
            /^[^\s@]+@(gmail\.com|duoc\.cl|duocuc\.cl)$/i;

        if (correo === "") {

            nuevosErrores.correo =
                "El correo es obligatorio.";

        } else if (!correoValido.test(correo)) {

            nuevosErrores.correo =
                "El correo debe ser Gmail, Duoc o Duoc UC.";

        } else {

            const correoRepetido =
                obtenerUsuarios().some(
                    (usuario) =>
                        usuario.id !== 0 &&
                        usuario.correo
                            .toLowerCase()
                            .trim() === correo
                );

            if (correoRepetido) {

                nuevosErrores.correo =
                    "Este correo ya está registrado.";
            }
        }


        // VALIDAR TELÉFONO

        if (telefono === "") {

            nuevosErrores.telefono =
                "El teléfono es obligatorio.";

        } else if (
            !/^\+569 \d{8}$/.test(telefono)
        ) {

            nuevosErrores.telefono =
                "El teléfono debe tener formato +569 12345678.";
        }


        setErrores(nuevosErrores);

        return Object.keys(nuevosErrores).length === 0;
    };


    const guardarCambios = (e) => {

        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }


        actualizarUsuario(0, {
            ...administrador,

            nombre:
                datosFormulario.nombre.trim(),

            correo:
                datosFormulario.correo
                    .trim()
                    .toLowerCase(),

            telefono:
                datosFormulario.telefono.trim()
        });


        setModoEdicion(false);

        setMensaje(
            "Los datos del perfil fueron actualizados correctamente."
        );
    };


    const cancelarEdicion = () => {

        setDatosFormulario({
            nombre: administrador?.nombre || "",
            correo: administrador?.correo || "",
            telefono: administrador?.telefono || ""
        });

        setErrores({});
        setMensaje("");
        setModoEdicion(false);
    };


    if (!administrador) {

        return (
            <main>

                <h1>
                    Perfil
                </h1>

                <p>
                    No se encontró el usuario administrador.
                </p>

            </main>
        );
    }


    return (

        <main className="reporte-admin">

            <div className="mb-4">

                <h1>
                    Perfil
                </h1>

                <p className="text-secondary">
                    Información de tu cuenta de administrador
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
                                {administrador.nombre}
                            </h2>

                            <span className="badge bg-dark">
                                {administrador.rol}
                            </span>

                        </div>

                    </div>


                    {mensaje && (

                        <div className="alert alert-success">
                            {mensaje}
                        </div>

                    )}


                    {!modoEdicion ? (

                        <div className="row g-4">


                            <div className="col-12 col-md-6">

                                <label className="form-label text-secondary">
                                    ID
                                </label>

                                <p className="fw-semibold mb-0">
                                    #{administrador.id}
                                </p>

                            </div>


                            <div className="col-12 col-md-6">

                                <label className="form-label text-secondary">
                                    Rol
                                </label>

                                <p className="fw-semibold mb-0">
                                    {administrador.rol}
                                </p>

                            </div>


                            <div className="col-12 col-md-6">

                                <label className="form-label text-secondary">
                                    Nombre
                                </label>

                                <p className="fw-semibold mb-0">
                                    {administrador.nombre}
                                </p>

                            </div>


                            <div className="col-12 col-md-6">

                                <label className="form-label text-secondary">
                                    Correo
                                </label>

                                <p className="fw-semibold mb-0">
                                    {administrador.correo}
                                </p>

                            </div>


                            <div className="col-12 col-md-6">

                                <label className="form-label text-secondary">
                                    Teléfono
                                </label>

                                <p className="fw-semibold mb-0">
                                    {administrador.telefono}
                                </p>

                            </div>


                            <div className="col-12">

                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onClick={() =>
                                        setModoEdicion(true)
                                    }
                                >

                                    <i className="bi bi-pencil me-2"></i>

                                    Editar perfil

                                </button>

                            </div>


                        </div>

                    ) : (

                        <form onSubmit={guardarCambios}>

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
                                        maxLength="50"
                                        className={`form-control ${
                                            errores.nombre
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={
                                            datosFormulario.nombre
                                        }
                                        onChange={manejarCambio}
                                    />

                                    {errores.nombre && (

                                        <div className="invalid-feedback">
                                            {errores.nombre}
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
                                        onChange={manejarCambio}
                                    />

                                    {errores.correo && (

                                        <div className="invalid-feedback">
                                            {errores.correo}
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


                                    <div className="telefono-input">

                                        <span className="prefijo-telefono">
                                            +569
                                        </span>


                                        <input
                                            id="telefono"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="8"
                                            placeholder="84755654"
                                            className={`form-control ${
                                                errores.telefono
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
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
                                                        soloNumeros.length > 0
                                                            ? `+569 ${soloNumeros}`
                                                            : ""
                                                });


                                                setErrores({
                                                    ...errores,
                                                    telefono: ""
                                                });

                                                setMensaje("");
                                            }}
                                        />

                                    </div>


                                    {errores.telefono && (

                                        <div className="mensaje-error">
                                            {errores.telefono}
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
                                        value={administrador.rol}
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
                                            onClick={cancelarEdicion}
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