const usuariosIniciales = [
    {
        id: 0,
        nombre: "Administrador",
        correo: "admin@gmail.com",
        password: "admin123",
        telefono: "+569 11112222",
        rol: "Administrador"
    },
    {
        id: 1,
        nombre: "Juan Pérez",
        correo: "juan@gmail.com",
        password: "1234",
        telefono: "+569 12345678",
        rol: "Cliente"
    },
    {
        id: 2,
        nombre: "María González",
        correo: "maria@gmail.com",
        password: "1234",
        telefono: "+569 87654321",
        rol: "Cliente"
    }
];


const cargarUsuarios = () => {

    const usuariosGuardados =
        localStorage.getItem(
            "usuarios"
        );


    if (usuariosGuardados) {

        return JSON.parse(
            usuariosGuardados
        );
    }


    localStorage.setItem(
        "usuarios",
        JSON.stringify(
            usuariosIniciales
        )
    );


    return [
        ...usuariosIniciales
    ];
};


let usuarios =
    cargarUsuarios();


// CAMBIO: siempre trabajo con los usuarios guardados realmente

const actualizarDesdeLocalStorage = () => {

    const usuariosGuardados =
        localStorage.getItem(
            "usuarios"
        );


    if (usuariosGuardados) {

        usuarios =
            JSON.parse(
                usuariosGuardados
            );

    } else {

        usuarios = [
            ...usuariosIniciales
        ];


        localStorage.setItem(
            "usuarios",
            JSON.stringify(
                usuariosIniciales
            )
        );
    }
};


const guardarUsuarios = () => {

    localStorage.setItem(
        "usuarios",
        JSON.stringify(
            usuarios
        )
    );
};


export const obtenerUsuarios = () => {

    actualizarDesdeLocalStorage();


    return [...usuarios].sort(
        (a, b) => {

            if (a.id === 0) {
                return -1;
            }


            if (b.id === 0) {
                return 1;
            }


            return a.id - b.id;
        }
    );
};


export const obtenerUsuarioPorId = (
    id
) => {

    actualizarDesdeLocalStorage();


    return usuarios.find(
        (usuario) =>
            usuario.id === id
    );
};


export const agregarUsuario = (
    nuevoUsuario
) => {

    actualizarDesdeLocalStorage();


    const nuevoId =
        Math.max(
            ...usuarios.map(
                (usuario) =>
                    usuario.id
            ),
            0
        ) + 1;


    const usuario = {
        ...nuevoUsuario,
        id: nuevoId
    };


    usuarios = [
        ...usuarios,
        usuario
    ];


    guardarUsuarios();


    return usuario;
};


export const actualizarUsuario = (
    id,
    datosActualizados
) => {

    actualizarDesdeLocalStorage();


    usuarios =
        usuarios.map(
            (usuario) =>
                usuario.id === id
                    ? {
                        ...usuario,
                        ...datosActualizados,
                        id
                    }
                    : usuario
        );


    guardarUsuarios();
};


export const eliminarUsuario = (
    id
) => {

    actualizarDesdeLocalStorage();


    usuarios =
        usuarios.filter(
            (usuario) =>
                usuario.id !== id
        );


    guardarUsuarios();
};