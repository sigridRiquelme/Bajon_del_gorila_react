import api from "./api.js";


export const iniciarSesionApi = async (
    correo,
    password
) => {

    const respuesta =
        await api.post(
            "/auth/login",
            {
                correo,
                password
            }
        );


    return respuesta.data;
};


export const registrarUsuarioApi = async (
    datos
) => {

    const respuesta =
        await api.post(
            "/auth/register",
            datos
        );


    return respuesta.data;
};


export const obtenerMiPerfilApi = async () => {

    const respuesta =
        await api.get(
            "/usuarios/me"
        );


    return respuesta.data;
};


export const actualizarMiPerfilApi = async (
    datos
) => {

    const respuesta =
        await api.put(
            "/usuarios/me",
            datos
        );


    return respuesta.data;
};