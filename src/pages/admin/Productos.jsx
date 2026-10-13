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
    const [errores, setErrores] = useState({});

    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        categoria: "",
        precio: "",
        stock: "",
        estado: "Disponible",
        imagen: ""
    });


    // CAMBIOS EN LOS CAMPOS DEL FORMULARIO

    const handleChange = (e) => {
        const { name, value } = e.target;

        setNuevoProducto({
            ...nuevoProducto,
            [name]: value
        });

        // Borra el error del campo cuando el usuario comienza a corregirlo
        setErrores({
            ...errores,
            [name]: ""
        });
    };


    // CARGAR IMAGEN

    const handleImagen = (e) => {
        const archivo = e.target.files[0];

        if (archivo) {
            const imagenURL = URL.createObjectURL(archivo);

            setNuevoProducto({
                ...nuevoProducto,
                imagen: imagenURL
            });

            // Borra el error de imagen al seleccionar una
            setErrores({
                ...errores,
                imagen: ""
            });
        }
    };


    // GUARDAR O EDITAR PRODUCTO

    const guardarProducto = () => {

        const nuevosErrores = {};


        // VALIDAR NOMBRE

        if (nuevoProducto.nombre.trim() === "") {
            nuevosErrores.nombre =
                "El nombre del producto es obligatorio.";

        } else if (nuevoProducto.nombre.trim().length < 3) {
            nuevosErrores.nombre =
                "El nombre debe tener al menos 3 caracteres.";
        }


        // VALIDAR CATEGORÍA

        if (nuevoProducto.categoria === "") {
            nuevosErrores.categoria =
                "La categoría es obligatoria.";
        }


        // VALIDAR PRECIO

        if (nuevoProducto.precio === "") {
            nuevosErrores.precio =
                "El precio es obligatorio.";

        } else if (Number(nuevoProducto.precio) <= 0) {
            nuevosErrores.precio =
                "El precio debe ser mayor a 0.";
        }


        // VALIDAR STOCK

        if (nuevoProducto.stock === "") {
            nuevosErrores.stock =
                "El stock es obligatorio.";

        } else if (Number(nuevoProducto.stock) < 0) {
            nuevosErrores.stock =
                "El stock no puede ser negativo.";
        }


        // VALIDAR IMAGEN

        if (nuevoProducto.imagen === "") {
            nuevosErrores.imagen =
                "Debes seleccionar una imagen.";
        }


        setErrores(nuevosErrores);


        // SI HAY ERRORES, NO GUARDAR

        if (Object.keys(nuevosErrores).length > 0) {
            return;
        }


        // EDITAR PRODUCTO

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

            // AGREGAR PRODUCTO

            const productoNuevo = {
                ...nuevoProducto,

                codigo:
                    Math.max(
                        ...listaProductos.map(
                            (producto) => producto.codigo
                        ),
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


        // LIMPIAR FORMULARIO

        setNuevoProducto({
            nombre: "",
            categoria: "",
            precio: "",
            stock: "",
            estado: "Disponible",
            imagen: ""
        });

        setErrores({});
        setProductoEditando(null);
        setMostrarFormulario(false);
    };


    // FILTRAR PRODUCTOS

    const productosFiltrados = listaProductos.filter((producto) => {

        const coincideNombre = producto.nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase());

        const coincideCategoria =
            categoria === "Todas" ||
            producto.categoria === categoria;

        return coincideNombre && coincideCategoria;
    });


    // ELIMINAR PRODUCTO

    const eliminarProducto = (codigo) => {

        const nuevaLista = listaProductos.filter(
            (producto) => producto.codigo !== codigo
        );

        setListaProductos(nuevaLista);
    };


    // EDITAR PRODUCTO

    const editarProducto = (producto) => {

        setProductoEditando(producto);
        setNuevoProducto(producto);
        setErrores({});
        setMostrarFormulario(true);
    };


    return (

        <main className="productos-admin">


            {/* ENCABEZADO */}

            <header className="encabezado-productos">

                <div>
                    <h1>PRODUCTOS</h1>
                    <p>
                        {productosFiltrados.length} productos
                    </p>
                </div>

            </header>



            {/* FILTROS */}

            <section className="filtros-productos">

                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(e.target.value)
                    }
                />


                <select
                    value={categoria}
                    onChange={(e) =>
                        setCategoria(e.target.value)
                    }
                >

                    <option value="Todas">
                        Todas las categorías
                    </option>

                    <option value="Hamburguesas">
                        Hamburguesas
                    </option>

                    <option value="Completos">
                        Completos
                    </option>

                    <option value="Churrascos">
                        Churrascos
                    </option>

                    <option value="Papas">
                        Papas
                    </option>

                    <option value="Fajitas">
                        Fajitas
                    </option>

                    <option value="Combos">
                        Combos
                    </option>

                    <option value="Bebidas">
                        Bebidas
                    </option>

                    <option value="Otros">
                        Otros
                    </option>

                </select>

            </section>



            {/* TABLA PRODUCTOS */}

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



            {/* BOTÓN AGREGAR */}

            <div className="contenedor-btn-agregar">

                <button

                    className="btn-agregar"

                    onClick={() => {

                        setProductoEditando(null);

                        setNuevoProducto({
                            nombre: "",
                            categoria: "",
                            precio: "",
                            stock: "",
                            estado: "Disponible",
                            imagen: ""
                        });

                        setErrores({});
                        setMostrarFormulario(true);
                    }}
                >

                    + AGREGAR PRODUCTO

                </button>

            </div>



            {/* MODAL FORMULARIO */}

            {mostrarFormulario && (

                <div className="modal-producto-fondo">

                    <div className="formulario-producto">


                        <h2>
                            {productoEditando
                                ? "Editar producto"
                                : "Agregar producto"}
                        </h2>



                        {/* NOMBRE */}

                        <div className="campo-formulario">

                            <label htmlFor="nombre">
                                Nombre del producto
                            </label>

                            <input
                                id="nombre"
                                type="text"
                                name="nombre"
                                placeholder="Ej: Hamburguesa Gorila"
                                value={nuevoProducto.nombre}
                                onChange={handleChange}
                                className={
                                    errores.nombre
                                        ? "campo-error"
                                        : ""
                                }
                            />

                            {errores.nombre && (

                                <small className="mensaje-error">
                                    {errores.nombre}
                                </small>

                            )}

                        </div>



                        {/* CATEGORÍA */}

                        <div className="campo-formulario">

                            <label htmlFor="categoria">
                                Categoría
                            </label>

                            <select

                                id="categoria"
                                name="categoria"

                                value={nuevoProducto.categoria}

                                onChange={handleChange}

                                className={
                                    errores.categoria
                                        ? "campo-error"
                                        : ""
                                }
                            >

                                <option value="">
                                    Seleccione categoría
                                </option>

                                <option value="Hamburguesas">
                                    Hamburguesas
                                </option>

                                <option value="Completos">
                                    Completos
                                </option>

                                <option value="Churrascos">
                                    Churrascos
                                </option>

                                <option value="Papas">
                                    Papas
                                </option>

                                <option value="Fajitas">
                                    Fajitas
                                </option>

                                <option value="Combos">
                                    Combos
                                </option>

                                <option value="Bebidas">
                                    Bebidas
                                </option>

                                <option value="Otros">
                                    Otros
                                </option>

                            </select>


                            {errores.categoria && (

                                <small className="mensaje-error">
                                    {errores.categoria}
                                </small>

                            )}

                        </div>



                        {/* PRECIO */}

                        <div className="campo-formulario">

                            <label htmlFor="precio">
                                Precio
                            </label>

                            <input
                                id="precio"
                                type="number"
                                name="precio"
                                placeholder="Ej: 6000"
                                value={nuevoProducto.precio}
                                onChange={handleChange}
                                className={
                                    errores.precio
                                        ? "campo-error"
                                        : ""
                                }
                            />

                            {errores.precio && (

                                <small className="mensaje-error">
                                    {errores.precio}
                                </small>

                            )}

                        </div>



                        {/* STOCK */}

                        <div className="campo-formulario">

                            <label htmlFor="stock">
                                Stock
                            </label>

                            <input
                                id="stock"
                                type="number"
                                name="stock"
                                placeholder="Ej: 20"
                                value={nuevoProducto.stock}
                                onChange={handleChange}
                                className={
                                    errores.stock
                                        ? "campo-error"
                                        : ""
                                }
                            />

                            {errores.stock && (

                                <small className="mensaje-error">
                                    {errores.stock}
                                </small>

                            )}

                        </div>



                        {/* ESTADO */}

                        <div className="campo-formulario">

                            <label htmlFor="estado">
                                Estado
                            </label>

                            <select
                                id="estado"
                                name="estado"
                                value={nuevoProducto.estado}
                                onChange={handleChange}
                            >

                                <option value="Disponible">
                                    Disponible
                                </option>

                                <option value="Sin stock">
                                    Sin stock
                                </option>

                                <option value="Oculto">
                                    Oculto
                                </option>

                            </select>

                        </div>



                        {/* IMAGEN */}

                        <div className="campo-formulario">

                            <label htmlFor="imagen">
                                Imagen del producto
                            </label>

                            <input
                                id="imagen"
                                type="file"
                                name="imagen"
                                accept="image/*"
                                onChange={handleImagen}
                                className={
                                    errores.imagen
                                        ? "campo-error"
                                        : ""
                                }
                            />

                            {errores.imagen && (

                                <small className="mensaje-error">
                                    {errores.imagen}
                                </small>

                            )}

                        </div>



                        {/* GUARDAR */}

                        <button
                            className="btn-guardar"
                            onClick={guardarProducto}
                        >

                            {productoEditando
                                ? "Guardar cambios"
                                : "Guardar producto"}

                        </button>



                        {/* CERRAR */}

                        <button

                            className="btn-cerrar"

                            onClick={() => {

                                setMostrarFormulario(false);
                                setProductoEditando(null);
                                setErrores({});

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