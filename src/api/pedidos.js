import api from "./api.js";


const transformarTipoEntrega = (
    tipoEntrega
) => {

    if (
        tipoEntrega ===
        "DELIVERY"
    ) {

        return "Delivery";
    }


    if (
        tipoEntrega ===
        "RETIRO"
    ) {

        return "Retiro en local";
    }


    return tipoEntrega;
};


const transformarDetalles = (
    detalles
) => {

    return detalles.map(
        (detalle) => ({

            codigoProducto:
                detalle.producto
                    ?.idProducto ??
                null,

            nombre:
                detalle.nombreProducto,

            categoria:
                detalle.producto
                    ?.categoria
                    ?.nombre ||
                "Sin categoría",

            cantidad:
                detalle.cantidad,

            precio:
                detalle.precioUnitario,

            subtotal:
                detalle.subtotal,

            imagen:
                detalle.producto
                    ?.imagen ||
                ""
        })
    );
};


const transformarPedido = (
    pedido,
    detalles = []
) => {

    return {

        codigo:
            pedido.idPedido,

        usuarioId:
            pedido.usuario
                ?.idUsuario ??
            null,

        cliente:
            pedido.cliente,

        correo:
            pedido.correo,

        telefono:
            pedido.telefono,

        fecha:
            pedido.fecha,

        hora:
            pedido.hora,

        tipoEntrega:
            transformarTipoEntrega(
                pedido.tipoEntrega
            ),

        direccion:
            pedido.direccion,

        comuna:
            pedido.comuna,

        referencia:
            pedido.referencia,

        medioPago:
            pedido.medioPago,

        subtotal:
            pedido.subtotal,

        costoDelivery:
            pedido.costoDelivery,

        neto:
            pedido.neto,

        iva:
            pedido.iva,

        total:
            pedido.total,

        productos:
            transformarDetalles(
                detalles
            )
    };
};


const transformarPedidoCliente = (
    elemento
) => {

    return transformarPedido(
        elemento.pedido,
        elemento.detalles || []
    );
};


export const obtenerMisPedidosApi = async () => {

    const respuesta =
        await api.get(
            "/pedidos/mis-pedidos"
        );


    return respuesta.data.map(
        transformarPedidoCliente
    );
};


export const obtenerPedidosApi = async () => {

    const respuesta =
        await api.get(
            "/pedidos"
        );


    return respuesta.data.map(
        (pedido) =>
            transformarPedido(
                pedido
            )
    );
};


export const obtenerDetallePedidoApi = async (
    idPedido
) => {

    const [
        respuestaPedido,
        respuestaDetalles
    ] =
        await Promise.all([

            api.get(
                `/pedidos/${idPedido}`
            ),

            api.get(
                `/pedidos/${idPedido}/detalles`
            )
        ]);


    return transformarPedido(
        respuestaPedido.data,
        respuestaDetalles.data
    );
};


export const obtenerPedidosConDetallesApi = async () => {

    const pedidos =
        await obtenerPedidosApi();


    const pedidosCompletos =
        await Promise.all(

            pedidos.map(
                async (
                    pedido
                ) => {

                    const respuestaDetalles =
                        await api.get(
                            `/pedidos/${pedido.codigo}/detalles`
                        );


                    return transformarPedido(
                        {
                            idPedido:
                                pedido.codigo,

                            usuario:
                                pedido.usuarioId !==
                                null
                                    ? {
                                        idUsuario:
                                            pedido.usuarioId
                                    }
                                    : null,

                            cliente:
                                pedido.cliente,

                            correo:
                                pedido.correo,

                            telefono:
                                pedido.telefono,

                            fecha:
                                pedido.fecha,

                            hora:
                                pedido.hora,

                            tipoEntrega:
                                pedido.tipoEntrega ===
                                "Delivery"
                                    ? "DELIVERY"
                                    : "RETIRO",

                            direccion:
                                pedido.direccion,

                            comuna:
                                pedido.comuna,

                            referencia:
                                pedido.referencia,

                            medioPago:
                                pedido.medioPago,

                            subtotal:
                                pedido.subtotal,

                            costoDelivery:
                                pedido.costoDelivery,

                            neto:
                                pedido.neto,

                            iva:
                                pedido.iva,

                            total:
                                pedido.total
                        },
                        respuestaDetalles.data
                    );
                }
            )
        );


    return pedidosCompletos;
};


export const crearPedidoApi = async (
    datosPedido,
    carrito
) => {

    const tipoEntregaBackend =
        datosPedido.tipoEntrega ===
        "Delivery"
            ? "DELIVERY"
            : "RETIRO";


    const cuerpo = {

        pedido: {

            cliente:
                datosPedido.cliente,

            correo:
                datosPedido.correo,

            telefono:
                datosPedido.telefono,

            fecha:
                datosPedido.fecha,

            hora:
                datosPedido.hora,

            tipoEntrega:
                tipoEntregaBackend,

            direccion:
                datosPedido.tipoEntrega ===
                "Delivery"
                    ? datosPedido.direccion
                    : "Retiro en local",

            comuna:
                datosPedido.tipoEntrega ===
                "Delivery"
                    ? datosPedido.comuna
                    : "",

            referencia:
                datosPedido.tipoEntrega ===
                "Delivery"
                    ? datosPedido.referencia
                    : "",

            medioPago:
                datosPedido.medioPago
        },


        detalles:
            carrito.map(
                (item) => ({

                    producto: {
                        idProducto:
                            item.codigo
                    },

                    cantidad:
                        item.cantidad
                })
            )
    };


    const respuesta =
        await api.post(
            "/pedidos",
            cuerpo
        );


    return respuesta.data;
};