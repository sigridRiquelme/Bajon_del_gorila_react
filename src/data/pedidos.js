const pedidosIniciales = [
    {
        codigo: 1,
        cliente: "Juan Pérez",
        fecha: "2026-10-13",
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
        cliente: "María González",
        fecha: "2026-10-13",
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
        localStorage.getItem("pedidos");

    if (pedidosGuardados) {
        return JSON.parse(pedidosGuardados);
    }

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidosIniciales)
    );

    return [...pedidosIniciales];
};


let pedidos = cargarPedidos();


const guardarPedidos = () => {

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );
};

// LEER TODOS LOS PEDIDOS

export const obtenerPedidos = () => {
    return [...pedidos];
};


// BUSCAR UN PEDIDO POR CÓDIGO

export const obtenerPedidoPorCodigo = (codigo) => {
    return pedidos.find(
        (pedido) => pedido.codigo === codigo
    );
};


// CREAR PEDIDO

export const crearPedido = (nuevoPedido) => {

    const codigoNuevo =
        Math.max(
            ...pedidos.map(
                (pedido) => pedido.codigo
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
