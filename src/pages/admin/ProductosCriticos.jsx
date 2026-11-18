import {
    useEffect,
    useState
} from "react";

import {
    obtenerProductosApi
} from "../../api/productos.js";

import "../../styles/productos.css";


function ProductosCriticos() {

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
                    "No fue posible cargar los productos."
                );

            } finally {

                setCargando(
                    false
                );
            }
        };


        cargarProductos();

    }, []);


    const productosCriticos =
        productos.filter(
            (producto) =>
                producto.stock <= 5
        );


    return (

        <main className="productos-admin">

            <header className="encabezado-productos">

                <div>

                    <h1>
                        PRODUCTOS CRÍTICOS
                    </h1>


                    <p>

                        {
                            cargando
                                ? "Cargando..."
                                : `${productosCriticos.length} ${
                                    productosCriticos.length === 1
                                        ? "producto con stock bajo"
                                        : "productos con stock bajo"
                                }`
                        }

                    </p>

                </div>

            </header>


            {error && (

                <div className="mensaje-menu error">

                    {
                        error
                    }

                </div>

            )}


            <section className="tabla-productos">

                <table>

                    <thead>

                        <tr>

                            <th>
                                PRODUCTO
                            </th>

                            <th>
                                CATEGORÍA
                            </th>

                            <th>
                                STOCK
                            </th>

                            <th>
                                ESTADO
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {!cargando &&
                        productosCriticos.length >
                        0 ? (

                            productosCriticos.map(
                                (producto) => (

                                    <tr
                                        key={
                                            producto.codigo
                                        }
                                    >

                                        <td>

                                            {
                                                producto.nombre
                                            }

                                        </td>


                                        <td>

                                            {
                                                producto.categoria
                                            }

                                        </td>


                                        <td>

                                            {
                                                producto.stock
                                            }

                                        </td>


                                        <td>

                                            {producto.stock ===
                                            0 ? (

                                                <span className="estado sin-stock">

                                                    Sin stock

                                                </span>

                                            ) : (

                                                <span className="estado critico">

                                                    Stock crítico

                                                </span>

                                            )}

                                        </td>

                                    </tr>

                                )
                            )

                        ) : !cargando && (

                            <tr>

                                <td colSpan="4">

                                    No hay productos con stock crítico.

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </section>

        </main>
    );
}


export default ProductosCriticos;