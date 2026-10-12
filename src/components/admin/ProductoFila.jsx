export default function ProductoFila({
    codigo,
    nombre,
    categoria,
    precio,
    stock,
    estado,
    imagen,
    onEliminar,
    onEditar
}) {
    return (
        <tr>
            <td>
                <img
                    src={imagen}
                    alt={nombre}
                    width="60"
                />
            </td>

            <td>{nombre}</td>

            <td>{categoria}</td>

            <td>${precio.toLocaleString("es-CL")}</td>

            <td>{stock}</td>

            <td>
                <span
                    className={`estado-producto ${estado === "Disponible"
                            ? "estado-disponible"
                            : estado === "Sin stock"
                                ? "estado-sin-stock"
                                : "estado-oculto"
                        }`}
                >
                    {estado}
                </span>
            </td>

            <td>
                <div className="acciones-producto">
                    <button
                        className="btn-editar"
                        onClick={() =>
                            onEditar({
                                codigo,
                                nombre,
                                categoria,
                                precio,
                                stock,
                                estado,
                                imagen
                            })
                        }
                    >
                        Editar
                    </button>

                    <button
                        className="btn-eliminar"
                        onClick={() => onEliminar(codigo)}
                    >
                        Eliminar
                    </button>
                </div>
            </td>
        </tr>
    );
}