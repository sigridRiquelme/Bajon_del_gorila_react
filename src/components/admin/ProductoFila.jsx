export default function ProductoFila({
    codigo,
    nombre,
    categoria,
    categoriaId,
    descripcion,
    precio,
    stock,
    promocion,
    descuento,
    estado,
    imagen,
    imagenBackend,
    onEliminar,
    onEditar,
    puedeEditar
}) {

    return (

        <tr>


            <td>

                <img
                    src={
                        imagen ||
                        "/img/logo-bajon-2.png"
                    }
                    alt={
                        nombre
                    }
                    width="60"
                />

            </td>


            <td>
                {
                    nombre
                }
            </td>


            <td>
                {
                    categoria
                }
            </td>


            <td className="descripcion-tabla-producto">

                {
                    descripcion
                }

            </td>


            <td>

                $
                {
                    precio.toLocaleString(
                        "es-CL"
                    )
                }

            </td>


            <td>
                {
                    stock
                }
            </td>


            <td>

                {promocion ? (

                    <span className="producto-promo-activa">

                        {
                            descuento
                        }% OFF

                    </span>

                ) : (

                    <span className="producto-sin-promo">

                        Sin promoción

                    </span>

                )}

            </td>


            <td>

                <span
                    className={`estado-producto ${
                        estado ===
                        "Disponible"

                            ? "estado-disponible"

                            : estado ===
                                "Sin stock"

                                ? "estado-sin-stock"

                                : "estado-oculto"
                    }`}
                >

                    {
                        estado
                    }

                </span>

            </td>


            <td>

                {puedeEditar ? (

                    <div className="acciones-producto">


                        <button
                            type="button"
                            className="btn-editar"
                            onClick={() =>
                                onEditar({

                                    codigo,
                                    nombre,
                                    categoria,
                                    categoriaId,
                                    descripcion,
                                    precio,
                                    stock,
                                    promocion,
                                    descuento,
                                    estado,
                                    imagen,
                                    imagenBackend
                                })
                            }
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            className="btn-eliminar"
                            onClick={() =>
                                onEliminar(
                                    codigo
                                )
                            }
                        >
                            Eliminar
                        </button>


                    </div>

                ) : (

                    <span>
                        Solo lectura
                    </span>

                )}

            </td>


        </tr>
    );
}