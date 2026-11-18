import api from "./api.js";


const transformarRol = (
    rol
) => {

    if (
        rol === "ADMINISTRADOR"
    ) {

        return "Administrador";
    }


    if (
        rol === "VENDEDOR"
    ) {

        return "Vendedor";
    }


    return "Cliente";
};


const transformarRolBackend = (
    rol
) => {

    if (
        rol === "Administrador"
    ) {

        return "ADMINISTRADOR";
    }


    if (
        rol === "Vendedor"
    ) {

        return "VENDEDOR";
    }


    return "CLIENTE";
};


const transformarUsuario = (
    usuario
) => {

    return {

        id:
            usuario.idUsuario,

        nombre:
            usuario.nombre,

        correo:
            usuario.correo,

        telefono:
            usuario.telefono || "",

        direccion:
            usuario.direccion || "",

        rol:
            transformarRol(
                usuario.rol
            ),

        rolBackend:
            usuario.rol,

        administradorPrincipal:
            usuario.administradorPrincipal ??
            false
    };
};


export const obtenerUsuariosApi = async () => {

    const respuesta =
        await api.get(
            "/usuarios"
        );


    return respuesta.data.map(
        transformarUsuario
    );
};


export const obtenerUsuarioPorIdApi = async (
    idUsuario
) => {

    const respuesta =
        await api.get(
            `/usuarios/${idUsuario}`
        );


    return transformarUsuario(
        respuesta.data
    );
};


export const crearUsuarioAdministrativoApi = async (
    datos
) => {

    const respuesta =
        await api.post(
            "/usuarios/administrativos",
            {

                nombre:
                    datos.nombre.trim(),

                correo:
                    datos.correo
                        .trim()
                        .toLowerCase(),

                password:
                    datos.password,

                telefono:
                    datos.telefono.trim(),

                direccion:
                    datos.direccion.trim(),

                rol:
                    transformarRolBackend(
                        datos.rol
                    )
            }
        );


    return transformarUsuario(
        respuesta.data
    );
};


export const cambiarRolUsuarioApi = async (
    idUsuario,
    rol
) => {

    const respuesta =
        await api.patch(
            `/usuarios/${idUsuario}/rol`,
            {
                rol:
                    transformarRolBackend(
                        rol
                    )
            }
        );


    return transformarUsuario(
        respuesta.data
    );
};


export const eliminarUsuarioApi = async (
    idUsuario
) => {

    await api.delete(
        `/usuarios/${idUsuario}`
    );
};