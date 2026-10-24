const pedidosIniciales = [
    {
        codigo: 1,
        usuarioId: 1,
        cliente: "Juan Pérez",
        correo: "juan@gmail.com",
        telefono: "+569 12345678",

        fecha: "24/10/2026",
        hora: "13:15",

        tipoEntrega: "Delivery",
        direccion: "Av. Libertador 1540, Santiago",
        comuna: "Santiago",
        referencia: "Casa con portón negro",

        medioPago: "Tarjeta",

        subtotal: 10980,
        costoDelivery: 2000,

        neto: 10908,
        iva: 2072,
        total: 12980,

        productos: [
            {
                codigoProducto: 1,
                nombre: "Hamburguesa Clásica",
                cantidad: 1,
                precio: 5990,
                imagen: "/img/hamburguesa-clasica.png"
            },
            {
                codigoProducto: 3,
                nombre: "Fajita Italiana",
                cantidad: 1,
                precio: 4990,
                imagen: "/img/fajita-italiana.png"
            }
        ]
    },

    {
        codigo: 2,
        usuarioId: 2,
        cliente: "María González",
        correo: "maria@gmail.com",
        telefono: "+569 87654321",

        fecha: "24/10/2026",
        hora: "13:42",

        tipoEntrega: "Retiro en local",
        direccion: "Retiro en local",
        comuna: "",
        referencia: "",

        medioPago: "Efectivo",

        subtotal: 8990,
        costoDelivery: 0,

        neto: 7555,
        iva: 1435,
        total: 8990,

        productos: [
            {
                codigoProducto: 2,
                nombre: "Papa Suprema",
                cantidad: 1,
                precio: 8990,
                imagen: "/img/papa-suprema.png"
            }
        ]
    }
];


// CARGO LOS PEDIDOS

const cargarPedidos = () => {

    const pedidosGuardados =
        localStorage.getItem(
            "pedidos"
        );


    if (
        pedidosGuardados
    ) {

        return JSON.parse(
            pedidosGuardados
        );
    }


    localStorage.setItem(
        "pedidos",
        JSON.stringify(
            pedidosIniciales
        )
    );


    return [
        ...pedidosIniciales
    ];
};


let pedidos =
    cargarPedidos();


// ACTUALIZO DESDE LOCALSTORAGE

const actualizarDesdeLocalStorage = () => {

    const pedidosGuardados =
        localStorage.getItem(
            "pedidos"
        );


    if (
        pedidosGuardados
    ) {

        pedidos =
            JSON.parse(
                pedidosGuardados
            );
    }
};


// GUARDO LOS PEDIDOS

const guardarPedidos = () => {

    localStorage.setItem(
        "pedidos",
        JSON.stringify(
            pedidos
        )
    );
};


// OBTENGO TODOS LOS PEDIDOS

export const obtenerPedidos = () => {

    actualizarDesdeLocalStorage();


    return [
        ...pedidos
    ];
};


// BUSCO UN PEDIDO

export const obtenerPedidoPorCodigo = (
    codigo
) => {

    actualizarDesdeLocalStorage();


    return pedidos.find(
        (pedido) =>
            pedido.codigo ===
            codigo
    );
};


// CREO UN PEDIDO

export const crearPedido = (
    nuevoPedido
) => {

    actualizarDesdeLocalStorage();


    const codigoNuevo =
        Math.max(
            ...pedidos.map(
                (pedido) =>
                    pedido.codigo
            ),
            0
        ) + 1;


    const pedido = {

        ...nuevoPedido,

        codigo:
            codigoNuevo
    };


    pedidos = [
        ...pedidos,
        pedido
    ];


    guardarPedidos();


    return pedido;
};