import {
    useState
} from "react";

import "../styles/publicas.css";


function Contacto() {

    const [
        datos,
        setDatos
    ] = useState({

        nombre: "",
        correo: "",
        telefono: "",
        asunto: "",
        mensaje: ""
    });


    const [
        errores,
        setErrores
    ] = useState({});


    const [
        mensajeExito,
        setMensajeExito
    ] = useState("");


    // ACTUALIZO LOS CAMPOS

    const cambiarCampo = (
        e
    ) => {

        const {
            name,
            value
        } = e.target;


        setDatos({
            ...datos,
            [name]: value
        });


        setErrores({
            ...errores,
            [name]: ""
        });


        setMensajeExito("");
    };


    // VALIDO EL FORMULARIO

    const validarFormulario = () => {

        const nuevosErrores = {};


        if (
            datos.nombre
                .trim()
                .length <
            3
        ) {

            nuevosErrores.nombre =
                "El nombre debe tener al menos 3 caracteres.";
        }


        const correoValido =
            /^[^\s@]+@(gmail\.com|duoc\.cl|duocuc\.cl)$/i;


        if (
            !correoValido.test(
                datos.correo.trim()
            )
        ) {

            nuevosErrores.correo =
                "Ingresa un correo Gmail, Duoc o DuocUC válido.";
        }


        if (
            datos.telefono !==
            "" &&
            !/^\+569\s?\d{8}$/.test(
                datos.telefono.trim()
            )
        ) {

            nuevosErrores.telefono =
                "Ingresa un teléfono válido. Ej: +569 12345678.";
        }


        if (
            datos.asunto ===
            ""
        ) {

            nuevosErrores.asunto =
                "Selecciona un motivo de contacto.";
        }


        if (
            datos.mensaje
                .trim()
                .length <
            10
        ) {

            nuevosErrores.mensaje =
                "El mensaje debe tener al menos 10 caracteres.";
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


    // SIMULO EL ENVIO DEL MENSAJE

    const enviarMensaje = (
        e
    ) => {

        e.preventDefault();


        if (
            !validarFormulario()
        ) {

            return;
        }


        setMensajeExito(
            "Mensaje enviado correctamente. Nos pondremos en contacto contigo."
        );


        setDatos({

            nombre: "",
            correo: "",
            telefono: "",
            asunto: "",
            mensaje: ""
        });


        setErrores({});
    };


    return (

        <main className="pagina-publica">


            <section className="contacto-encabezado">

                <div className="contenedor">

                    <p className="pagina-antetitulo">
                        HABLEMOS
                    </p>


                    <h1>
                        CONTACTO
                    </h1>


                    <p>
                        ¿Tienes una consulta sobre tu pedido o quieres comunicarte con nosotros? Escríbenos.
                    </p>

                </div>

            </section>


            <section className="contacto-seccion">

                <div className="contenedor contacto-grid">


                    <div className="contacto-informacion">

                        <p className="pagina-antetitulo">
                            EL BAJÓN DEL GORILA
                        </p>


                        <h2>
                            ESTAMOS PARA AYUDARTE
                        </h2>


                        <p>
                            Si tienes una consulta, sugerencia o problema con tu pedido, puedes enviarnos un mensaje desde este formulario.
                        </p>


                        <div className="contacto-datos">


                            <div>

                                <span>
                                    📍
                                </span>

                                <div>

                                    <strong>
                                        Ubicación
                                    </strong>

                                    <p>
                                        Santiago, Chile
                                    </p>

                                </div>

                            </div>


                            <div>

                                <span>
                                    📱
                                </span>

                                <div>

                                    <strong>
                                        WhatsApp
                                    </strong>

                                    <p>
                                        Contáctanos para consultas y pedidos.
                                    </p>

                                </div>

                            </div>


                            <div>

                                <span>
                                    🦍
                                </span>

                                <div>

                                    <strong>
                                        El Bajón del Gorila
                                    </strong>

                                    <p>
                                        Comida rápida para cuando pega el bajón.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="contacto-formulario">


                        <h2>
                            ENVÍANOS UN MENSAJE
                        </h2>


                        {mensajeExito && (

                            <div className="contacto-exito">
                                {
                                    mensajeExito
                                }
                            </div>

                        )}


                        <form
                            onSubmit={
                                enviarMensaje
                            }
                        >


                            <div className="contacto-campo">

                                <label htmlFor="contactoNombre">
                                    Nombre completo *
                                </label>


                                <input
                                    id="contactoNombre"
                                    name="nombre"
                                    type="text"
                                    value={
                                        datos.nombre
                                    }
                                    onChange={
                                        cambiarCampo
                                    }
                                    className={
                                        errores.nombre
                                            ? "campo-error"
                                            : ""
                                    }
                                />


                                {errores.nombre && (

                                    <small>
                                        {
                                            errores.nombre
                                        }
                                    </small>

                                )}

                            </div>


                            <div className="contacto-fila">


                                <div className="contacto-campo">

                                    <label htmlFor="contactoCorreo">
                                        Correo *
                                    </label>


                                    <input
                                        id="contactoCorreo"
                                        name="correo"
                                        type="email"
                                        placeholder="ejemplo@gmail.com"
                                        value={
                                            datos.correo
                                        }
                                        onChange={
                                            cambiarCampo
                                        }
                                        className={
                                            errores.correo
                                                ? "campo-error"
                                                : ""
                                        }
                                    />


                                    {errores.correo && (

                                        <small>
                                            {
                                                errores.correo
                                            }
                                        </small>

                                    )}

                                </div>


                                <div className="contacto-campo">

                                    <label htmlFor="contactoTelefono">
                                        Teléfono
                                    </label>


                                    <input
                                        id="contactoTelefono"
                                        name="telefono"
                                        type="text"
                                        placeholder="+569 12345678"
                                        value={
                                            datos.telefono
                                        }
                                        onChange={
                                            cambiarCampo
                                        }
                                        className={
                                            errores.telefono
                                                ? "campo-error"
                                                : ""
                                        }
                                    />


                                    {errores.telefono && (

                                        <small>
                                            {
                                                errores.telefono
                                            }
                                        </small>

                                    )}

                                </div>

                            </div>


                            <div className="contacto-campo">

                                <label htmlFor="contactoAsunto">
                                    Motivo de contacto *
                                </label>


                                <select
                                    id="contactoAsunto"
                                    name="asunto"
                                    value={
                                        datos.asunto
                                    }
                                    onChange={
                                        cambiarCampo
                                    }
                                    className={
                                        errores.asunto
                                            ? "campo-error"
                                            : ""
                                    }
                                >

                                    <option value="">
                                        Selecciona una opción
                                    </option>

                                    <option value="pedido">
                                        Consulta sobre mi pedido
                                    </option>

                                    <option value="problema">
                                        Problema con mi pedido
                                    </option>

                                    <option value="sugerencia">
                                        Sugerencia
                                    </option>

                                    <option value="otro">
                                        Otro
                                    </option>

                                </select>


                                {errores.asunto && (

                                    <small>
                                        {
                                            errores.asunto
                                        }
                                    </small>

                                )}

                            </div>


                            <div className="contacto-campo">

                                <label htmlFor="contactoMensaje">
                                    Mensaje *
                                </label>


                                <textarea
                                    id="contactoMensaje"
                                    name="mensaje"
                                    placeholder="Cuéntanos cómo podemos ayudarte..."
                                    value={
                                        datos.mensaje
                                    }
                                    onChange={
                                        cambiarCampo
                                    }
                                    className={
                                        errores.mensaje
                                            ? "campo-error"
                                            : ""
                                    }
                                />


                                {errores.mensaje && (

                                    <small>
                                        {
                                            errores.mensaje
                                        }
                                    </small>

                                )}

                            </div>


                            <button
                                type="submit"
                                className="contacto-boton"
                            >
                                ENVIAR MENSAJE
                            </button>

                        </form>

                    </div>

                </div>

            </section>

        </main>
    );
}


export default Contacto;