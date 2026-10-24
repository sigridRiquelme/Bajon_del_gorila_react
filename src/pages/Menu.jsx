import { useState } from "react";
import ProductoCard from "../components/ProductoCard.jsx";
import { productosMenu } from "../data/catalogoPublico.js";

import "../styles/Menu.css";
import "../styles/Responsive.css";

const categorias = [
  "Todos",
  "Hamburguesas",
  "Completos",
  "Churrascos",
  "Papas",
  "Combos",
  "Bebidas"
];

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function Menu() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [orden, setOrden] = useState("Más vendidos");

  const productosFiltrados = productosMenu
    .filter((producto) => {
      const coincideCategoria =
        categoria === "Todos" ||
        producto.categoria === categoria;

      const textoProducto = normalizarTexto(
        `${producto.nombre} ${producto.descripcion} ${producto.categoria}`
      );

      const coincideBusqueda = textoProducto.includes(
        normalizarTexto(busqueda.trim())
      );

      return coincideCategoria && coincideBusqueda;
    })
    .sort((a, b) => {
      if (orden === "Menor precio") {
        return a.precio - b.precio;
      }

      if (orden === "Mayor precio") {
        return b.precio - a.precio;
      }

      return b.valoracion - a.valoracion;
    });

  return (
    <>
      <section className="cabecera-pagina">
        <div className="contenedor">
          <p className="antetitulo">🍔 NUESTRO MENÚ</p>

          <h1 className="titulo-seccion">
            ELIGE TU BAJÓN
          </h1>

          <p>Tenemos algo para cada nivel de hambre.</p>
        </div>
      </section>

      <section className="barra-filtros">
        <div className="contenedor contenido-filtros">

          <div className="caja-busqueda">
            <span className="icono-busqueda">⌕</span>

            <input
              className="campo-entrada"
              type="search"
              placeholder="Buscar productos…"
              aria-label="Buscar productos"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="filtros-categoria">
            {categorias.map((item) => (
              <button
                key={item}
                type="button"
                className={`boton-filtro ${
                  categoria === item ? "activo" : ""
                }`}
                onClick={() => setCategoria(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <select
            className="campo-entrada selector-orden"
            aria-label="Ordenar productos"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option>Más vendidos</option>
            <option>Menor precio</option>
            <option>Mayor precio</option>
          </select>

        </div>
      </section>

      <section className="productos-menu">
        <div className="contenedor">

          <p className="texto-resultados">
            <strong>{productosFiltrados.length}</strong>
            {" "}productos encontrados
            {categoria !== "Todos" && ` en ${categoria}`}
          </p>

          {productosFiltrados.length > 0 ? (
            <div className="grilla-productos">
              {productosFiltrados.map((producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </div>
          ) : (
            <div className="estado-vacio mostrar">
              <div className="emoji">🦍</div>
              <h3>NO ENCONTRAMOS ESO</h3>
              <p>Intenta con otra búsqueda o categoría.</p>
            </div>
          )}

        </div>
      </section>
    </>
  );
}

export default Menu;
