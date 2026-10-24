import { useState } from "react";
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

    const [listaPedidos] = useState(obtenerPedidos());
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);


    const verDetallePedido = (codigo) => {
        const pedido = obtenerPedidoPorCodigo(codigo);
        setPedidoSeleccionado(pedido);
    };


    const calcularNeto = (total) => {
        return total / 1.19;
    };


    const calcularIva = (total) => {
        const neto = calcularNeto(total);
        return total - neto;
    };

    const obtenerNombreCliente = (pedido) => {

        const usuario =
            obtenerUsuarioPorId(pedido.usuarioId);

        return usuario
            ? usuario.nombre
            : pedido.cliente;
    };


    return (
        <main className="pedidos-admin">

            <header className="encabezado-pedidos">
                <div>
                    <h1>PEDIDOS</h1>
                    <p>{listaPedidos.length} pedidos</p>
                </div>
            </header>


            {/* TABLA DE PEDIDOS */}

            <section className="tabla-pedidos">

                <table>

                    <thead>
                        <tr>
                            <th>CÓDIGO</th>
                            <th>CLIENTE</th>
                            <th>FECHA</th>
                            <th>TOTAL</th>
                            <th>ACCIÓN</th>
                        </tr>
                    </thead>


                    <tbody>

                        {listaPedidos.length > 0 ? (

                            listaPedidos.map((pedido) => (

                                <PedidoFila
                                    key={pedido.codigo}
                                    codigo={pedido.codigo}
                                    cliente={obtenerNombreCliente(pedido)}
                                    fecha={pedido.fecha}
                                    total={pedido.total}
                                    onVerDetalle={verDetallePedido}
                                />

                            ))

                        ) : (

                            <tr>
                                <td colSpan="5">
                                    No hay pedidos registrados.
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </section>


            {/* MODAL BOLETA */}

            {pedidoSeleccionado && (

                <div className="modal-pedido-fondo">

                    <div className="detalle-pedido">

                        <div className="encabezado-boleta">

                            <div>

                                <span className="etiqueta-boleta">
                                    BOLETA
                                </span>

                                <h2>
                                    Pedido #{pedidoSeleccionado.codigo}
                                </h2>

                            </div>

                        </div>


                        {/* DATOS DEL CLIENTE */}

                        <div className="datos-pedido">

                            <p>
                                <strong>Cliente:</strong>{" "}
                                {obtenerNombreCliente(pedidoSeleccionado)}
                            </p>

                            <p>
                                <strong>Fecha:</strong>{" "}
                                {pedidoSeleccionado.fecha}
                            </p>

                        </div>


                        {/* DETALLE PRODUCTOS */}

                        <h3>Detalle de compra</h3>


                        <div className="detalle-productos">

                            {pedidoSeleccionado.productos.map((producto) => (

                                <div
                                    className="producto-pedido"
                                    key={producto.codigoProducto}
                                >

                                    <div className="producto-info">

                                        <span className="producto-nombre">
                                            {producto.nombre}
                                        </span>

                                        <span className="producto-cantidad">

                                            $
                                            {producto.precio.toLocaleString(
                                                "es-CL"
                                            )}

                                            {" x "}

                                            {producto.cantidad}

                                        </span>

                                    </div>


                                    <span className="producto-precio">

                                        $

                                        {(
                                            producto.precio *
                                            producto.cantidad
                                        ).toLocaleString("es-CL")}

                                    </span>

                                </div>

                            ))}

                        </div>


                        {/* RESUMEN BOLETA */}

                        <div className="resumen-boleta">

                            <div className="fila-resumen">

                                <span>Neto</span>

                                <span>
                                    $
                                    {calcularNeto(
                                        pedidoSeleccionado.total
                                    ).toLocaleString("es-CL", {
                                        maximumFractionDigits: 0
                                    })}
                                </span>

                            </div>


                            <div className="fila-resumen iva-boleta">

                                <span>
                                    IVA de esta boleta
                                </span>

                                <span>
                                    $
                                    {calcularIva(
                                        pedidoSeleccionado.total
                                    ).toLocaleString("es-CL", {
                                        maximumFractionDigits: 0
                                    })}
                                </span>

                            </div>


                            <div className="fila-resumen total-pedido">

                                <span>Total</span>

                                <span>
                                    $
                                    {pedidoSeleccionado.total.toLocaleString(
                                        "es-CL"
                                    )}
                                </span>

                            </div>

                        </div>


                        {/* BOTÓN CERRAR */}

                        <button
                            className="btn-cerrar-pedido"
                            onClick={() =>
                                setPedidoSeleccionado(null)
                            }
                        >
                            Cerrar
                        </button>


                    </div>

                </div>

            )}

        </main>
    );
}


export default Pedidos;