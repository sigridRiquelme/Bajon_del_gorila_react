import api from "./api.js";


const transformarCategoria = (
    categoria
) => {

    return {

        id:
            categoria.idCategoria,

        nombre:
            categoria.nombre
    };
};


export const obtenerCategoriasApi = async () => {

    const respuesta =
        await api.get(
            "/categorias"
        );


    return respuesta.data.map(
        transformarCategoria
    );
};


export const crearCategoriaApi = async (
    nombre
) => {

    const respuesta =
        await api.post(
            "/categorias",
            {
                nombre:
                    nombre.trim()
            }
        );


    return transformarCategoria(
        respuesta.data
    );
};


export const eliminarCategoriaApi = async (
    idCategoria
) => {

    await api.delete(
        `/categorias/${idCategoria}`
    );
};