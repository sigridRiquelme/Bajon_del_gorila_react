import {
    Link
} from "react-router-dom";

import "../../styles/checkout.css";


function CompraError() {

    const mensajeError =
        sessionStorage.getItem(
            "compraError"
        ) ||
        "Ocurrió un problema al procesar tu pedido.";


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


                    <div className="linea-paso"></div>


                    <div className="paso activo error">

                        <span className="numero-paso">
                            !
                        </span>

                        <span>
                            Confirmación
                        </span>

                    </div>

                </section>


                <section className="compra-error-card">


                    <div className="compra-error-icono">
                        !
                    </div>


                    <p className="checkout-antetitulo">
                        PEDIDO NO REALIZADO
                    </p>


                    <h1>
                        NO PUDIMOS PROCESAR TU PEDIDO
                    </h1>


                    <p className="compra-error-mensaje">
                        {
                            mensajeError
                        }
                    </p>


                    <div className="compra-error-aviso">

                        <span>
                            🛒
                        </span>


                        <div>

                            <strong>
                                Tu carrito sigue guardado
                            </strong>


                            <p>
                                No eliminamos tus productos para que puedas revisar el pedido e intentarlo nuevamente.
                            </p>

                        </div>

                    </div>


                    <div className="compra-acciones">

                        <Link
                            to="/checkout"
                            className="btn-compra-principal"
                        >
                            VOLVER A INTENTAR
                        </Link>


                        <Link
                            to="/carrito"
                            className="btn-compra-secundario"
                        >
                            VOLVER AL CARRITO
                        </Link>

                    </div>

                </section>

            </div>

        </main>
    );
}


export default CompraError;