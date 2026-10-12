import { useState } from "react";
import "../../styles/productos.css";
import productos from "../../data/productos.js";
import ProductoFila from "../../components/admin/ProductoFila.jsx";

function Productos() {

    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("Todas");
    const [listaProductos, setListaProductos] = useState(productos);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);

    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        categoria: "",
        precio: "",
        stock: "",
        estado: "Disponible",
        imagen: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setNuevoProducto({
            ...nuevoProducto,
            [name]: value
        });
    };

    const handleImagen = (e) => {
        const archivo = e.target.files[0];

        if (archivo) {
            const imagenURL = URL.createObjectURL(archivo);

            setNuevoProducto({
                ...nuevoProducto,
                imagen: imagenURL
            });
        }
    };

    const guardarProducto = () => {

        if (
            nuevoProducto.nombre.trim() === "" ||
            nuevoProducto.categoria === "" ||
            nuevoProducto.precio === "" ||
            nuevoProducto.stock === ""
        ) {
            alert("Completa todos los campos");
            return;
        }

        if (productoEditando) {

            const listaActualizada = listaProductos.map((producto) =>
                producto.codigo === productoEditando.codigo
                    ? {
                        ...nuevoProducto,
                        codigo: productoEditando.codigo,
                        precio: Number(nuevoProducto.precio),
                        stock: Number(nuevoProducto.stock)
                    }
                    : producto
            );

            setListaProductos(listaActualizada);

        } else {

            const productoNuevo = {
                ...nuevoProducto,
                codigo: Math.max(
                    ...listaProductos.map((producto) => producto.codigo),
                    0
                ) + 1,
                precio: Number(nuevoProducto.precio),
                stock: Number(nuevoProducto.stock)
            };

            setListaProductos([
                ...listaProductos,
                productoNuevo
            ]);
        }

        setNuevoProducto({
            nombre: "",
            categoria: "",
            precio: "",
            stock: "",
            estado: "Disponible",
            imagen: ""
        });

        setProductoEditando(null);
        setMostrarFormulario(false);
    };

    const productosFiltrados = listaProductos.filter((producto) => {
        const coincideNombre = producto.nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase());

        const coincideCategoria =
            categoria === "Todas" || producto.categoria === categoria;

        return coincideNombre && coincideCategoria;
    });

    const eliminarProducto = (codigo) => {
        const nuevaLista = listaProductos.filter(
            (producto) => producto.codigo !== codigo
        );

        setListaProductos(nuevaLista);
    };

    const editarProducto = (producto) => {
        setProductoEditando(producto);
        setNuevoProducto(producto);
        setMostrarFormulario(true);
    };

    return (
        <main className="productos-admin">

            <header className="encabezado-productos">
                <div>
                    <h1>PRODUCTOS</h1>
                    <p>{productosFiltrados.length} productos</p>
                </div>
            </header>

            <section className="filtros-productos">

                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                >
                    <option value="Todas">Todas las categorías</option>
                    <option value="Hamburguesas">Hamburguesas</option>
                    <option value="Completos">Completos</option>
                    <option value="Churrascos">Churrascos</option>
                    <option value="Papas">Papas</option>
                    <option value="Fajitas">Fajitas</option>
                    <option value="Combos">Combos</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Otros">Otros</option>
                </select>

            </section>

            <section className="tabla-productos">

                <table>

                    <thead>
                        <tr>
                            <th>IMAGEN</th>
                            <th>NOMBRE</th>
                            <th>CATEGORÍA</th>
                            <th>PRECIO</th>
                            <th>STOCK</th>
                            <th>ESTADO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map((producto) => (
                                <ProductoFila
                                    key={producto.codigo}
                                    codigo={producto.codigo}
                                    nombre={producto.nombre}
                                    categoria={producto.categoria}
                                    precio={producto.precio}
                                    stock={producto.stock}
                                    estado={producto.estado}
                                    imagen={producto.imagen}
                                    onEliminar={eliminarProducto}
                                    onEditar={editarProducto}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">
                                    No se encontraron productos.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>

            </section>

            <div className="contenedor-btn-agregar">
                <button
                    className="btn-agregar"
                    onClick={() => setMostrarFormulario(true)}
                >
                    + AGREGAR PRODUCTO
                </button>
            </div>

            {mostrarFormulario && (
                <div className="modal-producto-fondo">

                    <div className="formulario-producto">

                        <h2>
                            {productoEditando ? "Editar producto" : "Agregar producto"}
                        </h2>

                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre del producto"
                            value={nuevoProducto.nombre}
                            onChange={handleChange}
                        />

                        <select
                            name="categoria"
                            value={nuevoProducto.categoria}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione categoría</option>
                            <option value="Hamburguesas">Hamburguesas</option>
                            <option value="Completos">Completos</option>
                            <option value="Churrascos">Churrascos</option>
                            <option value="Papas">Papas</option>
                            <option value="Fajitas">Fajitas</option>
                            <option value="Combos">Combos</option>
                            <option value="Bebidas">Bebidas</option>
                            <option value="Otros">Otros</option>
                        </select>

                        <input
                            type="number"
                            name="precio"
                            placeholder="Precio"
                            value={nuevoProducto.precio}
                            onChange={handleChange}
                        />

                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={nuevoProducto.stock}
                            onChange={handleChange}
                        />

                        <select
                            name="estado"
                            value={nuevoProducto.estado}
                            onChange={handleChange}
                        >
                            <option value="Disponible">Disponible</option>
                            <option value="Sin stock">Sin stock</option>
                            <option value="Oculto">Oculto</option>
                        </select>

                        <input
                            type="file"
                            name="imagen"
                            accept="image/*"
                            onChange={handleImagen}
                        />

                        <button
                            className="btn-guardar"
                            onClick={guardarProducto}
                        >
                            {productoEditando ? "Guardar cambios" : "Guardar producto"}
                        </button>

                        <button
                            className="btn-cerrar"
                            onClick={() => {
                                setMostrarFormulario(false);
                                setProductoEditando(null);

                                setNuevoProducto({
                                    nombre: "",
                                    categoria: "",
                                    precio: "",
                                    stock: "",
                                    estado: "Disponible",
                                    imagen: ""
                                });
                            }}
                        >
                            Cerrar
                        </button>

                    </div>

                </div>
            )}

        </main>
    );
}

export default Productos;