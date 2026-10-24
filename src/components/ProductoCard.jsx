import {
    useState
} from "react";


function ProductoCard({
    producto,
    onAgregar
}) {

    const [esFavorito, setEsFavorito] =
        useState(false);

    const [cantidad, setCantidad] =
        useState(1);


    const precioFormateado =
        producto.precio.toLocaleString(
            "es-CL"
        );


    const stockDisponible =
        producto.stockDisponible ??
        producto.stock;


    const sinStock =
        stockDisponible <= 0 ||
        producto.estado === "Sin stock";


    const stockBajo =
        stockDisponible > 0 &&
        stockDisponible <= 5;


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

        if (cantidad > 1) {

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


        onAgregar(
            producto,
            cantidad
        );


        setCantidad(1);
    };


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
                    onClick={() =>
                        setEsFavorito(
                            !esFavorito
                        )
                    }
                >
                    {esFavorito
                        ? "❤️"
                        : "🤍"
                    }
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

                    <span className="estrellas">
                        ★★★★
                    </span>

                    <span className="numero-valoracion">
                        {producto.valoracion}
                    </span>

                </div>


                <p className="descripcion-producto">
                    {producto.descripcion}
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

                    {sinStock
                        ? "Sin stock disponible"
                        : stockBajo
                            ? `Últimas ${stockDisponible} unidades disponibles`
                            : `Stock disponible: ${stockDisponible}`
                    }

                </div>


                <div className="pie-producto">

                    <span className="precio-producto">
                        ${precioFormateado}
                    </span>

                </div>


                <div className="acciones-producto-menu">


                    <div className="selector-cantidad-producto">

                        <button
                            type="button"
                            onClick={disminuirCantidad}
                            disabled={
                                cantidad <= 1 ||
                                sinStock
                            }
                        >
                            −
                        </button>


                        <span>
                            {sinStock
                                ? 0
                                : cantidad
                            }
                        </span>


                        <button
                            type="button"
                            onClick={aumentarCantidad}
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
                        title={
                            sinStock
                                ? "Producto sin stock disponible"
                                : !onAgregar
                                    ? "No disponible para esta cuenta"
                                    : undefined
                        }
                        onClick={
                            agregarProducto
                        }
                    >
                        {sinStock
                            ? "SIN STOCK"
                            : "AGREGAR"
                        }
                    </button>

                </div>

            </div>

        </article>
    );
}


export default ProductoCard;