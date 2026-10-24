const obtenerUsuarioActualId = () => {

    const usuarioActualId =
        localStorage.getItem(
            "usuarioActualId"
        );

    return usuarioActualId !== null
        ? Number(usuarioActualId)
        : null;
};


const obtenerClaveCarrito = () => {

    const usuarioId =
        obtenerUsuarioActualId();


    if (usuarioId === null) {

        return "carrito_invitado";
    }


    return `carrito_${usuarioId}`;
};


const avisarCambioCarrito = () => {

    window.dispatchEvent(
        new Event(
            "carritoActualizado"
        )
    );
};


export const obtenerCarrito = () => {

    const claveCarrito =
        obtenerClaveCarrito();


    const carritoGuardado =
        localStorage.getItem(
            claveCarrito
        );


    if (!carritoGuardado) {

        return [];
    }


    return JSON.parse(
        carritoGuardado
    );
};


const guardarCarrito = (
    carrito
) => {

    const claveCarrito =
        obtenerClaveCarrito();


    localStorage.setItem(
        claveCarrito,
        JSON.stringify(
            carrito
        )
    );


    avisarCambioCarrito();
};


export const agregarAlCarrito = (
    producto
) => {

    const carrito =
        obtenerCarrito();


    const productoExistente =
        carrito.find(
            (item) =>
                item.codigo ===
                producto.codigo
        );


    if (productoExistente) {

        const carritoActualizado =
            carrito.map((item) => {

                if (
                    item.codigo ===
                    producto.codigo
                ) {

                    return {
                        ...item,
                        cantidad:
                            item.cantidad + 1
                    };
                }


                return item;
            });


        guardarCarrito(
            carritoActualizado
        );


        return carritoActualizado;
    }


    const nuevoProducto = {

        codigo:
            producto.codigo,

        nombre:
            producto.nombre,

        precio:
            producto.precio,

        imagen:
            producto.imagen,

        stock:
            producto.stock,

        cantidad: 1
    };


    const carritoActualizado = [
        ...carrito,
        nuevoProducto
    ];


    guardarCarrito(
        carritoActualizado
    );


    return carritoActualizado;
};


export const cambiarCantidad = (
    codigo,
    nuevaCantidad
) => {

    const carrito =
        obtenerCarrito();


    const carritoActualizado =
        carrito.map((item) => {

            if (
                item.codigo ===
                codigo
            ) {

                return {
                    ...item,
                    cantidad:
                        nuevaCantidad
                };
            }


            return item;
        });


    guardarCarrito(
        carritoActualizado
    );


    return carritoActualizado;
};


export const eliminarDelCarrito = (
    codigo
) => {

    const carrito =
        obtenerCarrito();


    const carritoActualizado =
        carrito.filter(
            (item) =>
                item.codigo !==
                codigo
        );


    guardarCarrito(
        carritoActualizado
    );


    return carritoActualizado;
};


export const vaciarCarrito = () => {

    const claveCarrito =
        obtenerClaveCarrito();


    localStorage.removeItem(
        claveCarrito
    );


    avisarCambioCarrito();
};


export const obtenerCantidadCarrito = () => {

    return obtenerCarrito()
        .reduce(
            (total, item) =>
                total +
                item.cantidad,
            0
        );
};


// CAMBIO: paso el carrito invitado a la cuenta cuando inicia sesion

export const pasarCarritoInvitado = (
    usuarioId
) => {

    const carritoInvitadoGuardado =
        localStorage.getItem(
            "carrito_invitado"
        );


    if (!carritoInvitadoGuardado) {
        return;
    }


    const carritoInvitado =
        JSON.parse(
            carritoInvitadoGuardado
        );


    if (
        carritoInvitado.length === 0
    ) {

        localStorage.removeItem(
            "carrito_invitado"
        );

        return;
    }


    const claveUsuario =
        `carrito_${usuarioId}`;


    const carritoUsuarioGuardado =
        localStorage.getItem(
            claveUsuario
        );


    const carritoUsuario =
        carritoUsuarioGuardado
            ? JSON.parse(
                carritoUsuarioGuardado
            )
            : [];


    const carritoFinal = [
        ...carritoUsuario
    ];


    carritoInvitado.forEach(
        (productoInvitado) => {

            const productoExistente =
                carritoFinal.find(
                    (item) =>
                        item.codigo ===
                        productoInvitado.codigo
                );


            if (productoExistente) {

                productoExistente.cantidad +=
                    productoInvitado.cantidad;

            } else {

                carritoFinal.push(
                    productoInvitado
                );
            }
        }
    );


    localStorage.setItem(
        claveUsuario,
        JSON.stringify(
            carritoFinal
        )
    );


    localStorage.removeItem(
        "carrito_invitado"
    );


    avisarCambioCarrito();
};