const pedidosIniciales = [
    {
        codigo: 1,
        usuarioId: 1,
        cliente: "Juan Pérez",
        fecha: "24/10/2026",
        hora: "13:15",
        medioPago: "Débito",
        neto: 12597,
        iva: 2393,
        total: 14990,

        productos: [
            {
                codigoProducto: 1,
                nombre: "Hamburguesa Gorila",
                cantidad: 1,
                precio: 8990
            },
            {
                codigoProducto: 3,
                nombre: "Fajita Texas",
                cantidad: 1,
                precio: 6000
            }
        ]
    },

    {
        codigo: 2,
        usuarioId: 2,
        cliente: "María González",
        fecha: "24/10/2026",
        hora: "13:42",
        medioPago: "Transferencia",
        neto: 5882,
        iva: 1118,
        total: 7000,

        productos: [
            {
                codigoProducto: 2,
                nombre: "Papas Fritas",
                cantidad: 2,
                precio: 3500
            }
        ]
    }
];


const cargarPedidos = () => {

    const pedidosGuardados =
        localStorage.getItem(
            "pedidos"
        );


    if (pedidosGuardados) {

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


const actualizarDesdeLocalStorage = () => {

    const pedidosGuardados =
        localStorage.getItem(
            "pedidos"
        );


    if (pedidosGuardados) {

        pedidos =
            JSON.parse(
                pedidosGuardados
            );
    }
};


const guardarPedidos = () => {

    localStorage.setItem(
        "pedidos",
        JSON.stringify(
            pedidos
        )
    );
};


// LEER TODOS LOS PEDIDOS

export const obtenerPedidos = () => {

    actualizarDesdeLocalStorage();

    return [
        ...pedidos
    ];
};


// BUSCAR UN PEDIDO POR CODIGO

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


// CREAR PEDIDO

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
        codigo: codigoNuevo
    };


    pedidos = [
        ...pedidos,
        pedido
    ];


    guardarPedidos();


    return pedido;
};