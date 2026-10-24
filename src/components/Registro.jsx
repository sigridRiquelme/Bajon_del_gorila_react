import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    agregarUsuario,
    obtenerUsuarios
} from "../data/usuarios.js";


function Registro() {

    const navigate =
        useNavigate();


    const [
        nombre,
        setNombre
    ] = useState("");


    const [
        correo,
        setCorreo
    ] = useState("");


    const [
        password,
        setPassword
    ] = useState("");


    const [
        confirmPassword,
        setConfirmPassword
    ] = useState("");


    const [
        telefono,
        setTelefono
    ] = useState("");


    const [
        direccion,
        setDireccion
    ] = useState("");


    const [
        errores,
        setErrores
    ] = useState({});


    const [
        mensaje,
        setMensaje
    ] = useState("");


    // VALIDO EL FORMULARIO

    const validarFormulario = () => {

        const nuevosErrores = {};


        const nombreLimpio =
            nombre.trim();


        const correoLimpio =
            correo
                .trim()
                .toLowerCase();


        const direccionLimpia =
            direccion.trim();


        // NOMBRE

        if (
            nombreLimpio ===
            ""
        ) {

            nuevosErrores.nombre =
                "El nombre es obligatorio.";

        } else if (
            nombreLimpio.length <
            3
        ) {

            nuevosErrores.nombre =
                "El nombre debe tener al menos 3 caracteres.";

        } else if (
            nombreLimpio.length >
            50
        ) {

            nuevosErrores.nombre =
                "El nombre no puede superar los 50 caracteres.";
        }


        // CORREO

        const correoValido =
            /^[^\s@]+@(gmail\.com|duoc\.cl|duocuc\.cl)$/i;


        if (
            correoLimpio ===
            ""
        ) {

            nuevosErrores.correo =
                "El correo es obligatorio.";

        } else if (
            !correoValido.test(
                correoLimpio
            )
        ) {

            nuevosErrores.correo =
                "El correo debe ser Gmail, Duoc o Duoc UC.";

        } else {

            const correoExiste =
                obtenerUsuarios().some(
                    (usuario) =>
                        usuario.correo
                            .toLowerCase()
                            .trim() ===
                        correoLimpio
                );


            if (
                correoExiste
            ) {

                nuevosErrores.correo =
                    "Este correo ya está registrado.";
            }
        }


        // CONTRASEÑA

        if (
            password ===
            ""
        ) {

            nuevosErrores.password =
                "La contraseña es obligatoria.";

        } else if (
            password.length <
            4 ||
            password.length >
            10
        ) {

            nuevosErrores.password =
                "La contraseña debe tener entre 4 y 10 caracteres.";
        }


        // CONFIRMAR CONTRASEÑA

        if (
            confirmPassword ===
            ""
        ) {

            nuevosErrores.confirmPassword =
                "Debes confirmar la contraseña.";

        } else if (
            password !==
            confirmPassword
        ) {

            nuevosErrores.confirmPassword =
                "Las contraseñas no coinciden.";
        }


        // TELEFONO

        if (
            telefono ===
            ""
        ) {

            nuevosErrores.telefono =
                "El teléfono es obligatorio.";

        } else if (
            !/^\+569 \d{8}$/.test(
                telefono
            )
        ) {

            nuevosErrores.telefono =
                "El teléfono debe tener formato +569 12345678.";
        }


        // DIRECCION

        if (
            direccionLimpia ===
            ""
        ) {

            nuevosErrores.direccion =
                "La dirección es obligatoria.";

        } else if (
            direccionLimpia.length <
            10
        ) {

            nuevosErrores.direccion =
                "La dirección debe tener al menos 10 caracteres.";

        } else if (
            direccionLimpia.length >
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
            ).length ===
            0
        );
    };


    // REGISTRO AL CLIENTE

    const registrarUsuario = (
        e
    ) => {

        e.preventDefault();

        setMensaje("");


        if (
            !validarFormulario()
        ) {

            return;
        }


        agregarUsuario({

            nombre:
                nombre.trim(),

            correo:
                correo
                    .trim()
                    .toLowerCase(),

            password:
                password,

            telefono:
                telefono.trim(),

            direccion:
                direccion.trim(),

            rol:
                "Cliente"
        });


        setMensaje(
            "Usuario registrado correctamente."
        );


        setNombre("");
        setCorreo("");
        setPassword("");
        setConfirmPassword("");
        setTelefono("");
        setDireccion("");
        setErrores({});
    };


    return (

        <main
            className="container py-5"
            style={{
                maxWidth:
                    "650px"
            }}
        >

            <div className="card border-0 shadow">

                <div className="card-body p-4">

                    <h1
                        className="text-center mb-2"
                        style={{
                            color:
                                "#ff6500",

                            fontWeight:
                                "bold"
                        }}
                    >
                        REGISTRO
                    </h1>


                    <p className="text-center text-secondary mb-4">
                        Crea tu cuenta en El Bajón del Gorila
                    </p>


                    {mensaje && (

                        <div className="alert alert-success">

                            {
                                mensaje
                            }


                            <div className="mt-2">

                                <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={() =>
                                        navigate(
                                            "/login"
                                        )
                                    }
                                >
                                    Ir a iniciar sesión
                                </button>

                            </div>

                        </div>

                    )}


                    <form
                        onSubmit={
                            registrarUsuario
                        }
                    >

                        <div className="mb-3">

                            <label
                                htmlFor="nombre"
                                className="form-label"
                            >
                                Nombre completo
                            </label>


                            <input
                                id="nombre"
                                type="text"
                                className={`form-control ${
                                    errores.nombre
                                        ? "is-invalid"
                                        : ""
                                }`}
                                maxLength="50"
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

                                <div className="invalid-feedback">
                                    {
                                        errores.nombre
                                    }
                                </div>

                            )}

                        </div>


                        <div className="mb-3">

                            <label
                                htmlFor="correo"
                                className="form-label"
                            >
                                Correo electrónico
                            </label>


                            <input
                                id="correo"
                                type="email"
                                className={`form-control ${
                                    errores.correo
                                        ? "is-invalid"
                                        : ""
                                }`}
                                placeholder="ejemplo@gmail.com"
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

                                <div className="invalid-feedback">
                                    {
                                        errores.correo
                                    }
                                </div>

                            )}

                        </div>


                        <div className="row">


                            <div className="col-12 col-md-6 mb-3">

                                <label
                                    htmlFor="password"
                                    className="form-label"
                                >
                                    Contraseña
                                </label>


                                <input
                                    id="password"
                                    type="password"
                                    className={`form-control ${
                                        errores.password
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    placeholder="4 a 10 caracteres"
                                    value={
                                        password
                                    }
                                    onChange={(e) => {

                                        setPassword(
                                            e.target.value
                                        );

                                        setErrores({
                                            ...errores,
                                            password: ""
                                        });
                                    }}
                                />


                                {errores.password && (

                                    <div className="invalid-feedback">
                                        {
                                            errores.password
                                        }
                                    </div>

                                )}

                            </div>


                            <div className="col-12 col-md-6 mb-3">

                                <label
                                    htmlFor="confirmPassword"
                                    className="form-label"
                                >
                                    Confirmar contraseña
                                </label>


                                <input
                                    id="confirmPassword"
                                    type="password"
                                    className={`form-control ${
                                        errores.confirmPassword
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(e) => {

                                        setConfirmPassword(
                                            e.target.value
                                        );

                                        setErrores({
                                            ...errores,
                                            confirmPassword: ""
                                        });
                                    }}
                                />


                                {errores.confirmPassword && (

                                    <div className="invalid-feedback">
                                        {
                                            errores.confirmPassword
                                        }
                                    </div>

                                )}

                            </div>

                        </div>


                        <div className="mb-3">

                            <label
                                htmlFor="telefono"
                                className="form-label"
                            >
                                Teléfono
                            </label>


                            <div className="input-group">

                                <span className="input-group-text">
                                    +569
                                </span>


                                <input
                                    id="telefono"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="8"
                                    className={`form-control ${
                                        errores.telefono
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    placeholder="12345678"
                                    value={
                                        telefono.replace(
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


                                        setTelefono(
                                            soloNumeros.length >
                                            0
                                                ? `+569 ${soloNumeros}`
                                                : ""
                                        );


                                        setErrores({
                                            ...errores,
                                            telefono: ""
                                        });
                                    }}
                                />


                                {errores.telefono && (

                                    <div className="invalid-feedback">
                                        {
                                            errores.telefono
                                        }
                                    </div>

                                )}

                            </div>

                        </div>


                        <div className="mb-4">

                            <label
                                htmlFor="direccion"
                                className="form-label"
                            >
                                Dirección
                            </label>


                            <input
                                id="direccion"
                                type="text"
                                maxLength="100"
                                className={`form-control ${
                                    errores.direccion
                                        ? "is-invalid"
                                        : ""
                                }`}
                                placeholder="Ej: Av. Principal 1234, Santiago"
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

                                <div className="invalid-feedback">
                                    {
                                        errores.direccion
                                    }
                                </div>

                            )}

                        </div>


                        <button
                            type="submit"
                            className="btn w-100 text-white fw-bold"
                            style={{
                                backgroundColor:
                                    "#ff6500"
                            }}
                        >
                            REGISTRARME
                        </button>

                    </form>


                    <p className="text-center mt-4 mb-0">

                        ¿Ya tienes una cuenta?{" "}

                        <Link to="/login">
                            Iniciar sesión
                        </Link>

                    </p>

                </div>

            </div>

        </main>
    );
}


export default Registro;