import {
    Link,
    Navigate
} from "react-router-dom";

import "../../styles/checkout.css";


function CompraExitosa() {

    // OBTENGO LA ULTIMA COMPRA

    const compraGuardada =
        sessionStorage.getItem(
            "ultimaCompra"
        );


    if (
        !compraGuardada
    ) {

        return (
            <Navigate
                to="/menu"
                replace
            />
        );
    }


    const compra =
        JSON.parse(
            compraGuardada
        );


    // REVISO SI LA COMPRA FUE COMO INVITADO

    const compraFueInvitado =
        sessionStorage.getItem(
            "compraFueInvitado"
        ) === "true";


    return (

        <main className="pagina-checkout">

            <div className="checkout-contenedor">


                <section className="pasos-checkout">

                    <div className="paso completado">

                        <span className="numero-paso">
                            ✓
                        </span>

                        <span>
                            Carrito
                        </span>

                    </div>


                    <div className="linea-paso completada"></div>


                    <div className="paso completado">

                        <span className="numero-paso">
                            ✓
                        </span>

                        <span>
                            Entrega y pago
                        </span>

                    </div>


                    <div className="linea-paso completada"></div>


                    <div className="paso activo">

                        <span className="numero-paso">
                            3
                        </span>

                        <span>
                            Confirmación
                        </span>

                    </div>

                </section>


                <section className="compra-exitosa-card">


                    <div className="compra-exitosa-icono">
                        ✓
                    </div>


                    <p className="checkout-antetitulo">
                        PEDIDO RECIBIDO
                    </p>


                    <h1>
                        ¡TU PEDIDO FUE CONFIRMADO!
                    </h1>


                    <p className="compra-exitosa-mensaje">
                        Hemos recibido tu pedido correctamente.
                        Ahora comenzaremos a prepararlo.
                    </p>


                    <div className="compra-datos-principales">


                        <div>

                            <span>
                                Número de pedido
                            </span>

                            <strong>
                                #
                                {
                                    compra.codigo
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Fecha
                            </span>

                            <strong>
                                {
                                    compra.fecha
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Hora
                            </span>

                            <strong>
                                {
                                    compra.hora
                                }
                            </strong>

                        </div>

                    </div>


                    <div className="compra-detalle">


                        <h2>
                            DETALLE DEL PEDIDO
                        </h2>


                        <div className="compra-productos">

                            {compra.productos.map(
                                (producto) => (

                                    <div
                                        key={
                                            producto.codigoProducto
                                        }
                                        className="compra-producto"
                                    >

                                        <div className="compra-producto-info">

                                            {producto.imagen && (

                                                <img
                                                    src={
                                                        producto.imagen
                                                    }
                                                    alt={
                                                        producto.nombre
                                                    }
                                                />

                                            )}


                                            <div>

                                                <strong>
                                                    {
                                                        producto.nombre
                                                    }
                                                </strong>

                                                <span>
                                                    Cantidad: {
                                                        producto.cantidad
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        <strong>

                                            $
                                            {
                                                (
                                                    producto.precio *
                                                    producto.cantidad
                                                ).toLocaleString(
                                                    "es-CL"
                                                )
                                            }

                                        </strong>

                                    </div>

                                )
                            )}

                        </div>


                        <div className="compra-resumen-fila">

                            <span>
                                Subtotal
                            </span>

                            <strong>

                                $
                                {
                                    compra.subtotal.toLocaleString(
                                        "es-CL"
                                    )
                                }

                            </strong>

                        </div>


                        {/* SI ES DELIVERY MUESTRO EL COSTO */}

                        {compra.tipoEntrega ===
                        "Delivery" && (

                            <div className="compra-resumen-fila">

                                <span>
                                    Delivery
                                </span>

                                <strong>

                                    $
                                    {
                                        compra.costoDelivery.toLocaleString(
                                            "es-CL"
                                        )
                                    }

                                </strong>

                            </div>

                        )}


                        {/* SI ES RETIRO LO INDICO */}

                        {compra.tipoEntrega ===
                        "Retiro en local" && (

                            <div className="compra-resumen-fila">

                                <span>
                                    Tipo de entrega
                                </span>

                                <strong>
                                    Retiro en local
                                </strong>

                            </div>

                        )}


                        <div className="compra-resumen-fila">

                            <span>
                                Neto
                            </span>

                            <span>

                                $
                                {
                                    compra.neto.toLocaleString(
                                        "es-CL"
                                    )
                                }

                            </span>

                        </div>


                        <div className="compra-resumen-fila">

                            <span>
                                IVA 19%
                            </span>

                            <span>

                                $
                                {
                                    compra.iva.toLocaleString(
                                        "es-CL"
                                    )
                                }

                            </span>

                        </div>


                        <div className="compra-total">

                            <span>
                                TOTAL
                            </span>

                            <strong>

                                $
                                {
                                    compra.total.toLocaleString(
                                        "es-CL"
                                    )
                                }

                            </strong>

                        </div>

                    </div>


                    <div className="compra-informacion">


                        <div>

                            <span>
                                Cliente
                            </span>

                            <strong>
                                {
                                    compra.cliente
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Medio de pago
                            </span>

                            <strong>
                                {
                                    compra.medioPago
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Tipo de entrega
                            </span>

                            <strong>
                                {
                                    compra.tipoEntrega
                                }
                            </strong>

                        </div>


                        {compra.tipoEntrega ===
                        "Delivery" && (

                            <>

                                <div>

                                    <span>
                                        Dirección
                                    </span>

                                    <strong>
                                        {
                                            compra.direccion
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Comuna
                                    </span>

                                    <strong>
                                        {
                                            compra.comuna
                                        }
                                    </strong>

                                </div>

                            </>

                        )}

                    </div>


                    <div className="compra-aviso">

                        <span>
                            🦍
                        </span>


                        <p>

                            {compraFueInvitado
                                ? "Tu pedido fue registrado correctamente."
                                : "Tu pedido fue registrado correctamente. Puedes revisar esta boleta desde tu perfil."
                            }

                        </p>

                    </div>


                    <div className="compra-acciones">


                        {/* CLIENTE REGISTRADO */}

                        {!compraFueInvitado && (

                            <Link
                                to="/perfil"
                                className="btn-compra-principal"
                            >
                                VER MIS BOLETAS
                            </Link>

                        )}


                        {/* INVITADO */}

                        {compraFueInvitado && (

                            <Link
                                to="/"
                                className="btn-compra-principal"
                            >
                                VOLVER AL INICIO
                            </Link>

                        )}


                        <Link
                            to="/menu"
                            className="btn-compra-secundario"
                        >
                            VOLVER AL MENÚ
                        </Link>

                    </div>


                </section>

            </div>

        </main>
    );
}


export default CompraExitosa;