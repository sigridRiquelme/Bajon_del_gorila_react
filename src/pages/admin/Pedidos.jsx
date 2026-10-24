import {
    useState
} from "react";

import "../../styles/pedidos.css";

import PedidoFila from "../../components/admin/PedidoFila.jsx";

import {
    obtenerPedidos,
    obtenerPedidoPorCodigo
} from "../../data/pedidos.js";

import {
    obtenerUsuarioPorId
} from "../../data/usuarios.js";


function Pedidos() {

    const [
        listaPedidos
    ] = useState(
        obtenerPedidos()
    );


    const [
        pedidoSeleccionado,
        setPedidoSeleccionado
    ] = useState(null);


    // ABRO EL DETALLE DEL PEDIDO

    const verDetallePedido = (
        codigo
    ) => {

        const pedido =
            obtenerPedidoPorCodigo(
                codigo
            );


        setPedidoSeleccionado(
            pedido
        );
    };


    // OBTENGO EL NOMBRE DEL CLIENTE

    const obtenerNombreCliente = (
        pedido
    ) => {

        if (
            pedido.usuarioId ===
            null
        ) {

            return (
                pedido.cliente ||
                "Invitado"
            );
        }


        const usuario =
            obtenerUsuarioPorId(
                pedido.usuarioId
            );


        return usuario
            ? usuario.nombre
            : pedido.cliente;
    };


    return (

        <main className="pedidos-admin">


            <header className="encabezado-pedidos">

                <div>

                    <h1>
                        PEDIDOS
                    </h1>

                    <p>
                        {
                            listaPedidos.length
                        } pedidos
                    </p>

                </div>

            </header>


            <section className="tabla-pedidos">

                <table>

                    <thead>

                        <tr>

                            <th>
                                CÓDIGO
                            </th>

                            <th>
                                CLIENTE
                            </th>

                            <th>
                                FECHA
                            </th>

                            <th>
                                ENTREGA
                            </th>

                            <th>
                                TOTAL
                            </th>

                            <th>
                                ACCIÓN
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {listaPedidos.length >
                        0 ? (

                            listaPedidos.map(
                                (pedido) => (

                                    <PedidoFila
                                        key={
                                            pedido.codigo
                                        }
                                        codigo={
                                            pedido.codigo
                                        }
                                        cliente={
                                            obtenerNombreCliente(
                                                pedido
                                            )
                                        }
                                        fecha={
                                            pedido.fecha
                                        }
                                        entrega={
                                            pedido.tipoEntrega ||
                                            "No registrada"
                                        }
                                        total={
                                            pedido.total
                                        }
                                        onVerDetalle={
                                            verDetallePedido
                                        }
                                    />

                                )
                            )

                        ) : (

                            <tr>

                                <td colSpan="6">
                                    No hay pedidos registrados.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </section>


            {pedidoSeleccionado && (() => {


                // CALCULO DATOS ANTIGUOS SI NO LOS TIENEN

                const netoPedido =
                    pedidoSeleccionado.neto ??
                    Math.round(
                        pedidoSeleccionado.total /
                        1.19
                    );


                const ivaPedido =
                    pedidoSeleccionado.iva ??
                    (
                        pedidoSeleccionado.total -
                        netoPedido
                    );


                const subtotalPedido =
                    pedidoSeleccionado.subtotal ??
                    (
                        pedidoSeleccionado.total -
                        (
                            pedidoSeleccionado.costoDelivery ||
                            0
                        )
                    );


                const costoDelivery =
                    pedidoSeleccionado.costoDelivery ||
                    0;


                return (

                    <div className="modal-pedido-fondo">


                        <div className="detalle-pedido">


                            <div className="encabezado-boleta">

                                <div>

                                    <span className="etiqueta-boleta">
                                        BOLETA
                                    </span>


                                    <h2>
                                        Pedido #
                                        {
                                            pedidoSeleccionado.codigo
                                        }
                                    </h2>

                                </div>

                            </div>


                            <div className="datos-pedido">


                                <div>

                                    <span>
                                        Cliente
                                    </span>

                                    <strong>
                                        {
                                            obtenerNombreCliente(
                                                pedidoSeleccionado
                                            )
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Tipo de cliente
                                    </span>

                                    <strong>
                                        {
                                            pedidoSeleccionado.usuarioId ===
                                            null
                                                ? "Invitado"
                                                : "Registrado"
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Fecha
                                    </span>

                                    <strong>
                                        {
                                            pedidoSeleccionado.fecha
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Hora
                                    </span>

                                    <strong>
                                        {
                                            pedidoSeleccionado.hora ||
                                            "No registrada"
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Medio de pago
                                    </span>

                                    <strong>
                                        {
                                            pedidoSeleccionado.medioPago ||
                                            "No registrado"
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Tipo de entrega
                                    </span>

                                    <strong>
                                        {
                                            pedidoSeleccionado.tipoEntrega ||
                                            "No registrada"
                                        }
                                    </strong>

                                </div>


                                {pedidoSeleccionado.tipoEntrega ===
                                "Delivery" && (

                                    <>

                                        <div>

                                            <span>
                                                Dirección
                                            </span>

                                            <strong>
                                                {
                                                    pedidoSeleccionado.direccion ||
                                                    "No registrada"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Comuna
                                            </span>

                                            <strong>
                                                {
                                                    pedidoSeleccionado.comuna ||
                                                    "No registrada"
                                                }
                                            </strong>

                                        </div>


                                        {pedidoSeleccionado.referencia && (

                                            <div>

                                                <span>
                                                    Referencia
                                                </span>

                                                <strong>
                                                    {
                                                        pedidoSeleccionado.referencia
                                                    }
                                                </strong>

                                            </div>

                                        )}

                                    </>

                                )}


                                {pedidoSeleccionado.tipoEntrega ===
                                "Retiro en local" && (

                                    <div>

                                        <span>
                                            Entrega
                                        </span>

                                        <strong>
                                            Retiro en local
                                        </strong>

                                    </div>

                                )}


                                {pedidoSeleccionado.correo && (

                                    <div>

                                        <span>
                                            Correo
                                        </span>

                                        <strong>
                                            {
                                                pedidoSeleccionado.correo
                                            }
                                        </strong>

                                    </div>

                                )}


                                {pedidoSeleccionado.telefono && (

                                    <div>

                                        <span>
                                            Teléfono
                                        </span>

                                        <strong>
                                            {
                                                pedidoSeleccionado.telefono
                                            }
                                        </strong>

                                    </div>

                                )}

                            </div>


                            <h3>
                                Detalle de compra
                            </h3>


                            <div className="detalle-productos">

                                {pedidoSeleccionado.productos.map(
                                    (
                                        producto,
                                        index
                                    ) => (

                                        <div
                                            className="producto-pedido"
                                            key={
                                                `${pedidoSeleccionado.codigo}-${index}`
                                            }
                                        >

                                            <div className="producto-info">

                                                <span className="producto-nombre">
                                                    {
                                                        producto.nombre
                                                    }
                                                </span>


                                                <span className="producto-cantidad">

                                                    $
                                                    {
                                                        producto.precio.toLocaleString(
                                                            "es-CL"
                                                        )
                                                    }

                                                    {" × "}

                                                    {
                                                        producto.cantidad
                                                    }

                                                </span>

                                            </div>


                                            <span className="producto-precio">

                                                $

                                                {
                                                    (
                                                        producto.precio *
                                                        producto.cantidad
                                                    ).toLocaleString(
                                                        "es-CL"
                                                    )
                                                }

                                            </span>

                                        </div>

                                    )
                                )}

                            </div>


                            <div className="resumen-boleta">


                                <div className="fila-resumen">

                                    <span>
                                        Subtotal
                                    </span>

                                    <span>

                                        $

                                        {
                                            subtotalPedido.toLocaleString(
                                                "es-CL"
                                            )
                                        }

                                    </span>

                                </div>


                                {pedidoSeleccionado.tipoEntrega ===
                                "Delivery" && (

                                    <div className="fila-resumen">

                                        <span>
                                            Delivery
                                        </span>

                                        <span>

                                            $

                                            {
                                                costoDelivery.toLocaleString(
                                                    "es-CL"
                                                )
                                            }

                                        </span>

                                    </div>

                                )}


                                {pedidoSeleccionado.tipoEntrega ===
                                "Retiro en local" && (

                                    <div className="fila-resumen">

                                        <span>
                                            Entrega
                                        </span>

                                        <span>
                                            Retiro en local
                                        </span>

                                    </div>

                                )}


                                <div className="fila-resumen">

                                    <span>
                                        Neto
                                    </span>

                                    <span>

                                        $

                                        {
                                            netoPedido.toLocaleString(
                                                "es-CL"
                                            )
                                        }

                                    </span>

                                </div>


                                <div className="fila-resumen iva-boleta">

                                    <span>
                                        IVA 19%
                                    </span>

                                    <span>

                                        $

                                        {
                                            ivaPedido.toLocaleString(
                                                "es-CL"
                                            )
                                        }

                                    </span>

                                </div>


                                <div className="fila-resumen total-pedido">

                                    <span>
                                        Total
                                    </span>

                                    <span>

                                        $

                                        {
                                            pedidoSeleccionado.total.toLocaleString(
                                                "es-CL"
                                            )
                                        }

                                    </span>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="btn-cerrar-pedido"
                                onClick={() =>
                                    setPedidoSeleccionado(
                                        null
                                    )
                                }
                            >
                                Cerrar
                            </button>


                        </div>

                    </div>

                );
            })()}

        </main>
    );
}


export default Pedidos;