import {
    useEffect,
    useState
} from "react";

import "../../styles/productos.css";

import ProductoFila
    from "../../components/admin/ProductoFila.jsx";

import {
    actualizarProductoApi,
    crearProductoApi,
    eliminarProductoApi,
    obtenerProductosApi
} from "../../api/productos.js";

import {
    crearCategoriaApi,
    obtenerCategoriasApi
} from "../../api/categorias.js";

import {
    subirImagenProductoApi
} from "../../api/imagenes.js";


const productoVacio = {

    nombre: "",

    categoriaId: "",

    precio: "",

    stock: "",

    descripcion: "",

    promocion: false,

    descuento: 0,

    estado: "Disponible",

    imagen: ""
};


function Productos() {

    const [
        listaProductos,
        setListaProductos
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
        busqueda,
        setBusqueda
    ] = useState("");


    const [
        categoria,
        setCategoria
    ] = useState("Todas");


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
        mensaje,
        setMensaje
    ] = useState("");


    const [
        hayError,
        setHayError
    ] = useState(false);


    const [
        nuevoProducto,
        setNuevoProducto
    ] = useState({
        ...productoVacio
    });


    const [
        nuevaCategoria,
        setNuevaCategoria
    ] = useState("");


    const [
        errorCategoria,
        setErrorCategoria
    ] = useState("");


    const [
        subiendoImagen,
        setSubiendoImagen
    ] = useState(false);


    const [
        errorImagen,
        setErrorImagen
    ] = useState("");


    const rol =
        localStorage.getItem(
            "usuarioRol"
        );


    const esAdministrador =
        rol ===
        "ADMINISTRADOR";


    // CARGO PRODUCTOS Y CATEGORIAS

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


            setListaProductos(
                productosApi
            );


            setCategorias(
                categoriasApi
            );


            setHayError(
                false
            );

        } catch (
            error
        ) {

            console.error(
                error
            );


            setMensaje(
                "No fue posible cargar los productos."
            );


            setHayError(
                true
            );

        } finally {

            setCargando(
                false
            );
        }
    };


    useEffect(() => {

        cargarDatos();

    }, []);


    // ACTUALIZO CAMPOS

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


    // PROMOCION

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


    // CREAR CATEGORIA

    const agregarCategoria = async () => {

        setErrorCategoria("");

        setMensaje("");


        const nombre =
            nuevaCategoria.trim();


        if (
            nombre.length <
            2
        ) {

            setErrorCategoria(
                "Ingresa un nombre válido para la categoría."
            );

            return;
        }


        const categoriaExiste =
            categorias.some(
                (item) =>
                    item.nombre
                        .toLowerCase() ===
                    nombre.toLowerCase()
            );


        if (
            categoriaExiste
        ) {

            setErrorCategoria(
                "La categoría ya existe."
            );

            return;
        }


        try {

            const categoriaCreada =
                await crearCategoriaApi(
                    nombre
                );


            setCategorias([
                ...categorias,
                categoriaCreada
            ]);


            setNuevaCategoria("");


            setMensaje(
                "Categoría creada correctamente."
            );


            setHayError(
                false
            );

        } catch (
            error
        ) {

            setErrorCategoria(
                error.response
                    ?.data
                    ?.mensaje ||
                "No fue posible crear la categoría."
            );
        }
    };


    // SELECCIONO Y SUBO IMAGEN

    const seleccionarImagen = async (
        e
    ) => {

        const archivo =
            e.target.files?.[0];


        setErrorImagen("");


        if (
            !archivo
        ) {

            return;
        }


        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (
            !tiposPermitidos.includes(
                archivo.type
            )
        ) {

            setErrorImagen(
                "Solo puedes seleccionar imágenes JPG, PNG o WEBP."
            );


            e.target.value = "";

            return;
        }


        if (
            archivo.size >
            5 * 1024 * 1024
        ) {

            setErrorImagen(
                "La imagen no puede superar los 5 MB."
            );


            e.target.value = "";

            return;
        }


        try {

            setSubiendoImagen(
                true
            );


            const url =
                await subirImagenProductoApi(
                    archivo
                );


            setNuevoProducto(
                (
                    productoActual
                ) => ({

                    ...productoActual,

                    imagen:
                        url
                })
            );


        } catch (
            error
        ) {

            console.error(
                error
            );


            setErrorImagen(
                error.response
                    ?.data
                    ?.mensaje ||
                "No fue posible subir la imagen."
            );

        } finally {

            setSubiendoImagen(
                false
            );


            e.target.value = "";
        }
    };


    // VALIDO PRODUCTO

    const validarProducto = () => {

        const nuevosErrores = {};


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


        if (
            nuevoProducto.categoriaId ===
            ""
        ) {

            nuevosErrores.categoriaId =
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
            ) <=
            0
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
            ) <
            0
        ) {

            nuevosErrores.stock =
                "El stock no puede ser negativo.";
        }


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


        if (
            nuevoProducto.promocion
        ) {

            const descuento =
                Number(
                    nuevoProducto.descuento
                );


            if (
                descuento <
                    1 ||
                descuento >
                    100
            ) {

                nuevosErrores.descuento =
                    "El descuento debe estar entre 1% y 100%.";
            }
        }


        setErrores(
            nuevosErrores
        );


        return (
            Object.keys(
                nuevosErrores
            ).length ===
            0
        );
    };


    // GUARDO PRODUCTO

    const guardarProducto = async () => {

        setMensaje("");


        if (
            subiendoImagen
        ) {

            setMensaje(
                "Espera a que termine de subir la imagen."
            );


            setHayError(
                true
            );

            return;
        }


        if (
            !validarProducto()
        ) {

            return;
        }


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
            estadoFinal ===
            "Sin stock"
        ) {

            estadoFinal =
                "Disponible";
        }


        const datosProducto = {

            nombre:
                nuevoProducto.nombre
                    .trim(),

            categoriaId:
                Number(
                    nuevoProducto.categoriaId
                ),

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
                estadoFinal,

            imagen:
                nuevoProducto.imagen
                    .trim() ||
                null
        };


        try {

            if (
                productoEditando
            ) {

                await actualizarProductoApi(
                    productoEditando.codigo,
                    datosProducto
                );


                setMensaje(
                    "Producto actualizado correctamente."
                );

            } else {

                await crearProductoApi(
                    datosProducto
                );


                setMensaje(
                    "Producto creado correctamente."
                );
            }


            setHayError(
                false
            );


            await cargarDatos();


            setNuevoProducto({
                ...productoVacio
            });


            setErrores({});

            setErrorImagen("");


            setProductoEditando(
                null
            );


            setMostrarFormulario(
                false
            );

        } catch (
            error
        ) {

            console.error(
                error
            );


            setMensaje(
                error.response
                    ?.data
                    ?.mensaje ||
                "No fue posible guardar el producto."
            );


            setHayError(
                true
            );
        }
    };


    // ELIMINO PRODUCTO

    const eliminarProducto = async (
        codigo
    ) => {

        setMensaje("");


        try {

            await eliminarProductoApi(
                codigo
            );


            setMensaje(
                "Producto eliminado correctamente."
            );


            setHayError(
                false
            );


            await cargarDatos();

        } catch (
            error
        ) {

            console.error(
                error
            );


            setMensaje(
                error.response
                    ?.data
                    ?.mensaje ||
                "No fue posible eliminar el producto."
            );


            setHayError(
                true
            );
        }
    };


    // CARGO PRODUCTO PARA EDITAR

    const editarProducto = (
        producto
    ) => {

        setProductoEditando(
            producto
        );


        setNuevoProducto({

            nombre:
                producto.nombre,

            categoriaId:
                producto.categoriaId,

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
                producto.imagenBackend ||
                ""
        });


        setErrores({});

        setErrorImagen("");

        setMensaje("");


        setMostrarFormulario(
            true
        );
    };


    // ABRO FORMULARIO

    const abrirFormulario = () => {

        setProductoEditando(
            null
        );


        setNuevoProducto({
            ...productoVacio
        });


        setErrores({});

        setErrorImagen("");

        setMensaje("");


        setMostrarFormulario(
            true
        );
    };


    // CIERRO FORMULARIO

    const cerrarFormulario = () => {

        if (
            subiendoImagen
        ) {

            return;
        }


        setMostrarFormulario(
            false
        );


        setProductoEditando(
            null
        );


        setErrores({});

        setErrorImagen("");


        setNuevoProducto({
            ...productoVacio
        });
    };


    // FILTROS

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


    return (

        <main className="productos-admin">


            <header className="encabezado-productos">

                <div>

                    <h1>
                        PRODUCTOS
                    </h1>


                    <p>

                        {
                            cargando
                                ? "Cargando..."
                                : `${productosFiltrados.length} productos`
                        }

                    </p>

                </div>

            </header>


            {mensaje && (

                <div
                    className={
                        hayError
                            ? "mensaje-menu error"
                            : "mensaje-menu"
                    }
                >

                    {
                        mensaje
                    }

                </div>

            )}


            {esAdministrador && (

                <section className="filtros-productos filtros-categoria">

                    <input
                        type="text"
                        placeholder="Nueva categoría..."
                        value={
                            nuevaCategoria
                        }
                        onChange={(e) => {

                            setNuevaCategoria(
                                e.target.value
                            );


                            setErrorCategoria(
                                ""
                            );
                        }}
                    />


                    <button
                        type="button"
                        className="btn-agregar"
                        onClick={
                            agregarCategoria
                        }
                    >
                        + AGREGAR CATEGORÍA
                    </button>


                    {errorCategoria && (

                        <small className="mensaje-error">

                            {
                                errorCategoria
                            }

                        </small>

                    )}

                </section>

            )}


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

                        {!cargando &&
                        productosFiltrados.length >
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

                                        categoriaId={
                                            producto.categoriaId
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

                                        imagenBackend={
                                            producto.imagenBackend
                                        }

                                        onEliminar={
                                            eliminarProducto
                                        }

                                        onEditar={
                                            editarProducto
                                        }

                                        puedeEditar={
                                            esAdministrador
                                        }
                                    />

                                )
                            )

                        ) : !cargando && (

                            <tr>

                                <td colSpan="9">
                                    No se encontraron productos.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </section>


            {esAdministrador && (

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

            )}


            {mostrarFormulario &&
            esAdministrador && (

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

                            <label htmlFor="categoriaId">
                                Categoría
                            </label>


                            <select
                                id="categoriaId"
                                name="categoriaId"
                                value={
                                    nuevoProducto.categoriaId
                                }
                                onChange={
                                    handleChange
                                }
                                className={
                                    errores.categoriaId
                                        ? "campo-error"
                                        : ""
                                }
                            >

                                <option value="">
                                    Seleccione categoría
                                </option>


                                {categorias.map(
                                    (item) => (

                                        <option
                                            key={
                                                item.id
                                            }
                                            value={
                                                item.id
                                            }
                                        >
                                            {
                                                item.nombre
                                            }
                                        </option>

                                    )
                                )}

                            </select>


                            {errores.categoriaId && (

                                <small className="mensaje-error">
                                    {
                                        errores.categoriaId
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
                                        max="100"
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


                        <div className="campo-formulario">

                            <label htmlFor="imagen">
                                Imagen del producto
                            </label>


                            {nuevoProducto.imagen && (

                                <div className="imagen-actual-producto">

                                    <span>
                                        Vista previa
                                    </span>


                                    <img
                                        src={
                                            nuevoProducto.imagen
                                        }
                                        alt="Vista previa del producto"
                                    />

                                </div>

                            )}


                            <input
                                id="imagen"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={
                                    seleccionarImagen
                                }
                                disabled={
                                    subiendoImagen
                                }
                            />


                            {subiendoImagen && (

                                <small className="mensaje-subiendo-imagen">
                                    Subiendo imagen...
                                </small>

                            )}


                            {errorImagen && (

                                <small className="mensaje-error">
                                    {
                                        errorImagen
                                    }
                                </small>

                            )}


                            <small className="ayuda-imagen-producto">
                                Formatos permitidos: JPG, PNG o WEBP. Máximo 5 MB.
                            </small>

                        </div>


                        <div className="acciones-formulario">

                            <button
                                type="button"
                                className="btn-cancelar"
                                onClick={
                                    cerrarFormulario
                                }
                                disabled={
                                    subiendoImagen
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
                                disabled={
                                    subiendoImagen
                                }
                            >

                                {
                                    subiendoImagen
                                        ? "SUBIENDO IMAGEN..."
                                        : productoEditando
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