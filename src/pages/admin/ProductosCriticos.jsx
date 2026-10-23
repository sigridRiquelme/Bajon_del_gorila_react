import "../../styles/productos.css";
import { obtenerProductos } from "../../data/productos.js";

function ProductosCriticos() {

    const productos = obtenerProductos();

    const productosCriticos = productos.filter(
        (producto) => producto.stock <= 5
    );

    return (
        <main className="productos-admin">

            <header className="encabezado-productos">

                <div>
                    <h1>PRODUCTOS CRÍTICOS</h1>

                    <p>
                        {productosCriticos.length}{" "}
                        {productosCriticos.length === 1
                            ? "producto con stock bajo"
                            : "productos con stock bajo"}
                    </p>
                </div>

            </header>


            <section className="tabla-productos">

                <table>

                    <thead>
                        <tr>
                            <th>PRODUCTO</th>
                            <th>CATEGORÍA</th>
                            <th>STOCK</th>
                            <th>ESTADO</th>
                        </tr>
                    </thead>


                    <tbody>

                        {productosCriticos.length > 0 ? (

                            productosCriticos.map((producto) => (

                                <tr key={producto.codigo}>

                                    <td>
                                        {producto.nombre}
                                    </td>

                                    <td>
                                        {producto.categoria}
                                    </td>

                                    <td>
                                        {producto.stock}
                                    </td>

                                    <td>

                                        {producto.stock === 0 ? (

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

                            ))

                        ) : (

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