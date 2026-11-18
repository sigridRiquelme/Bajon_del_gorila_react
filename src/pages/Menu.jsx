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
    obtenerCategoriasApi
} from "../api/categorias.js";

import {
    agregarAlCarrito,
    obtenerCarrito
} from "../data/carrito.js";

import "../styles/Menu.css";
import "../styles/responsive.css";


function normalizarTexto(
    texto
) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}


function Menu() {

    const [
        productos,
        setProductos
    ] = useState([]);


    const [
        categorias,
        setCategorias
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
        busqueda,
        setBusqueda
    ] = useState("");


    const [
        categoria,
        setCategoria
    ] = useState("Todos");


    const [
        orden,
        setOrden
    ] = useState(
        "Más vendidos"
    );


    const [
        mensajeCarrito,
        setMensajeCarrito
    ] = useState("");


    const [
        hayErrorCarrito,
        setHayErrorCarrito
    ] = useState(false);


    const [
        carritoActual,
        setCarritoActual
    ] = useState(
        obtenerCarrito()
    );


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

        const cargarDatos = async () => {

            try {

                const [
                    productosApi,
                    categoriasApi
                ] =
                    await Promise.all([
                        obtenerProductosApi(),
                        obtenerCategoriasApi()
                    ]);


                setProductos(
                    productosApi
                );


                setCategorias(
                    categoriasApi
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
                    "No fue posible cargar los productos."
                );

            } finally {

                setCargando(
                    false
                );
            }
        };


        cargarDatos();

    }, []);


    const productosMenu =
        productos
            .filter(
                (producto) =>
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


                    const stockDisponible =
                        Math.max(
                            producto.stock -
                            cantidadEnCarrito,
                            0
                        );


                    return {

                        ...producto,

                        id:
                            producto.codigo,

                        stockDisponible
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
                0 ||
            producto.estado ===
                "Sin stock"
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


        const carritoActualizado =
            obtenerCarrito();


        setCarritoActual(
            carritoActualizado
        );


        setMensajeCarrito(
            `${cantidad} ${producto.nombre} agregado al carrito.`
        );
    };


    const productosFiltrados =
        productosMenu

            .filter(
                (producto) => {

                    const coincideCategoria =
                        categoria ===
                            "Todos" ||
                        producto.categoria ===
                            categoria;


                    const textoProducto =
                        normalizarTexto(
                            `${producto.nombre} ${producto.descripcion} ${producto.categoria}`
                        );


                    const coincideBusqueda =
                        textoProducto.includes(
                            normalizarTexto(
                                busqueda.trim()
                            )
                        );


                    return (
                        coincideCategoria &&
                        coincideBusqueda
                    );
                }
            )

            .sort(
                (a, b) => {

                    if (
                        orden ===
                        "Menor precio"
                    ) {

                        return (
                            a.precio -
                            b.precio
                        );
                    }


                    if (
                        orden ===
                        "Mayor precio"
                    ) {

                        return (
                            b.precio -
                            a.precio
                        );
                    }


                    return (
                        b.valoracion -
                        a.valoracion
                    );
                }
            );


    return (

        <>

            <section className="cabecera-pagina">

                <div className="contenedor">

                    <p className="antetitulo">
                        🍔 NUESTRO MENÚ
                    </p>


                    <h1 className="titulo-seccion">
                        ELIGE TU BAJÓN
                    </h1>


                    <p>
                        Tenemos algo para cada nivel de hambre.
                    </p>

                </div>

            </section>


            <section className="barra-filtros">

                <div className="contenedor contenido-filtros">


                    <div className="caja-busqueda">

                        <span className="icono-busqueda">
                            ⌕
                        </span>


                        <input
                            className="campo-entrada"
                            type="search"
                            placeholder="Buscar productos…"
                            aria-label="Buscar productos"
                            value={
                                busqueda
                            }
                            onChange={(e) =>
                                setBusqueda(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <select
                        className="campo-entrada selector-categoria"
                        value={
                            categoria
                        }
                        onChange={(e) =>
                            setCategoria(
                                e.target.value
                            )
                        }
                    >

                        <option value="Todos">
                            Todas las categorías
                        </option>


                        {categorias.map(
                            (item) => (

                                <option
                                    key={
                                        item.id
                                    }
                                    value={
                                        item.nombre
                                    }
                                >
                                    {
                                        item.nombre
                                    }
                                </option>

                            )
                        )}

                    </select>


                    <select
                        className="campo-entrada selector-orden"
                        aria-label="Ordenar productos"
                        value={
                            orden
                        }
                        onChange={(e) =>
                            setOrden(
                                e.target.value
                            )
                        }
                    >

                        <option>
                            Más vendidos
                        </option>

                        <option>
                            Menor precio
                        </option>

                        <option>
                            Mayor precio
                        </option>

                    </select>

                </div>

            </section>


            <section className="productos-menu">

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

                        <p className="texto-resultados">
                            Cargando productos...
                        </p>

                    ) : (

                        <>

                            <p className="texto-resultados">

                                <strong>
                                    {
                                        productosFiltrados.length
                                    }
                                </strong>

                                {" "}
                                productos encontrados

                                {categoria !==
                                    "Todos" &&
                                    ` en ${categoria}`
                                }

                            </p>


                            {productosFiltrados.length >
                            0 ? (

                                <div className="grilla-productos">

                                    {productosFiltrados.map(
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

                                <div className="estado-vacio mostrar">

                                    <div className="emoji">
                                        🦍
                                    </div>

                                    <h3>
                                        NO ENCONTRAMOS ESO
                                    </h3>

                                    <p>
                                        Intenta con otra búsqueda o categoría.
                                    </p>

                                </div>

                            )}

                        </>

                    )}

                </div>

            </section>

        </>
    );
}


export default Menu;