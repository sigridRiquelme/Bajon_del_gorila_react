import {
    useEffect,
    useState
} from "react";

import {
    obtenerProductosApi
} from "../../api/productos.js";

import "../../styles/productos.css";


function ReporteInventario() {

    const [
        productos,
        setProductos
    ] = useState([]);


    const [
        cargando,
        setCargando
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    useEffect(() => {

        const cargarProductos = async () => {

            try {

                const datos =
                    await obtenerProductosApi();


                setProductos(
                    datos
                );


                setError(
                    ""
                );

            } catch (
                error
            ) {

                console.error(
                    error
                );


                setError(
                    "No fue posible cargar el reporte de inventario."
                );

            } finally {

                setCargando(
                    false
                );
            }
        };


        cargarProductos();

    }, []);


    const stockTotal =
        productos.reduce(
            (
                total,
                producto
            ) =>
                total +
                producto.stock,
            0
        );


    const productosCriticos =
        productos.filter(
            (producto) =>
                producto.stock >
                    0 &&
                producto.stock <=
                    5
        ).length;


    const productosSinStock =
        productos.filter(
            (producto) =>
                producto.stock ===
                0
        ).length;


    const productosPorCategoria =
        productos.reduce(
            (
                categorias,
                producto
            ) => {

                if (
                    !categorias[
                        producto.categoria
                    ]
                ) {

                    categorias[
                        producto.categoria
                    ] = [];
                }


                categorias[
                    producto.categoria
                ].push(
                    producto
                );


                return categorias;

            },
            {}
        );


    return (

        <main className="productos-admin">

            <header className="encabezado-productos">

                <div>

                    <h1>
                        REPORTE DE INVENTARIO
                    </h1>

                </div>

            </header>


            {error && (

                <div className="mensaje-menu error">

                    {
                        error
                    }

                </div>

            )}


            {cargando ? (

                <p>
                    Cargando inventario...
                </p>

            ) : (

                <>

                    <section className="resumen-inventario">


                        <div className="resumen-inventario-card">

                            <span>
                                Productos registrados
                            </span>

                            <strong>
                                {
                                    productos.length
                                }
                            </strong>

                        </div>


                        <div className="resumen-inventario-card">

                            <span>
                                Stock total
                            </span>

                            <strong>
                                {
                                    stockTotal
                                }
                            </strong>

                        </div>


                        <div className="resumen-inventario-card">

                            <span>
                                Stock crítico
                            </span>

                            <strong>
                                {
                                    productosCriticos
                                }
                            </strong>

                        </div>


                        <div className="resumen-inventario-card">

                            <span>
                                Sin stock
                            </span>

                            <strong>
                                {
                                    productosSinStock
                                }
                            </strong>

                        </div>

                    </section>


                    <h2 className="titulo-stock-categoria">

                        Stock disponible por categoría

                    </h2>


                    {productos.length ===
                    0 ? (

                        <p>
                            No hay productos registrados.
                        </p>

                    ) : (

                        <section className="inventario-categorias">


                            {Object.entries(
                                productosPorCategoria
                            ).map(
                                ([
                                    categoria,
                                    productosCategoria
                                ]) => (

                                    <div
                                        className="inventario-categoria"
                                        key={
                                            categoria
                                        }
                                    >

                                        <h2>

                                            {
                                                categoria
                                            }

                                        </h2>


                                        <div className="inventario-lista">


                                            {productosCategoria.map(
                                                (producto) => (

                                                    <div
                                                        className="inventario-producto"
                                                        key={
                                                            producto.codigo
                                                        }
                                                    >

                                                        <span className="inventario-producto-nombre">

                                                            {
                                                                producto.nombre
                                                            }

                                                        </span>


                                                        <strong
                                                            className={
                                                                producto.stock ===
                                                                0
                                                                    ? "stock-sin"
                                                                    : producto.stock <=
                                                                        5
                                                                        ? "stock-critico"
                                                                        : "stock-normal"
                                                            }
                                                        >

                                                            Stock: {
                                                                producto.stock
                                                            }

                                                        </strong>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </section>

                    )}

                </>

            )}

        </main>
    );
}


export default ReporteInventario;