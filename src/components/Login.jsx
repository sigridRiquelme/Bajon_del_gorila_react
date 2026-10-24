import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    obtenerUsuarios
} from "../data/usuarios.js";


function Login() {

    const navigate = useNavigate();

    const [correo, setCorreo] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");


    const iniciarSesion = (e) => {

        e.preventDefault();

        setError("");


        const correoLimpio =
            correo
                .trim()
                .toLowerCase();


        // CAMPOS VACÍOS

        if (
            correoLimpio === "" ||
            password === ""
        ) {

            setError(
                "Completa todos los campos."
            );

            return;
        }


        // BUSCAR USUARIO

        const usuario =
            obtenerUsuarios().find(
                (usuario) =>
                    usuario.correo
                        .toLowerCase()
                        .trim() === correoLimpio
            );


        if (!usuario) {

            setError(
                "El correo no está registrado."
            );

            return;
        }


        // VALIDAR CONTRASEÑA

        if (usuario.password !== password) {

            setError(
                "La contraseña es incorrecta."
            );

            return;
        }


        // GUARDAR USUARIO CONECTADO

        localStorage.setItem(
            "usuarioActualId",
            usuario.id.toString()
        );


        // REDIRECCIÓN SEGÚN ROL

        if (usuario.rol === "Administrador") {

            navigate("/admin");

        } else {

            navigate("/");
        }
    };


    return (

        <main
            className="container py-5"
            style={{
                maxWidth: "500px"
            }}
        >

            <div className="card border-0 shadow">

                <div className="card-body p-4">

                    <h1
                        className="text-center mb-2"
                        style={{
                            color: "#ff6500",
                            fontWeight: "bold"
                        }}
                    >
                        INICIAR SESIÓN
                    </h1>


                    <p className="text-center text-secondary mb-4">
                        Ingresa a tu cuenta
                    </p>


                    {error && (

                        <div className="alert alert-danger">
                            {error}
                        </div>

                    )}


                    <form onSubmit={iniciarSesion}>


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
                                className="form-control"
                                placeholder="ejemplo@gmail.com"
                                value={correo}
                                onChange={(e) => {

                                    setCorreo(
                                        e.target.value
                                    );

                                    setError("");
                                }}
                            />

                        </div>


                        <div className="mb-4">

                            <label
                                htmlFor="password"
                                className="form-label"
                            >
                                Contraseña
                            </label>

                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => {

                                    setPassword(
                                        e.target.value
                                    );

                                    setError("");
                                }}
                            />

                        </div>


                        <button
                            type="submit"
                            className="btn w-100 text-white fw-bold"
                            style={{
                                backgroundColor: "#ff6500"
                            }}
                        >
                            INGRESAR
                        </button>


                    </form>


                    <p className="text-center mt-4 mb-0">

                        ¿No tienes una cuenta?{" "}

                        <Link to="/registro">
                            Regístrate
                        </Link>

                    </p>


                </div>

            </div>

        </main>
    );
}


export default Login;