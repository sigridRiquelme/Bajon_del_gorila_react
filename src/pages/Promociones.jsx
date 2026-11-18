import {
    useEffect,
    useState
} from "react";

import ProductoCard
    from "../components/ProductoCard.jsx";

import {
    obtenerProductosApi
} from "../api/productos.js";

import {
    agregarAlCarrito,
    obtenerCarrito
} from "../data/carrito.js";

import "../styles/Menu.css";
import "../styles/promociones.css";
import "../styles/responsive.css";


function Promociones() {

    const [
        productos,
        setProductos
    ] = useState([]);


    const [
        cargando,
        setCargando
    ] = useState(true);


    const [
        errorCarga,
        setErrorCarga
    ] = useState("");


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


    const rol =
        localStorage.getItem(
            "usuarioRol"
        );


    const esAdministrador =
        rol ===
        "ADMINISTRADOR";


    const esVendedor =
        rol ===
        "VENDEDOR";


    const puedeComprar =
        !esAdministrador &&
        !esVendedor;


    useEffect(() => {

        const cargarProductos = async () => {

            try {

                const datos =
                    await obtenerProductosApi();


                setProductos(
                    datos
                );


                setErrorCarga(
                    ""
                );

            } catch (
                error
            ) {

                console.error(
                    error
                );


                setErrorCarga(
                    "No fue posible cargar las promociones."
                );

            } finally {

                setCargando(
                    false
                );
            }
        };


        cargarProductos();

    }, []);


    const productosPromocion =
        productos
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
                            )
                    };
                }
            );


    const agregarProducto = (
        producto,
        cantidad
    ) => {

        setMensajeCarrito("");

        setHayErrorCarrito(
            false
        );


        if (
            !puedeComprar
        ) {

            setMensajeCarrito(
                "Esta cuenta no puede realizar compras."
            );

            setHayErrorCarrito(
                true
            );

            return;
        }


        if (
            producto.stockDisponible <=
            0
        ) {

            setMensajeCarrito(
                "Este producto no tiene stock disponible."
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


                    {errorCarga && (

                        <div className="mensaje-menu error">

                            {
                                errorCarga
                            }

                        </div>

                    )}


                    {cargando ? (

                        <p>
                            Cargando promociones...
                        </p>

                    ) : productosPromocion.length >
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
                                            puedeComprar
                                                ? agregarProducto
                                                : undefined
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