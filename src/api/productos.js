import api from "./api.js";


const transformarEstado = (
    estado
) => {

    if (
        estado === "INACTIVO"
    ) {

        return "Oculto";
    }


    if (
        estado === "SIN STOCK"
    ) {

        return "Sin stock";
    }


    return "Disponible";
};


const transformarEstadoBackend = (
    estado
) => {

    if (
        estado === "Oculto"
    ) {

        return "INACTIVO";
    }


    if (
        estado === "Sin stock"
    ) {

        return "SIN STOCK";
    }


    return "ACTIVO";
};


export const transformarProducto = (
    producto
) => {

    return {

        codigo:
            producto.idProducto,

        nombre:
            producto.nombre,

        categoria:
            producto.categoria
                ?.nombre ||
            "Sin categoría",

        categoriaId:
            producto.categoria
                ?.idCategoria ||
            null,

        descripcion:
            producto.descripcion ||
            "",

        precio:
            producto.precio,

        stock:
            producto.stock,

        estado:
            transformarEstado(
                producto.estado
            ),

        estadoBackend:
            producto.estado,

        imagen:
            producto.imagen ||
            "/img/logo-bajon-2.png",

        imagenBackend:
            producto.imagen ||
            "",

        promocion:
            producto.promocion ??
            false,

        descuento:
            producto.descuento ??
            0,

        valoracion:
            4.8
    };
};


const transformarParaBackend = (
    producto
) => {

    return {

        categoria: {
            idCategoria:
                Number(
                    producto.categoriaId
                )
        },

        nombre:
            producto.nombre,

        descripcion:
            producto.descripcion,

        precio:
            Number(
                producto.precio
            ),

        stock:
            Number(
                producto.stock
            ),

        estado:
            transformarEstadoBackend(
                producto.estado
            ),

        imagen:
            producto.imagen ||
            null,

        promocion:
            Boolean(
                producto.promocion
            ),

        descuento:
            producto.promocion
                ? Number(
                    producto.descuento
                )
                : 0
    };
};


export const obtenerPrecioFinal = (
    producto
) => {

    if (
        !producto.promocion ||
        !producto.descuento
    ) {

        return producto.precio;
    }


    const descuento =
        producto.precio *
        (
            producto.descuento /
            100
        );


    return Math.round(
        producto.precio -
        descuento
    );
};


export const obtenerProductosApi = async () => {

    const respuesta =
        await api.get(
            "/productos"
        );


    return respuesta.data.map(
        transformarProducto
    );
};


export const obtenerProductoPorIdApi = async (
    idProducto
) => {

    const respuesta =
        await api.get(
            `/productos/${idProducto}`
        );


    return transformarProducto(
        respuesta.data
    );
};


export const crearProductoApi = async (
    producto
) => {

    const respuesta =
        await api.post(
            "/productos",
            transformarParaBackend(
                producto
            )
        );


    return transformarProducto(
        respuesta.data
    );
};


export const actualizarProductoApi = async (
    idProducto,
    producto
) => {

    const respuesta =
        await api.put(
            `/productos/${idProducto}`,
            transformarParaBackend(
                producto
            )
        );


    return transformarProducto(
        respuesta.data
    );
};


export const eliminarProductoApi = async (
    idProducto
) => {

    await api.delete(
        `/productos/${idProducto}`
    );
};