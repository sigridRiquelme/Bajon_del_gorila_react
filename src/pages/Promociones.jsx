import { useState } from "react";

import PromocionCard from "../components/PromocionCard.jsx";
import { promociones } from "../data/catalogoPublico.js";

import "../styles/Menu.css";
import "../styles/promociones.css";
import "../styles/Responsive.css";

function Promociones() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [hayError, setHayError] = useState(false);

  function manejarSuscripcion(evento) {
    evento.preventDefault();

    const correoLimpio = correo.trim();
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correoLimpio)) {
      setMensaje("Ingresa un correo válido.");
      setHayError(true);
      return;
    }

    setMensaje(
      "¡Correo validado! La suscripción aún es una demostración."
    );
    setHayError(false);
    setCorreo("");
  }

  return (
    <>
      <section className="cabecera-pagina cabecera-pagina--degradado cabecera-promociones">
        <div className="contenedor">
          <p className="antetitulo">
            🔥 SOLO POR TIEMPO LIMITADO
          </p>

          <h1 className="titulo-seccion">
            PROMOS PARA UN
            <br />
            BAJÓN BRUTAL
          </h1>

          <p>
            Ofertas que el gorila no deja pasar. Tampoco tú.
          </p>
        </div>
      </section>

      <section className="seccion-lista-promociones">
        <div className="contenedor">

          <div className="lista-promociones">
            {promociones.map((promocion) => (
              <PromocionCard
                key={promocion.id}
                promocion={promocion}
              />
            ))}
          </div>

          <div className="boletin">
            <div className="texto-boletin">
              <p className="antetitulo">
                SÉ EL PRIMERO EN ENTERARTE
              </p>

              <h3 className="titulo-seccion">
                ALERTAS DE BAJÓN 🔔
              </h3>

              <p>
                Regístrate y recibe las mejores promos
                antes que nadie.
              </p>
            </div>

            <form
              className="formulario-boletin"
              onSubmit={manejarSuscripcion}
              noValidate
            >
              <input
                className="campo-entrada"
                type="email"
                placeholder="tu@correo.cl"
                aria-label="Correo electrónico"
                value={correo}
                onChange={(evento) => {
                  setCorreo(evento.target.value);
                  setMensaje("");
                  setHayError(false);
                }}
                required
              />

              <button
                className="boton boton-amarillo"
                type="submit"
              >
                SUSCRIBIRME
              </button>
            </form>
          </div>

          {mensaje && (
            <p
              className={`mensaje-alertas ${
                hayError ? "error" : ""
              }`}
              role={hayError ? "alert" : "status"}
            >
              {mensaje}
            </p>
          )}

        </div>
      </section>
    </>
  );
}

export default Promociones;
