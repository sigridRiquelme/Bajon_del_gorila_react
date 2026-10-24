import {
    useState
} from "react";

import "../../styles/productos.css";

import ProductoFila
    from "../../components/admin/ProductoFila.jsx";

import {
    obtenerProductos,
    agregarProducto as agregarProductoData,
    actualizarProducto,
    eliminarProducto as eliminarProductoData
} from "../../data/productos.js";


function Productos() {

    const [
        busqueda,
        setBusqueda
    ] = useState("");


    const [
        categoria,
        setCategoria
    ] = useState("Todas");


    const [
        listaProductos,
        setListaProductos
    ] = useState(
        obtenerProductos()
    );


    const [
        mostrarFormulario,
        setMostrarFormulario
    ] = useState(false);


    const [
        productoEditando,
        setProductoEditando
    ] = useState(null);


    const [
        errores,
        setErrores
    ] = useState({});


    const [
        nuevoProducto,
        setNuevoProducto
    ] = useState({
        nombre: "",
        categoria: "",
        precio: "",
        stock: "",
        descripcion: "",
        estado: "Disponible",
        imagen: ""
    });


    const handleChange = (
        e
    ) => {

        const {
            name,
            value
        } = e.target;


        setNuevoProducto({
            ...nuevoProducto,
            [name]: value
        });


        setErrores({
            ...errores,
            [name]: ""
        });
    };


    const handleImagen = (
        e
    ) => {

        const archivo =
            e.target.files[0];


        if (archivo) {

            const lector =
                new FileReader();


            lector.onload = () => {

                setNuevoProducto({
                    ...nuevoProducto,
                    imagen:
                        lector.result
                });


                setErrores({
                    ...errores,
                    imagen: ""
                });
            };


            lector.readAsDataURL(
                archivo
            );
        }
    };


    const guardarProducto = () => {

        const nuevosErrores = {};


        if (
            nuevoProducto.nombre
                .trim() === ""
        ) {

            nuevosErrores.nombre =
                "El nombre del producto es obligatorio.";

        } else if (
            nuevoProducto.nombre
                .trim()
                .length < 3
        ) {

            nuevosErrores.nombre =
                "El nombre debe tener al menos 3 caracteres.";
        }


        if (
            nuevoProducto.categoria ===
            ""
        ) {

            nuevosErrores.categoria =
                "La categoría es obligatoria.";
        }


        if (
            nuevoProducto.precio ===
            ""
        ) {

            nuevosErrores.precio =
                "El precio es obligatorio.";

        } else if (
            Number(
                nuevoProducto.precio
            ) <= 0
        ) {

            nuevosErrores.precio =
                "El precio debe ser mayor a 0.";
        }


        if (
            nuevoProducto.stock ===
            ""
        ) {

            nuevosErrores.stock =
                "El stock es obligatorio.";

        } else if (
            Number(
                nuevoProducto.stock
            ) < 0
        ) {

            nuevosErrores.stock =
                "El stock no puede ser negativo.";
        }


        // CAMBIO: AHORA TODOS LOS PRODUCTOS DEBEN TENER DESCRIPCION

        if (
            nuevoProducto.descripcion
                .trim() === ""
        ) {

            nuevosErrores.descripcion =
                "La descripción es obligatoria.";

        } else if (
            nuevoProducto.descripcion
                .trim()
                .length < 10
        ) {

            nuevosErrores.descripcion =
                "La descripción debe tener al menos 10 caracteres.";
        }


        if (
            nuevoProducto.imagen ===
            ""
        ) {

            nuevosErrores.imagen =
                "Debes seleccionar una imagen.";
        }


        setErrores(
            nuevosErrores
        );


        if (
            Object.keys(
                nuevosErrores
            ).length > 0
        ) {

            return;
        }


        let estadoFinal =
            nuevoProducto.estado;


        if (
            Number(
                nuevoProducto.stock
            ) === 0
        ) {

            estadoFinal =
                "Sin stock";

        } else if (
            nuevoProducto.estado ===
            "Sin stock"
        ) {

            estadoFinal =
                "Disponible";
        }


        if (
            productoEditando
        ) {

            actualizarProducto(
                productoEditando.codigo,
                {
                    ...nuevoProducto,

                    nombre:
                        nuevoProducto.nombre
                            .trim(),

                    descripcion:
                        nuevoProducto.descripcion
                            .trim(),

                    precio:
                        Number(
                            nuevoProducto.precio
                        ),

                    stock:
                        Number(
                            nuevoProducto.stock
                        ),

                    estado:
                        estadoFinal
                }
            );

        } else {

            agregarProductoData({
                ...nuevoProducto,

                nombre:
                    nuevoProducto.nombre
                        .trim(),

                descripcion:
                    nuevoProducto.descripcion
                        .trim(),

                precio:
                    Number(
                        nuevoProducto.precio
                    ),

                stock:
                    Number(
                        nuevoProducto.stock
                    ),

                estado:
                    estadoFinal
            });
        }


        setListaProductos(
            obtenerProductos()
        );


        setNuevoProducto({
            nombre: "",
            categoria: "",
            precio: "",
            stock: "",
            descripcion: "",
            estado: "Disponible",
            imagen: ""
        });


        setErrores({});
        setProductoEditando(null);
        setMostrarFormulario(false);
    };


    const productosFiltrados =
        listaProductos.filter(
            (producto) => {

                const coincideNombre =
                    producto.nombre
                        .toLowerCase()
                        .includes(
                            busqueda
                                .toLowerCase()
                        );


                const coincideCategoria =
                    categoria ===
                        "Todas" ||
                    producto.categoria ===
                        categoria;


                return (
                    coincideNombre &&
                    coincideCategoria
                );
            }
        );


    const eliminarProducto = (
        codigo
    ) => {

        eliminarProductoData(
            codigo
        );


        setListaProductos(
            obtenerProductos()
        );
    };


    const editarProducto = (
        producto
    ) => {

        setProductoEditando(
            producto
        );


        setNuevoProducto({
            ...producto,

            descripcion:
                producto.descripcion ||
                ""
        });


        setErrores({});

        setMostrarFormulario(
            true
        );
    };


    const abrirFormulario = () => {

        setProductoEditando(
            null
        );


        setNuevoProducto({
            nombre: "",
            categoria: "",
            precio: "",
            stock: "",
            descripcion: "",
            estado: "Disponible",
            imagen: ""
        });


        setErrores({});

        setMostrarFormulario(
            true
        );
    };


    const cerrarFormulario = () => {

        setMostrarFormulario(
            false
        );

        setProductoEditando(
            null
        );

        setErrores({});


        setNuevoProducto({
            nombre: "",
            categoria: "",
            precio: "",
            stock: "",
            descripcion: "",
            estado: "Disponible",
            imagen: ""
        });
    };


    return (

        <main className="productos-admin">


            <header className="encabezado-productos">

                <div>

                    <h1>
                        PRODUCTOS
                    </h1>

                    <p>
                        {
                            productosFiltrados.length
                        } productos
                    </p>

                </div>

            </header>


            <section className="filtros-productos">

                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={
                        busqueda
                    }
                    onChange={(e) =>
                        setBusqueda(
                            e.target.value
                        )
                    }
                />


                <select
                    value={
                        categoria
                    }
                    onChange={(e) =>
                        setCategoria(
                            e.target.value
                        )
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


            <section className="tabla-productos">

                <table>

                    <thead>

                        <tr>

                            <th>
                                IMAGEN
                            </th>

                            <th>
                                NOMBRE
                            </th>

                            <th>
                                CATEGORÍA
                            </th>

                            <th>
                                PRECIO
                            </th>

                            <th>
                                STOCK
                            </th>

                            <th>
                                ESTADO
                            </th>

                            <th>
                                ACCIONES
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {productosFiltrados.length >
                        0 ? (

                            productosFiltrados.map(
                                (producto) => (

                                    <ProductoFila
                                        key={
                                            producto.codigo
                                        }
                                        codigo={
                                            producto.codigo
                                        }
                                        nombre={
                                            producto.nombre
                                        }
                                        categoria={
                                            producto.categoria
                                        }
                                        precio={
                                            producto.precio
                                        }
                                        stock={
                                            producto.stock
                                        }
                                        estado={
                                            producto.estado
                                        }
                                        imagen={
                                            producto.imagen
                                        }
                                        onEliminar={
                                            eliminarProducto
                                        }
                                        onEditar={
                                            editarProducto
                                        }
                                    />

                                )
                            )

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
                    onClick={
                        abrirFormulario
                    }
                >
                    + AGREGAR PRODUCTO
                </button>

            </div>


            {mostrarFormulario && (

                <div className="modal-producto-fondo">

                    <div className="formulario-producto">


                        <h2>

                            {productoEditando
                                ? "Editar producto"
                                : "Agregar producto"
                            }

                        </h2>


                        <div className="campo-formulario">

                            <label htmlFor="nombre">
                                Nombre del producto
                            </label>


                            <input
                                id="nombre"
                                type="text"
                                name="nombre"
                                placeholder="Ej: Hamburguesa Clásica"
                                value={
                                    nuevoProducto.nombre
                                }
                                onChange={
                                    handleChange
                                }
                                className={
                                    errores.nombre
                                        ? "campo-error"
                                        : ""
                                }
                            />


                            {errores.nombre && (

                                <small className="mensaje-error">
                                    {
                                        errores.nombre
                                    }
                                </small>

                            )}

                        </div>


                        <div className="campo-formulario">

                            <label htmlFor="categoria">
                                Categoría
                            </label>


                            <select
                                id="categoria"
                                name="categoria"
                                value={
                                    nuevoProducto.categoria
                                }
                                onChange={
                                    handleChange
                                }
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
                                    {
                                        errores.categoria
                                    }
                                </small>

                            )}

                        </div>


                        <div className="campo-formulario">

                            <label htmlFor="precio">
                                Precio
                            </label>


                            <input
                                id="precio"
                                type="number"
                                name="precio"
                                placeholder="Ej: 5990"
                                value={
                                    nuevoProducto.precio
                                }
                                onChange={
                                    handleChange
                                }
                                className={
                                    errores.precio
                                        ? "campo-error"
                                        : ""
                                }
                            />


                            {errores.precio && (

                                <small className="mensaje-error">
                                    {
                                        errores.precio
                                    }
                                </small>

                            )}

                        </div>


                        <div className="campo-formulario">

                            <label htmlFor="stock">
                                Stock
                            </label>


                            <input
                                id="stock"
                                type="number"
                                name="stock"
                                placeholder="Ej: 20"
                                value={
                                    nuevoProducto.stock
                                }
                                onChange={
                                    handleChange
                                }
                                className={
                                    errores.stock
                                        ? "campo-error"
                                        : ""
                                }
                            />


                            {errores.stock && (

                                <small className="mensaje-error">
                                    {
                                        errores.stock
                                    }
                                </small>

                            )}

                        </div>


                        <div className="campo-formulario">

                            <label htmlFor="descripcion">
                                Descripción
                            </label>


                            <textarea
                                id="descripcion"
                                name="descripcion"
                                rows="4"
                                placeholder="Ej: Carne, queso cheddar, lechuga y tomate."
                                value={
                                    nuevoProducto.descripcion
                                }
                                onChange={
                                    handleChange
                                }
                                className={
                                    errores.descripcion
                                        ? "campo-error"
                                        : ""
                                }
                            />


                            {errores.descripcion && (

                                <small className="mensaje-error">
                                    {
                                        errores.descripcion
                                    }
                                </small>

                            )}

                        </div>


                        <div className="campo-formulario">

                            <label htmlFor="estado">
                                Estado
                            </label>


                            <select
                                id="estado"
                                name="estado"
                                value={
                                    nuevoProducto.estado
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="Disponible">
                                    Disponible
                                </option>

                                <option value="Oculto">
                                    Oculto
                                </option>

                            </select>

                        </div>


                        <div className="campo-formulario">

                            <label htmlFor="imagen">
                                Imagen del producto
                            </label>


                            <input
                                id="imagen"
                                type="file"
                                name="imagen"
                                accept="image/*"
                                onChange={
                                    handleImagen
                                }
                                className={
                                    errores.imagen
                                        ? "campo-error"
                                        : ""
                                }
                            />


                            {productoEditando &&
                                nuevoProducto.imagen && (

                                <small>
                                    Puedes dejar la imagen actual si no seleccionas otra.
                                </small>

                            )}


                            {errores.imagen && (

                                <small className="mensaje-error">
                                    {
                                        errores.imagen
                                    }
                                </small>

                            )}

                        </div>


                        <button
                            className="btn-guardar"
                            onClick={
                                guardarProducto
                            }
                        >

                            {productoEditando
                                ? "Guardar cambios"
                                : "Guardar producto"
                            }

                        </button>


                        <button
                            className="btn-cerrar"
                            onClick={
                                cerrarFormulario
                            }
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