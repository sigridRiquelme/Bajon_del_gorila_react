import {
    useState
} from "react";

import ProductoCard
    from "../components/ProductoCard.jsx";

import {
    obtenerProductos
} from "../data/productos.js";

import {
    obtenerUsuarioPorId
} from "../data/usuarios.js";

import {
    agregarAlCarrito,
    obtenerCarrito
} from "../data/carrito.js";

import "../styles/Menu.css";
import "../styles/promociones.css";
import "../styles/responsive.css";


function Promociones() {

    const [
        carritoActual,
        setCarritoActual
    ] = useState(
        obtenerCarrito()
    );


    const [
        mensajeCarrito,
        setMensajeCarrito
    ] = useState("");


    const [
        hayErrorCarrito,
        setHayErrorCarrito
    ] = useState(false);


    const usuarioActualId =
        localStorage.getItem(
            "usuarioActualId"
        );


    const usuarioActual =
        usuarioActualId !== null
            ? obtenerUsuarioPorId(
                Number(
                    usuarioActualId
                )
            )
            : null;


    const esAdministrador =
        usuarioActual?.rol ===
        "Administrador";


    // OBTENGO SOLO PRODUCTOS CON PROMOCION

    const productosPromocion =
        obtenerProductos()
            .filter(
                (producto) =>
                    producto.promocion ===
                        true &&
                    producto.descuento >
                        0 &&
                    producto.estado !==
                        "Oculto"
            )
            .map(
                (producto) => {

                    const productoEnCarrito =
                        carritoActual.find(
                            (item) =>
                                item.codigo ===
                                producto.codigo
                        );


                    const cantidadEnCarrito =
                        productoEnCarrito
                            ? productoEnCarrito.cantidad
                            : 0;


                    return {

                        ...producto,

                        stockDisponible:
                            Math.max(
                                producto.stock -
                                cantidadEnCarrito,
                                0
                            ),

                        valoracion:
                            producto.valoracion ||
                            4.8
                    };
                }
            );


    // AGREGO EL PRODUCTO AL CARRITO

    const agregarProducto = (
        producto,
        cantidad
    ) => {

        setMensajeCarrito("");
        setHayErrorCarrito(false);


        if (
            esAdministrador
        ) {

            setMensajeCarrito(
                "La cuenta de administrador no puede realizar compras."
            );

            setHayErrorCarrito(
                true
            );

            return;
        }


        if (
            cantidad >
            producto.stockDisponible
        ) {

            setMensajeCarrito(
                `Solo puedes agregar ${producto.stockDisponible} unidades más de ${producto.nombre}.`
            );

            setHayErrorCarrito(
                true
            );

            return;
        }


        for (
            let i = 0;
            i < cantidad;
            i++
        ) {

            agregarAlCarrito(
                producto
            );
        }


        setCarritoActual(
            obtenerCarrito()
        );


        setMensajeCarrito(
            `${cantidad} ${producto.nombre} agregado al carrito.`
        );
    };


    return (

        <>

            <section className="cabecera-pagina cabecera-pagina--degradado cabecera-promociones">

                <div className="contenedor">

                    <p className="antetitulo">
                        🔥 OFERTAS DEL GORILA
                    </p>


                    <h1 className="titulo-seccion">

                        PROMOS PARA UN

                        <br />

                        BAJÓN BRUTAL

                    </h1>


                    <p>
                        Aprovecha nuestros productos con descuento antes de que se acaben.
                    </p>

                </div>

            </section>


            <section className="seccion-promociones-productos">

                <div className="contenedor">


                    {mensajeCarrito && (

                        <div
                            className={
                                hayErrorCarrito
                                    ? "mensaje-menu error"
                                    : "mensaje-menu"
                            }
                        >
                            {
                                mensajeCarrito
                            }
                        </div>

                    )}


                    {productosPromocion.length >
                    0 ? (

                        <div className="grilla-productos">

                            {productosPromocion.map(
                                (producto) => (

                                    <ProductoCard
                                        key={
                                            producto.codigo
                                        }
                                        producto={
                                            producto
                                        }
                                        onAgregar={
                                            esAdministrador
                                                ? undefined
                                                : agregarProducto
                                        }
                                    />

                                )
                            )}

                        </div>

                    ) : (

                        <div className="promociones-vacias">

                            <span>
                                🦍
                            </span>


                            <h2>
                                NO HAY PROMOCIONES ACTIVAS
                            </h2>


                            <p>
                                El gorila está preparando nuevas ofertas. Vuelve pronto.
                            </p>

                        </div>

                    )}

                </div>

            </section>

        </>
    );
}


export default Promociones;