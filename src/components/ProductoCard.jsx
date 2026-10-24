import {
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    obtenerPrecioFinal
} from "../data/productos.js";


function ProductoCard({
    producto,
    onAgregar
}) {

    const [
        esFavorito,
        setEsFavorito
    ] = useState(false);


    const [
        cantidad,
        setCantidad
    ] = useState(1);


    const precioFinal =
        obtenerPrecioFinal(
            producto
        );


    const tienePromocion =
        producto.promocion &&
        producto.descuento >
        0;


    const stockDisponible =
        producto.stockDisponible ??
        producto.stock;


    const sinStock =
        stockDisponible <=
            0 ||
        producto.estado ===
            "Sin stock";


    const stockBajo =
        stockDisponible >
            0 &&
        stockDisponible <=
            5;


    const aumentarCantidad = () => {

        if (
            cantidad <
            stockDisponible
        ) {

            setCantidad(
                cantidad + 1
            );
        }
    };


    const disminuirCantidad = () => {

        if (
            cantidad >
            1
        ) {

            setCantidad(
                cantidad - 1
            );
        }
    };


    const agregarProducto = () => {

        if (
            !onAgregar ||
            sinStock
        ) {

            return;
        }


        // ENVIO EL PRECIO PROMOCIONAL AL CARRITO

        onAgregar(
            {
                ...producto,
                precio:
                    precioFinal
            },
            cantidad
        );


        setCantidad(
            1
        );
    };


    return (

        <article className="tarjeta-producto">


            <div className="contenedor-imagen-producto">

                <Link
                    to={`/producto/${producto.codigo}`}
                >

                    <img
                        className="imagen-producto"
                        src={
                            producto.imagen
                        }
                        alt={
                            producto.nombre
                        }
                    />

                </Link>


                {tienePromocion ? (

                    <span className="etiqueta etiqueta-naranja etiqueta-producto">
                        -{producto.descuento}% OFF
                    </span>

                ) : producto.etiqueta && (

                    <span
                        className={`etiqueta etiqueta-${producto.colorEtiqueta} etiqueta-producto`}
                    >
                        {
                            producto.etiqueta
                        }
                    </span>

                )}


                <button
                    type="button"
                    className="boton-favorito"
                    onClick={() =>
                        setEsFavorito(
                            !esFavorito
                        )
                    }
                >
                    {
                        esFavorito
                            ? "❤️"
                            : "🤍"
                    }
                </button>

            </div>


            <div className="cuerpo-producto">

                <span className="categoria-producto">
                    {
                        producto.categoria
                    }
                </span>


                <Link
                    to={`/producto/${producto.codigo}`}
                    style={{
                        textDecoration:
                            "none"
                    }}
                >

                    <h3 className="titulo-producto">
                        {
                            producto.nombre
                        }
                    </h3>

                </Link>


                <div className="valoracion">

                    <span className="estrellas">
                        ★★★★
                    </span>

                    <span className="numero-valoracion">
                        {
                            producto.valoracion ||
                            4.8
                        }
                    </span>

                </div>


                <p className="descripcion-producto">
                    {
                        producto.descripcion
                    }
                </p>


                <div
                    className={`stock-producto ${
                        sinStock
                            ? "sin-stock"
                            : stockBajo
                                ? "stock-bajo"
                                : ""
                    }`}
                >

                    {
                        sinStock
                            ? "Sin stock disponible"
                            : stockBajo
                                ? `Últimas ${stockDisponible} unidades disponibles`
                                : `Stock disponible: ${stockDisponible}`
                    }

                </div>


                <div className="pie-producto">


                    {tienePromocion ? (

                        <div className="precio-con-promocion">

                            <span className="precio-anterior-producto">

                                $
                                {
                                    producto.precio.toLocaleString(
                                        "es-CL"
                                    )
                                }

                            </span>


                            <span className="precio-producto">

                                $
                                {
                                    precioFinal.toLocaleString(
                                        "es-CL"
                                    )
                                }

                            </span>

                        </div>

                    ) : (

                        <span className="precio-producto">

                            $
                            {
                                producto.precio.toLocaleString(
                                    "es-CL"
                                )
                            }

                        </span>

                    )}

                </div>


                <div className="acciones-producto-menu">


                    <div className="selector-cantidad-producto">

                        <button
                            type="button"
                            onClick={
                                disminuirCantidad
                            }
                            disabled={
                                cantidad <=
                                    1 ||
                                sinStock
                            }
                        >
                            −
                        </button>


                        <span>
                            {
                                sinStock
                                    ? 0
                                    : cantidad
                            }
                        </span>


                        <button
                            type="button"
                            onClick={
                                aumentarCantidad
                            }
                            disabled={
                                sinStock ||
                                cantidad >=
                                    stockDisponible
                            }
                        >
                            +
                        </button>

                    </div>


                    <button
                        type="button"
                        className="boton-agregar"
                        disabled={
                            !onAgregar ||
                            sinStock
                        }
                        onClick={
                            agregarProducto
                        }
                    >

                        {
                            sinStock
                                ? "SIN STOCK"
                                : "AGREGAR"
                        }

                    </button>

                </div>


                <Link
                    to={`/producto/${producto.codigo}`}
                    className="boton-ver-detalle"
                >
                    VER DETALLE
                </Link>

            </div>

        </article>
    );
}


export default ProductoCard;