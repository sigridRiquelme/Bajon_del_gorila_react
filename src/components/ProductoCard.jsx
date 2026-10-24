import { useState } from "react";

function ProductoCard({ producto, onAgregar }) {
  const [esFavorito, setEsFavorito] = useState(false);

  const precioFormateado = producto.precio.toLocaleString("es-CL");

  return (
    <article className="tarjeta-producto">
      <div className="contenedor-imagen-producto">
        <img
          className="imagen-producto"
          src={producto.imagen}
          alt={producto.nombre}
        />

        {producto.etiqueta && (
          <span
            className={`etiqueta etiqueta-${producto.colorEtiqueta} etiqueta-producto`}
          >
            {producto.etiqueta}
          </span>
        )}

        <button
          type="button"
          className="boton-favorito"
          aria-label={`${esFavorito ? "Quitar" : "Agregar"} ${producto.nombre} ${esFavorito ? "de" : "a"} favoritos`}
          aria-pressed={esFavorito}
          onClick={() => setEsFavorito(!esFavorito)}
        >
          {esFavorito ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="cuerpo-producto">
        <span className="categoria-producto">
          {producto.categoria}
        </span>

        <h3 className="titulo-producto">
          {producto.nombre}
        </h3>

        <div className="valoracion">
          <span className="estrellas">★★★★</span>
          <span className="numero-valoracion">
            {producto.valoracion}
          </span>
        </div>

        <p className="descripcion-producto">
          {producto.descripcion}
        </p>

        <div className="pie-producto">
          <span className="precio-producto">
            ${precioFormateado}
          </span>

          <button
            type="button"
            className="boton-agregar"
            disabled={!onAgregar}
            title={!onAgregar ? "Pendiente de integrar con el carrito" : undefined}
            onClick={() => onAgregar?.(producto)}
          >
            + AGREGAR
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductoCard;
