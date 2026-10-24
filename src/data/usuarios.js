const usuariosIniciales = [
    {
        id: 0,
        nombre: "Administrador",
        correo: "admin@gmail.com",
        password: "admin123",
        telefono: "+569 11112222",
        direccion: "Av. Principal 1234, Santiago",
        rol: "Administrador"
    },
    {
        id: 1,
        nombre: "Juan Pérez",
        correo: "juan@gmail.com",
        password: "1234",
        telefono: "+569 12345678",
        direccion: "Av. Libertador 1540, Santiago",
        rol: "Cliente"
    },
    {
        id: 2,
        nombre: "María González",
        correo: "maria@gmail.com",
        password: "1234",
        telefono: "+569 87654321",
        direccion: "Las Rejas 2450, Estación Central",
        rol: "Cliente"
    }
];


// CARGO LOS USUARIOS GUARDADOS

const cargarUsuarios = () => {

    const usuariosGuardados =
        localStorage.getItem(
            "usuarios"
        );


    if (
        usuariosGuardados
    ) {

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


// SIEMPRE TRABAJO CON LOS DATOS GUARDADOS

const actualizarDesdeLocalStorage = () => {

    const usuariosGuardados =
        localStorage.getItem(
            "usuarios"
        );


    if (
        usuariosGuardados
    ) {

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


// OBTENGO TODOS LOS USUARIOS

export const obtenerUsuarios = () => {

    actualizarDesdeLocalStorage();


    return [
        ...usuarios
    ].sort(
        (a, b) => {

            // EL ADMIN SIEMPRE VA PRIMERO

            if (
                a.id ===
                0
            ) {

                return -1;
            }


            if (
                b.id ===
                0
            ) {

                return 1;
            }


            return (
                a.id -
                b.id
            );
        }
    );
};


// BUSCO UN USUARIO

export const obtenerUsuarioPorId = (
    id
) => {

    actualizarDesdeLocalStorage();


    return usuarios.find(
        (usuario) =>
            usuario.id ===
            id
    );
};


// AGREGO UN USUARIO

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

        id:
            nuevoId
    };


    usuarios = [
        ...usuarios,
        usuario
    ];


    guardarUsuarios();


    return usuario;
};


// ACTUALIZO UN USUARIO

export const actualizarUsuario = (
    id,
    datosActualizados
) => {

    actualizarDesdeLocalStorage();


    usuarios =
        usuarios.map(
            (usuario) =>
                usuario.id ===
                id
                    ? {
                        ...usuario,
                        ...datosActualizados,
                        id
                    }
                    : usuario
        );


    guardarUsuarios();
};


// ELIMINO UN USUARIO

export const eliminarUsuario = (
    id
) => {

    actualizarDesdeLocalStorage();


    usuarios =
        usuarios.filter(
            (usuario) =>
                usuario.id !==
                id
        );


    guardarUsuarios();
};