import { Link } from "react-router-dom";

function PromocionCard({ promocion }) {
  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString("es-CL")}`;
  };

  return (
    <article
      className={`tarjeta-promocion ${
        promocion.invertida ? "invertida" : ""
      }`}
    >
      <div className="contenido-promocion">
        <span
          className={`etiqueta etiqueta-promocion ${promocion.color}`}
        >
          {promocion.etiqueta}
        </span>

        <h2 className="titulo-seccion">
          {promocion.nombre}
        </h2>

        <p>{promocion.descripcion}</p>

        <div className="fila-precio-promocion">
          <span className="precio-promocion">
            {formatearPrecio(promocion.precio)}
          </span>

          <span className="precio-original-promocion">
            {formatearPrecio(promocion.precioOriginal)}
          </span>

          <span
            className={`etiqueta-descuento ${promocion.color}`}
          >
            -{promocion.descuento}%
          </span>
        </div>

        <Link className="boton boton-principal" to="/menu">
          PEDIR AHORA 🍔
        </Link>
      </div>

      <div className="contenedor-imagen-promocion">
        <img
          src={promocion.imagen}
          alt={promocion.textoAlternativo}
        />

        <div className="circulo-descuento">
          <strong>-{promocion.descuento}%</strong>
          <small>OFF</small>
        </div>
      </div>
    </article>
  );
}

export default PromocionCard;
