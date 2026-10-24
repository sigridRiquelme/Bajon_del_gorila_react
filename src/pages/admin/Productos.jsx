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
        promocion: false,
        descuento: 0,
        estado: "Disponible",
        imagen: ""
    });


    // ACTUALIZO LOS CAMPOS

    const handleChange = (
        e
    ) => {

        const {
            name,
            value
        } = e.target;


        setNuevoProducto({

            ...nuevoProducto,

            [name]:
                value
        });


        setErrores({

            ...errores,

            [name]:
                ""
        });
    };


    // ACTIVO O DESACTIVO PROMOCION

    const cambiarPromocion = (
        e
    ) => {

        const activa =
            e.target.checked;


        setNuevoProducto({

            ...nuevoProducto,

            promocion:
                activa,

            descuento:
                activa
                    ? nuevoProducto.descuento
                    : 0
        });


        setErrores({

            ...errores,

            descuento:
                ""
        });
    };


    // CARGO UNA NUEVA IMAGEN

    const handleImagen = (
        e
    ) => {

        const archivo =
            e.target.files[0];


        if (
            archivo
        ) {

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

                    imagen:
                        ""
                });
            };


            lector.readAsDataURL(
                archivo
            );
        }
    };


    // VALIDO Y GUARDO EL PRODUCTO

    const guardarProducto = () => {

        const nuevosErrores = {};


        // NOMBRE

        if (
            nuevoProducto.nombre
                .trim() ===
            ""
        ) {

            nuevosErrores.nombre =
                "El nombre del producto es obligatorio.";

        } else if (
            nuevoProducto.nombre
                .trim()
                .length <
            3
        ) {

            nuevosErrores.nombre =
                "El nombre debe tener al menos 3 caracteres.";
        }


        // CATEGORIA

        if (
            nuevoProducto.categoria ===
            ""
        ) {

            nuevosErrores.categoria =
                "La categoría es obligatoria.";
        }


        // PRECIO

        if (
            nuevoProducto.precio ===
            ""
        ) {

            nuevosErrores.precio =
                "El precio es obligatorio.";

        } else if (
            Number(
                nuevoProducto.precio
            ) <=
            0
        ) {

            nuevosErrores.precio =
                "El precio debe ser mayor a 0.";
        }


        // STOCK

        if (
            nuevoProducto.stock ===
            ""
        ) {

            nuevosErrores.stock =
                "El stock es obligatorio.";

        } else if (
            Number(
                nuevoProducto.stock
            ) <
            0
        ) {

            nuevosErrores.stock =
                "El stock no puede ser negativo.";
        }


        // DESCRIPCION

        if (
            nuevoProducto.descripcion
                .trim() ===
            ""
        ) {

            nuevosErrores.descripcion =
                "La descripción es obligatoria.";

        } else if (
            nuevoProducto.descripcion
                .trim()
                .length <
            10
        ) {

            nuevosErrores.descripcion =
                "La descripción debe tener al menos 10 caracteres.";
        }


        // DESCUENTO

        if (
            nuevoProducto.promocion
        ) {

            const descuento =
                Number(
                    nuevoProducto.descuento
                );


            if (
                !descuento
            ) {

                nuevosErrores.descuento =
                    "Ingresa el porcentaje de descuento.";

            } else if (
                descuento <
                    1 ||
                descuento >
                    90
            ) {

                nuevosErrores.descuento =
                    "El descuento debe estar entre 1% y 90%.";
            }
        }


        // IMAGEN

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
            ).length >
            0
        ) {

            return;
        }


        // ACTUALIZO EL ESTADO SEGUN STOCK

        let estadoFinal =
            nuevoProducto.estado;


        if (
            Number(
                nuevoProducto.stock
            ) ===
            0
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


        const datosProducto = {

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

            promocion:
                nuevoProducto.promocion,

            descuento:
                nuevoProducto.promocion
                    ? Number(
                        nuevoProducto.descuento
                    )
                    : 0,

            estado:
                estadoFinal
        };


        // EDITO EL PRODUCTO

        if (
            productoEditando
        ) {

            actualizarProducto(
                productoEditando.codigo,
                datosProducto
            );

        } else {

            // AGREGO UN PRODUCTO NUEVO

            agregarProductoData(
                datosProducto
            );
        }


        setListaProductos(
            obtenerProductos()
        );


        // LIMPIO EL FORMULARIO

        setNuevoProducto({

            nombre: "",
            categoria: "",
            precio: "",
            stock: "",
            descripcion: "",
            promocion: false,
            descuento: 0,
            estado: "Disponible",
            imagen: ""
        });


        setErrores({});


        setProductoEditando(
            null
        );


        setMostrarFormulario(
            false
        );
    };


    // FILTRO LOS PRODUCTOS

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


    // ELIMINO EL PRODUCTO

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


    // CARGO EL PRODUCTO PARA EDITAR

    const editarProducto = (
        producto
    ) => {

        setProductoEditando(
            producto
        );


        setNuevoProducto({

            nombre:
                producto.nombre,

            categoria:
                producto.categoria,

            precio:
                producto.precio,

            stock:
                producto.stock,

            descripcion:
                producto.descripcion ||
                "",

            promocion:
                producto.promocion ||
                false,

            descuento:
                producto.descuento ||
                0,

            estado:
                producto.estado,

            imagen:
                producto.imagen
        });


        setErrores({});


        setMostrarFormulario(
            true
        );
    };


    // ABRO EL FORMULARIO VACIO

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
            promocion: false,
            descuento: 0,
            estado: "Disponible",
            imagen: ""
        });


        setErrores({});


        setMostrarFormulario(
            true
        );
    };


    // CIERRO EL FORMULARIO

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
            promocion: false,
            descuento: 0,
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
                                DESCRIPCIÓN
                            </th>

                            <th>
                                PRECIO
                            </th>

                            <th>
                                STOCK
                            </th>

                            <th>
                                PROMOCIÓN
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
                                        descripcion={
                                            producto.descripcion
                                        }
                                        precio={
                                            producto.precio
                                        }
                                        stock={
                                            producto.stock
                                        }
                                        promocion={
                                            producto.promocion
                                        }
                                        descuento={
                                            producto.descuento
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

                                <td colSpan="9">
                                    No se encontraron productos.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </section>


            <div className="contenedor-btn-agregar">

                <button
                    type="button"
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

                            {
                                productoEditando
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
                                placeholder="Ej: Hamburguesa Gorila"
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

                            <label htmlFor="descripcion">
                                Descripción
                            </label>


                            <textarea
                                id="descripcion"
                                name="descripcion"
                                rows="4"
                                placeholder="Describe el producto..."
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

                            <label htmlFor="precio">
                                Precio
                            </label>


                            <input
                                id="precio"
                                type="number"
                                name="precio"
                                min="1"
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
                                min="0"
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


                        {/* PROMOCION */}

                        <div className="campo-promocion-producto">

                            <label className="promocion-check">

                                <input
                                    type="checkbox"
                                    checked={
                                        nuevoProducto.promocion
                                    }
                                    onChange={
                                        cambiarPromocion
                                    }
                                />


                                <span>
                                    Producto en promoción
                                </span>

                            </label>


                            {nuevoProducto.promocion && (

                                <div className="campo-formulario">

                                    <label htmlFor="descuento">
                                        Descuento %
                                    </label>


                                    <input
                                        id="descuento"
                                        type="number"
                                        name="descuento"
                                        min="1"
                                        max="90"
                                        placeholder="Ej: 20"
                                        value={
                                            nuevoProducto.descuento
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            errores.descuento
                                                ? "campo-error"
                                                : ""
                                        }
                                    />


                                    {errores.descuento && (

                                        <small className="mensaje-error">
                                            {
                                                errores.descuento
                                            }
                                        </small>

                                    )}

                                </div>

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


                        {/* IMAGEN */}

                        <div className="campo-formulario">

                            <label>
                                Imagen
                            </label>


                            {nuevoProducto.imagen && (

                                <div className="imagen-actual-producto">

                                    <span>
                                        Imagen actual
                                    </span>


                                    <img
                                        src={
                                            nuevoProducto.imagen
                                        }
                                        alt={
                                            nuevoProducto.nombre ||
                                            "Imagen del producto"
                                        }
                                    />

                                </div>

                            )}


                            <label
                                htmlFor="imagen"
                                className="label-nueva-imagen"
                            >
                                {
                                    productoEditando
                                        ? "Seleccionar nueva imagen"
                                        : "Seleccionar imagen"
                                }
                            </label>


                            <input
                                id="imagen"
                                type="file"
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


                            {errores.imagen && (

                                <small className="mensaje-error">
                                    {
                                        errores.imagen
                                    }
                                </small>

                            )}

                        </div>


                        <div className="acciones-formulario">

                            <button
                                type="button"
                                className="btn-cancelar"
                                onClick={
                                    cerrarFormulario
                                }
                            >
                                CANCELAR
                            </button>


                            <button
                                type="button"
                                className="btn-guardar"
                                onClick={
                                    guardarProducto
                                }
                            >

                                {
                                    productoEditando
                                        ? "GUARDAR CAMBIOS"
                                        : "AGREGAR PRODUCTO"
                                }

                            </button>

                        </div>


                    </div>

                </div>

            )}

        </main>
    );
}


export default Productos;