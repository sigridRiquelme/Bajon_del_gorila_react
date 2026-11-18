function UsuarioFila({
    id,
    nombre,
    correo,
    telefono,
    direccion,
    rol,
    administradorPrincipal,
    esUsuarioActual,
    onVer,
    onEditarRol,
    onEliminar
}) {

    return (

        <tr>

            <td>
                #{id}
            </td>


            <td>

                {nombre}

                {administradorPrincipal && (
                    <strong>
                        {" "}Principal
                    </strong>
                )}

            </td>


            <td>
                {correo}
            </td>


            <td>
                {telefono || "Sin teléfono"}
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


                {!administradorPrincipal &&
                !esUsuarioActual && (

                    <button
                        type="button"
                        className="btn-editar"
                        onClick={() =>
                            onEditarRol(
                                id
                            )
                        }
                    >
                        Cambiar rol
                    </button>

                )}


                {!administradorPrincipal &&
                !esUsuarioActual && (

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