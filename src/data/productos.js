const productosIniciales = [
    {
        codigo: 1,
        nombre: "Hamburguesa Clásica",
        categoria: "Hamburguesas",
        precio: 5990,
        stock: 15,
        estado: "Disponible",

        descripcion:
            "Hamburguesa de carne con queso cheddar, lechuga fresca y tomate.",

        imagen:
            "/img/hamburguesa-clasica.png",

        promocion: false,
        descuento: 0
    },

    {
        codigo: 2,
        nombre: "Papa Suprema",
        categoria: "Papas",
        precio: 8990,
        stock: 20,
        estado: "Disponible",

        descripcion:
            "Papas fritas con queso cheddar, tomate, carne y cebollín.",

        imagen:
            "/img/papa-suprema.png",

        promocion: false,
        descuento: 0
    },

    {
        codigo: 3,
        nombre: "Fajita Italiana",
        categoria: "Fajitas",
        precio: 4990,
        stock: 10,
        estado: "Disponible",

        descripcion:
            "Fajita rellena con carne, tomate, palta y mayonesa.",

        imagen:
            "/img/fajita-italiana.png",

        promocion: false,
        descuento: 0
    }
];


// COMPLETO DATOS ANTIGUOS

const normalizarProducto = (
    producto
) => {

    return {

        ...producto,

        descripcion:
            producto.descripcion ||
            "Producto disponible en El Bajón del Gorila.",

        promocion:
            producto.promocion ??
            false,

        descuento:
            producto.descuento ??
            0
    };
};


// CARGO LOS PRODUCTOS

const cargarProductos = () => {

    const productosGuardados =
        localStorage.getItem(
            "productos"
        );


    if (
        productosGuardados
    ) {

        return JSON.parse(
            productosGuardados
        ).map(
            normalizarProducto
        );
    }


    localStorage.setItem(
        "productos",
        JSON.stringify(
            productosIniciales
        )
    );


    return [
        ...productosIniciales
    ];
};


let productos =
    cargarProductos();


// ACTUALIZO DESDE LOCALSTORAGE

const actualizarDesdeLocalStorage = () => {

    const productosGuardados =
        localStorage.getItem(
            "productos"
        );


    if (
        productosGuardados
    ) {

        productos =
            JSON.parse(
                productosGuardados
            ).map(
                normalizarProducto
            );
    }
};


// GUARDO LOS PRODUCTOS

const guardarProductos = () => {

    localStorage.setItem(
        "productos",
        JSON.stringify(
            productos
        )
    );
};


// CALCULO EL PRECIO FINAL

export const obtenerPrecioFinal = (
    producto
) => {

    if (
        !producto.promocion ||
        !producto.descuento
    ) {

        return producto.precio;
    }


    const descuento =
        producto.precio *
        (
            producto.descuento /
            100
        );


    return Math.round(
        producto.precio -
        descuento
    );
};


// OBTENGO LOS PRODUCTOS

export const obtenerProductos = () => {

    actualizarDesdeLocalStorage();


    return productos.map(
        normalizarProducto
    );
};


// BUSCO UN PRODUCTO

export const obtenerProductoPorCodigo = (
    codigo
) => {

    actualizarDesdeLocalStorage();


    return productos.find(
        (producto) =>
            producto.codigo ===
            codigo
    );
};


// AGREGO UN PRODUCTO

export const agregarProducto = (
    nuevoProducto
) => {

    actualizarDesdeLocalStorage();


    const codigoNuevo =
        Math.max(
            ...productos.map(
                (producto) =>
                    producto.codigo
            ),
            0
        ) + 1;


    const producto = {

        ...nuevoProducto,

        codigo:
            codigoNuevo,

        promocion:
            nuevoProducto.promocion ??
            false,

        descuento:
            nuevoProducto.descuento ??
            0
    };


    productos = [
        ...productos,
        producto
    ];


    guardarProductos();


    return producto;
};


// ACTUALIZO UN PRODUCTO

export const actualizarProducto = (
    codigo,
    datosActualizados
) => {

    actualizarDesdeLocalStorage();


    productos =
        productos.map(
            (producto) =>
                producto.codigo ===
                codigo
                    ? {
                        ...producto,
                        ...datosActualizados,
                        codigo
                    }
                    : producto
        );


    guardarProductos();
};


// ELIMINO UN PRODUCTO

export const eliminarProducto = (
    codigo
) => {

    actualizarDesdeLocalStorage();


    productos =
        productos.filter(
            (producto) =>
                producto.codigo !==
                codigo
        );


    guardarProductos();
};