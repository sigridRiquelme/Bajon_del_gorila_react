const usuariosIniciales = [
    {
        id: 0,
        nombre: "Administrador",
        correo: "admin@bajondelgorila.cl",
        telefono: "+56911112222",
        rol: "Administrador"
    },
    {
        id: 1,
        nombre: "Juan Pérez",
        correo: "juan@gmail.com",
        telefono: "+56912345678",
        rol: "Cliente"
    },
    {
        id: 2,
        nombre: "María González",
        correo: "maria@gmail.com",
        telefono: "+56987654321",
        rol: "Cliente"
    }
];


const cargarUsuarios = () => {

    const usuariosGuardados = localStorage.getItem("usuarios");

    if (usuariosGuardados) {
        return JSON.parse(usuariosGuardados);
    }

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuariosIniciales)
    );

    return [...usuariosIniciales];
};


let usuarios = cargarUsuarios();


const guardarUsuarios = () => {
    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );
};


export const obtenerUsuarios = () => {

    return [...usuarios].sort((a, b) => {

        if (a.id === 0) {
            return -1;
        }

        if (b.id === 0) {
            return 1;
        }

        return a.id - b.id;
    });
};

export const obtenerUsuarioPorId = (id) => {
    return usuarios.find(
        (usuario) => usuario.id === id
    );
};


export const agregarUsuario = (nuevoUsuario) => {

    const nuevoId =
        Math.max(
            ...usuarios.map((usuario) => usuario.id),
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

    usuarios = usuarios.map((usuario) =>
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


export const eliminarUsuario = (id) => {

    usuarios = usuarios.filter(
        (usuario) => usuario.id !== id
    );

    guardarUsuarios();
};