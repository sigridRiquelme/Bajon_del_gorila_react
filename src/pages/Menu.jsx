import { useState } from "react";

import ProductoCard from "../components/ProductoCard.jsx";

import {
    obtenerProductos
} from "../data/productos.js";

import {
    obtenerUsuarioPorId
} from "../data/usuarios.js";

import {
    agregarAlCarrito,
    obtenerCarrito
} from "../data/carrito.js";

import "../styles/Menu.css";
import "../styles/responsive.css";


const categorias = [
    "Todos",
    "Hamburguesas",
    "Completos",
    "Churrascos",
    "Fajitas",
    "Papas",
    "Combos",
    "Bebidas"
];


function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}


function Menu() {

    const [busqueda, setBusqueda] =
        useState("");

    const [categoria, setCategoria] =
        useState("Todos");

    const [orden, setOrden] =
        useState("Más vendidos");

    const [
        mensajeCarrito,
        setMensajeCarrito
    ] = useState("");

    const [
        hayErrorCarrito,
        setHayErrorCarrito
    ] = useState(false);

    const [
        carritoActual,
        setCarritoActual
    ] = useState(
        obtenerCarrito()
    );


    const usuarioActualId =
        localStorage.getItem(
            "usuarioActualId"
        );


    const usuarioActual =
        usuarioActualId !== null
            ? obtenerUsuarioPorId(
                Number(
                    usuarioActualId
                )
            )
            : null;


    const esAdministrador =
        usuarioActual?.rol ===
        "Administrador";


    // USO LOS PRODUCTOS DEL ADMIN PARA QUE PRECIO Y STOCK SEAN LOS MISMOS

    const productosMenu =
        obtenerProductos()
            .filter(
                (producto) =>
                    producto.estado !==
                    "Oculto"
            )
            .map(
                (producto) => {

                    const productoEnCarrito =
                        carritoActual.find(
                            (item) =>
                                item.codigo ===
                                producto.codigo
                        );


                    const cantidadEnCarrito =
                        productoEnCarrito
                            ? productoEnCarrito.cantidad
                            : 0;


                    const stockDisponible =
                        Math.max(
                            producto.stock -
                            cantidadEnCarrito,
                            0
                        );


                    return {
                        ...producto,

                        id:
                            producto.codigo,

                        descripcion:
                            producto.descripcion ||
                            "Producto disponible en El Bajón del Gorila.",

                        valoracion:
                            producto.valoracion ||
                            4.8,

                        // CAMBIO: muestro lo que realmente queda disponible para agregar
                        stockDisponible:
                            stockDisponible
                    };
                }
            );


    // AGREGO LA CANTIDAD ELEGIDA DE UNA SOLA VEZ

    const agregarProducto = (
        producto,
        cantidad
    ) => {

        setMensajeCarrito("");
        setHayErrorCarrito(false);


        if (esAdministrador) {

            setMensajeCarrito(
                "La cuenta de administrador no puede realizar compras."
            );

            setHayErrorCarrito(true);

            return;
        }


        if (
            producto.stockDisponible <= 0 ||
            producto.estado ===
            "Sin stock"
        ) {

            setMensajeCarrito(
                "Este producto no tiene stock disponible."
            );

            setHayErrorCarrito(true);

            return;
        }


        if (
            cantidad >
            producto.stockDisponible
        ) {

            setMensajeCarrito(
                `Solo puedes agregar ${producto.stockDisponible} unidades más de ${producto.nombre}.`
            );

            setHayErrorCarrito(true);

            return;
        }


        for (
            let i = 0;
            i < cantidad;
            i++
        ) {

            agregarAlCarrito(
                producto
            );
        }


        const carritoActualizado =
            obtenerCarrito();


        setCarritoActual(
            carritoActualizado
        );


        setMensajeCarrito(
            `${cantidad} ${producto.nombre} agregado al carrito.`
        );

        setHayErrorCarrito(false);
    };


    const productosFiltrados =
        productosMenu

            .filter(
                (producto) => {

                    const coincideCategoria =
                        categoria ===
                            "Todos" ||
                        producto.categoria ===
                            categoria;


                    const textoProducto =
                        normalizarTexto(
                            `${producto.nombre} ${producto.descripcion} ${producto.categoria}`
                        );


                    const coincideBusqueda =
                        textoProducto.includes(
                            normalizarTexto(
                                busqueda.trim()
                            )
                        );


                    return (
                        coincideCategoria &&
                        coincideBusqueda
                    );
                }
            )


            .sort(
                (a, b) => {

                    if (
                        orden ===
                        "Menor precio"
                    ) {

                        return (
                            a.precio -
                            b.precio
                        );
                    }


                    if (
                        orden ===
                        "Mayor precio"
                    ) {

                        return (
                            b.precio -
                            a.precio
                        );
                    }


                    return (
                        b.valoracion -
                        a.valoracion
                    );
                }
            );


    return (

        <>

            <section className="cabecera-pagina">

                <div className="contenedor">

                    <p className="antetitulo">
                        🍔 NUESTRO MENÚ
                    </p>


                    <h1 className="titulo-seccion">
                        ELIGE TU BAJÓN
                    </h1>


                    <p>
                        Tenemos algo para cada nivel de hambre.
                    </p>

                </div>

            </section>


            <section className="barra-filtros">

                <div className="contenedor contenido-filtros">


                    <div className="caja-busqueda">

                        <span className="icono-busqueda">
                            ⌕
                        </span>


                        <input
                            className="campo-entrada"
                            type="search"
                            placeholder="Buscar productos…"
                            aria-label="Buscar productos"
                            value={busqueda}
                            onChange={(e) =>
                                setBusqueda(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <select
                        className="campo-entrada selector-categoria"
                        value={categoria}
                        onChange={(e) =>
                            setCategoria(
                                e.target.value
                            )
                        }
                    >

                        {categorias.map(
                            (item) => (

                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item === "Todos"
                                        ? "Todas las categorías"
                                        : item
                                    }
                                </option>

                            )
                        )}

                    </select>


                    <select
                        className="campo-entrada selector-orden"
                        aria-label="Ordenar productos"
                        value={orden}
                        onChange={(e) =>
                            setOrden(
                                e.target.value
                            )
                        }
                    >

                        <option>
                            Más vendidos
                        </option>

                        <option>
                            Menor precio
                        </option>

                        <option>
                            Mayor precio
                        </option>

                    </select>

                </div>

            </section>


            <section className="productos-menu">

                <div className="contenedor">


                    {mensajeCarrito && (

                        <div
                            className={
                                hayErrorCarrito
                                    ? "mensaje-menu error"
                                    : "mensaje-menu"
                            }
                        >
                            {mensajeCarrito}
                        </div>

                    )}


                    <p className="texto-resultados">

                        <strong>
                            {
                                productosFiltrados.length
                            }
                        </strong>

                        {" "}
                        productos encontrados

                        {categoria !==
                            "Todos" &&
                            ` en ${categoria}`
                        }

                    </p>


                    {productosFiltrados.length >
                    0 ? (

                        <div className="grilla-productos">

                            {productosFiltrados.map(
                                (producto) => (

                                    <ProductoCard
                                        key={
                                            producto.id
                                        }
                                        producto={
                                            producto
                                        }
                                        onAgregar={
                                            esAdministrador
                                                ? undefined
                                                : agregarProducto
                                        }
                                    />

                                )
                            )}

                        </div>

                    ) : (

                        <div className="estado-vacio mostrar">

                            <div className="emoji">
                                🦍
                            </div>

                            <h3>
                                NO ENCONTRAMOS ESO
                            </h3>

                            <p>
                                Intenta con otra búsqueda o categoría.
                            </p>

                        </div>

                    )}

                </div>

            </section>

        </>
    );
}


export default Menu;