function UsuarioFila({
    id,
    nombre,
    correo,
    telefono,
    direccion,
    rol,
    onVer,
    onEditar,
    onEliminar
}) {

    return (

        <tr>

            <td>
                #{id}
            </td>


            <td>
                {nombre}
            </td>


            <td>
                {correo}
            </td>


            <td>
                {telefono}
            </td>


            <td>
                {direccion || "Sin dirección"}
            </td>


            <td>

                <span className="usuario-rol">
                    {rol}
                </span>

            </td>


            <td className="acciones-usuario">

                <button
                    type="button"
                    className="btn-ver-usuario"
                    onClick={() =>
                        onVer(
                            id
                        )
                    }
                >
                    Ver
                </button>


                <button
                    type="button"
                    className="btn-editar"
                    onClick={() =>
                        onEditar(
                            id
                        )
                    }
                >
                    Editar
                </button>


                {rol !==
                "Administrador" && (

                    <button
                        type="button"
                        className="btn-eliminar"
                        onClick={() =>
                            onEliminar(
                                id
                            )
                        }
                    >
                        Eliminar
                    </button>

                )}

            </td>

        </tr>
    );
}


export default UsuarioFila;