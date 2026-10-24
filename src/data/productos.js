const productosIniciales = [
    {
        codigo: 1,
        nombre: "Hamburguesa Gorila",
        categoria: "Hamburguesas",
        precio: 8990,
        stock: 15,
        estado: "Disponible",
        imagen: "/img/gorila-burger.png"
    },
    {
        codigo: 2,
        nombre: "Papas Fritas",
        categoria: "Papas",
        precio: 3500,
        stock: 20,
        estado: "Disponible",
        imagen: "/img/papas.png"
    },
    {
        codigo: 3,
        nombre: "Fajita Texas",
        categoria: "Fajitas",
        precio: 6000,
        stock: 10,
        estado: "Disponible",
        imagen: "/img/fajita-texas.png"
    }
];


// CARGAR PRODUCTOS

const cargarProductos = () => {

    const productosGuardados =
        localStorage.getItem("productos");

    if (productosGuardados) {
        return JSON.parse(productosGuardados);
    }

    localStorage.setItem(
        "productos",
        JSON.stringify(productosIniciales)
    );

    return [...productosIniciales];
};


let productos = cargarProductos();


// GUARDAR PRODUCTOS

const guardarProductos = () => {

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );
};


// LEER PRODUCTOS

export const obtenerProductos = () => {
    return [...productos];
};


// AGREGAR PRODUCTO

export const agregarProducto = (nuevoProducto) => {

    const codigoNuevo =
        Math.max(
            ...productos.map(
                (producto) => producto.codigo
            ),
            0
        ) + 1;

    const producto = {
        ...nuevoProducto,
        codigo: codigoNuevo
    };

    productos = [
        ...productos,
        producto
    ];

    guardarProductos();

    return producto;
};


// ACTUALIZAR PRODUCTO

export const actualizarProducto = (
    codigo,
    datosActualizados
) => {

    productos = productos.map((producto) =>
        producto.codigo === codigo
            ? {
                ...producto,
                ...datosActualizados,
                codigo: codigo
            }
            : producto
    );

    guardarProductos();
};


// ELIMINAR PRODUCTO

export const eliminarProducto = (codigo) => {

    productos = productos.filter(
        (producto) =>
            producto.codigo !== codigo
    );

    guardarProductos();
};

