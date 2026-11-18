import api from "./api.js";


const transformarPedidoCliente = (
    elemento
) => {

    const pedido =
        elemento.pedido;


    const detalles =
        elemento.detalles || [];


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
            pedido.tipoEntrega,

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
            detalles.map(
                (detalle) => ({

                    codigoProducto:
                        detalle.producto
                            ?.idProducto,

                    nombre:
                        detalle.nombreProducto,

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
            )
    };
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