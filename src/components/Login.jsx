import {
    useState
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    iniciarSesionApi
} from "../api/auth.js";

import {
    pasarCarritoInvitado
} from "../data/carrito.js";


function Login() {

    const navigate =
        useNavigate();


    const location =
        useLocation();


    const [
        correo,
        setCorreo
    ] = useState("");


    const [
        password,
        setPassword
    ] = useState("");


    const [
        error,
        setError
    ] = useState("");


    const desdeCheckout =
        location.state?.desdeCheckout ===
        true;


    const iniciarSesion = async (
        e
    ) => {

        e.preventDefault();

        setError("");


        const correoLimpio =
            correo
                .trim()
                .toLowerCase();


        if (
            correoLimpio ===
            ""
            ||
            password ===
            ""
        ) {

            setError(
                "Completa todos los campos."
            );

            return;
        }


        try {

            const respuesta =
                await iniciarSesionApi(
                    correoLimpio,
                    password
                );


            const carritoInvitadoGuardado =
                localStorage.getItem(
                    "carrito_invitado"
                );


            const carritoInvitado =
                carritoInvitadoGuardado
                    ? JSON.parse(
                        carritoInvitadoGuardado
                    )
                    : [];


            const teniaCarritoInvitado =
                carritoInvitado.length >
                0;


            // GUARDO SESION

            localStorage.setItem(
                "token",
                respuesta.token
            );

            localStorage.setItem(
                "usuarioActualId",
                respuesta.idUsuario.toString()
            );

            localStorage.setItem(
                "usuarioRol",
                respuesta.rol
            );

            localStorage.setItem(
                "usuarioNombre",
                respuesta.nombre
            );

            localStorage.setItem(
                "usuarioCorreo",
                respuesta.correo
            );


            // ADMIN Y VENDEDOR VAN AL PANEL

            if (
                respuesta.rol ===
                "ADMINISTRADOR"
                ||
                respuesta.rol ===
                "VENDEDOR"
            ) {

                navigate(
                    "/admin"
                );

                return;
            }


            // CARRITO INVITADO → CLIENTE

            pasarCarritoInvitado(
                respuesta.idUsuario
            );


            if (
                desdeCheckout
                ||
                teniaCarritoInvitado
            ) {

                navigate(
                    "/checkout",
                    {
                        replace: true
                    }
                );

                return;
            }


            navigate(
                "/"
            );

        } catch (
            error
        ) {

            const mensaje =
                error.response
                    ?.data
                    ?.mensaje;


            setError(
                mensaje ||
                "No fue posible iniciar sesión."
            );
        }
    };


    return (

        <main
            className="container py-5"
            style={{
                maxWidth:
                    "500px"
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
                        INICIAR SESIÓN
                    </h1>


                    {desdeCheckout ? (

                        <p className="text-center text-secondary mb-4">
                            Inicia sesión para continuar con tu compra
                        </p>

                    ) : (

                        <p className="text-center text-secondary mb-4">
                            Ingresa a tu cuenta
                        </p>

                    )}


                    {error && (

                        <div className="alert alert-danger">

                            {
                                error
                            }

                        </div>

                    )}


                    <form
                        onSubmit={
                            iniciarSesion
                        }
                    >

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
                                value={
                                    correo
                                }
                                onChange={(e) => {

                                    setCorreo(
                                        e.target.value
                                    );

                                    setError(
                                        ""
                                    );
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
                                value={
                                    password
                                }
                                onChange={(e) => {

                                    setPassword(
                                        e.target.value
                                    );

                                    setError(
                                        ""
                                    );
                                }}
                            />

                        </div>


                        <button
                            type="submit"
                            className="btn w-100 text-white fw-bold"
                            style={{
                                backgroundColor:
                                    "#ff6500"
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