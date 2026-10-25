import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi
} from "vitest";

import {
  render,
  screen,
  fireEvent,
  within,
  cleanup
} from "@testing-library/react";

import Usuarios from "../pages/admin/Usuarios.jsx";
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  agregarUsuario,
  actualizarUsuario,
  eliminarUsuario
} from "../data/usuarios.js";

// Datos ficticios: Vitest los mantiene separados del navegador real.
const usuariosDePrueba = [
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

const renderizarPanel = () => render(<Usuarios />);

// Elegimos los botones dentro de la fila indicada para no confundir
// los botones repetidos de distintas cuentas.
const filaDe = (id) => screen.getByText(`#${id}`).closest("tr");

const editar = (id = 1) => {
  fireEvent.click(
    within(filaDe(id)).getByRole("button", { name: "Editar" })
  );
};

const abrirEliminacion = (id = 1) => {
  fireEvent.click(
    within(filaDe(id)).getByRole("button", { name: "Eliminar" })
  );
};

const modalEliminacion = () =>
  screen.getByRole("heading", { name: "Eliminar usuario" })
    .closest(".modal-confirmar-eliminar");

const cambiar = (etiqueta, valor) => {
  fireEvent.change(screen.getByLabelText(etiqueta), {
    target: { value: valor }
  });
};

const guardarEdicion = () => {
  fireEvent.click(
    screen.getByRole("button", { name: "Guardar cambios" })
  );
};

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("usuarios", JSON.stringify(usuariosDePrueba));
  localStorage.setItem("pedidos", JSON.stringify([]));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Administración de usuarios: operaciones de datos", () => {
  it("1. Obtiene los usuarios almacenados", () => {
    expect(obtenerUsuarios()).toHaveLength(3);
    expect(obtenerUsuarios().map(u => u.correo)).toContain("juan@gmail.com");
  });

  it("2. Busca un usuario existente por su identificador", () => {
    expect(obtenerUsuarioPorId(2).nombre).toBe("María González");
  });

  it("3. Devuelve undefined para un usuario inexistente", () => {
    expect(obtenerUsuarioPorId(999)).toBeUndefined();
  });

  it("4. Crea un cliente con identificador nuevo y lo almacena", () => {
    const creado = agregarUsuario({
      nombre: "Cliente Nuevo",
      correo: "nuevo@gmail.com",
      password: "1234",
      telefono: "+569 55556666",
      direccion: "Calle Nueva 1234, Santiago",
      rol: "Cliente"
    });

    expect(creado.id).toBe(3);
    expect(obtenerUsuarioPorId(3).correo).toBe("nuevo@gmail.com");
    expect(JSON.parse(localStorage.getItem("usuarios"))).toHaveLength(4);
  });

  it("5. Asigna un ID mayor al máximo existente", () => {
    localStorage.setItem("usuarios", JSON.stringify([
      usuariosDePrueba[0],
      { ...usuariosDePrueba[1], id: 10 }
    ]));

    expect(agregarUsuario({ nombre: "Otra persona", rol: "Cliente" }).id)
      .toBe(11);
  });

  it("6. Edita una cuenta sin modificar su identificador", () => {
    actualizarUsuario(1, { nombre: "Juan Actualizado", id: 999 });

    expect(obtenerUsuarioPorId(1).nombre).toBe("Juan Actualizado");
    expect(obtenerUsuarioPorId(999)).toBeUndefined();
  });

  it("7. Elimina una cuenta y conserva las restantes", () => {
    eliminarUsuario(2);

    expect(obtenerUsuarioPorId(2)).toBeUndefined();
    expect(obtenerUsuarios()).toHaveLength(2);
    expect(obtenerUsuarioPorId(0).rol).toBe("Administrador");
  });

  it("8. Ordena al administrador primero, sin importar el almacenamiento", () => {
    localStorage.setItem("usuarios", JSON.stringify([
      usuariosDePrueba[2],
      usuariosDePrueba[1],
      usuariosDePrueba[0]
    ]));

    expect(obtenerUsuarios().map(u => u.id)).toEqual([0, 1, 2]);
  });
});

describe("Administración de usuarios: interfaz React y eventos", () => {
  it("9. Renderiza los tres usuarios con sus datos y roles", () => {
    renderizarPanel();

    expect(screen.getByRole("heading", { name: "USUARIOS" })).toBeTruthy();
    expect(within(filaDe(1)).getByText("Juan Pérez")).toBeTruthy();
    expect(within(filaDe(2)).getByText("maria@gmail.com")).toBeTruthy();
    expect(within(filaDe(0)).getAllByText("Administrador")).toHaveLength(2);
  });

  it("10. No ofrece eliminar al administrador principal", () => {
    renderizarPanel();

    expect(
      within(filaDe(0)).queryByRole("button", { name: "Eliminar" })
    ).toBeNull();
    expect(
      within(filaDe(1)).getByRole("button", { name: "Eliminar" })
    ).toBeTruthy();
  });

  it("11. Filtra los usuarios por nombre sin importar mayúsculas", () => {
    renderizarPanel();
    fireEvent.change(screen.getByPlaceholderText(/Buscar por nombre/), {
      target: { value: "MARÍA" }
    });

    expect(filaDe(2)).toBeTruthy();
    expect(screen.queryByText("#1")).toBeNull();
  });

  it("12. Permite buscar una cuenta por correo", () => {
    renderizarPanel();
    fireEvent.change(screen.getByPlaceholderText(/Buscar por nombre/), {
      target: { value: "juan@gmail.com" }
    });

    expect(filaDe(1)).toBeTruthy();
    expect(screen.queryByText("#2")).toBeNull();
  });

  it("13. Permite buscar una cuenta por dirección", () => {
    renderizarPanel();
    fireEvent.change(screen.getByPlaceholderText(/Buscar por nombre/), {
      target: { value: "Las Rejas" }
    });

    expect(filaDe(2)).toBeTruthy();
    expect(screen.queryByText("#1")).toBeNull();
  });

  it("14. Muestra un mensaje si no encuentra usuarios", () => {
    renderizarPanel();
    fireEvent.change(screen.getByPlaceholderText(/Buscar por nombre/), {
      target: { value: "usuario inexistente" }
    });

    expect(screen.getByText("No se encontraron usuarios.")).toBeTruthy();
  });

  it("15. Permite abrir el detalle de un usuario", () => {
    renderizarPanel();
    fireEvent.click(within(filaDe(1)).getByRole("button", { name: "Ver" }));

    expect(screen.getByRole("heading", { name: "Juan Pérez" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Historial de compras" })).toBeTruthy();
  });

  it("16. Informa cuando un usuario todavía no tiene compras", () => {
    renderizarPanel();
    fireEvent.click(within(filaDe(1)).getByRole("button", { name: "Ver" }));

    expect(screen.getByText("Este usuario no registra compras.")).toBeTruthy();
  });

  it("17. Muestra solo los pedidos correspondientes a ese cliente", () => {
    localStorage.setItem("pedidos", JSON.stringify([
      { codigo: 21, usuarioId: 1, fecha: "24/10/2026", total: 10000 },
      { codigo: 22, usuarioId: 2, fecha: "24/10/2026", total: 20000 }
    ]));
    renderizarPanel();
    fireEvent.click(within(filaDe(1)).getByRole("button", { name: "Ver" }));

    expect(screen.getByText("Pedido #21")).toBeTruthy();
    expect(screen.queryByText("Pedido #22")).toBeNull();
    expect(screen.getByText("1 compra")).toBeTruthy();
  });

  it("18. Cierra el detalle de un usuario al pulsar Cerrar", () => {
    renderizarPanel();
    fireEvent.click(within(filaDe(1)).getByRole("button", { name: "Ver" }));
    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));

    expect(screen.queryByRole("heading", { name: "Historial de compras" }))
      .toBeNull();
  });

  it("19. Abre el formulario con los datos del usuario seleccionado", () => {
    renderizarPanel();
    editar(1);

    expect(screen.getByRole("heading", { name: "Editar usuario" })).toBeTruthy();
    expect(screen.getByLabelText("Nombre").value).toBe("Juan Pérez");
    expect(screen.getByLabelText("Correo").value).toBe("juan@gmail.com");
    expect(screen.getByLabelText("Rol").value).toBe("Cliente");
  });

  it("20. Rechaza un nombre vacío al editar", () => {
    renderizarPanel();
    editar(1);
    cambiar("Nombre", " ");
    guardarEdicion();

    expect(screen.getByText("El nombre es obligatorio")).toBeTruthy();
    expect(obtenerUsuarioPorId(1).nombre).toBe("Juan Pérez");
  });

  it("21. Rechaza nombres con menos de tres caracteres", () => {
    renderizarPanel();
    editar(1);
    cambiar("Nombre", "Jo");
    guardarEdicion();

    expect(screen.getByText("El nombre debe tener al menos 3 caracteres"))
      .toBeTruthy();
  });

  it("22. Rechaza un correo de dominio no permitido", () => {
    renderizarPanel();
    editar(1);
    cambiar("Correo", "juan@otro.com");
    guardarEdicion();

    expect(screen.getByText("El correo debe ser Gmail, Duoc o Duoc UC"))
      .toBeTruthy();
  });

  it("23. Rechaza un correo que pertenece a otro usuario", () => {
    renderizarPanel();
    editar(1);
    cambiar("Correo", "maria@gmail.com");
    guardarEdicion();

    expect(screen.getByText("Este correo ya está registrado")).toBeTruthy();
  });

  it("24. Valida que el teléfono tenga ocho dígitos", () => {
    renderizarPanel();
    editar(1);
    cambiar("Teléfono", "123");
    guardarEdicion();

    expect(screen.getByText("El teléfono debe tener formato +569 12345678"))
      .toBeTruthy();
  });

  it("25. Rechaza una dirección demasiado corta", () => {
    renderizarPanel();
    editar(1);
    cambiar("Dirección", "Calle 1");
    guardarEdicion();

    expect(screen.getByText("La dirección debe tener al menos 10 caracteres"))
      .toBeTruthy();
  });

  it("26. Guarda una edición válida y normaliza los espacios del nombre", () => {
    renderizarPanel();
    editar(1);
    cambiar("Nombre", "  Juan Modificado  ");
    cambiar("Dirección", "Nueva Avenida 1234, Santiago");
    guardarEdicion();

    expect(obtenerUsuarioPorId(1).nombre).toBe("Juan Modificado");
    expect(obtenerUsuarioPorId(1).direccion)
      .toBe("Nueva Avenida 1234, Santiago");
    expect(within(filaDe(1)).getByText("Juan Modificado")).toBeTruthy();
  });

  it("27. Permite cambiar el rol de un cliente a administrador", () => {
    renderizarPanel();
    editar(1);
    cambiar("Rol", "Administrador");
    guardarEdicion();

    expect(obtenerUsuarioPorId(1).rol).toBe("Administrador");
    expect(
      within(filaDe(1)).queryByRole("button", { name: "Eliminar" })
    ).toBeNull();
  });

  it("28. Impide cambiar el rol del administrador principal desde el formulario", () => {
    renderizarPanel();
    editar(0);

    const campoRol = screen.getByLabelText("Rol");
    expect(campoRol.disabled).toBe(true);
    expect(campoRol.value).toBe("Administrador");
  });

  it("29. Permite cancelar una edición sin guardar cambios", () => {
    renderizarPanel();
    editar(1);
    cambiar("Nombre", "Cambio sin guardar");
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(obtenerUsuarioPorId(1).nombre).toBe("Juan Pérez");
    expect(screen.queryByRole("heading", { name: "Editar usuario" }))
      .toBeNull();
  });

  it("30. Solicita confirmación antes de eliminar y permite cancelar", () => {
    renderizarPanel();
    abrirEliminacion(2);

    expect(screen.getByRole("heading", { name: "Eliminar usuario" }))
      .toBeTruthy();
    fireEvent.click(
      within(modalEliminacion()).getByRole("button", { name: "Cancelar" })
    );
    expect(obtenerUsuarioPorId(2)).toBeDefined();
    expect(screen.queryByRole("heading", { name: "Eliminar usuario" }))
      .toBeNull();
  });

  it("31. Elimina al cliente tras confirmar y actualiza la tabla", () => {
    renderizarPanel();
    abrirEliminacion(2);
    fireEvent.click(
      within(modalEliminacion()).getByRole("button", { name: "Eliminar" })
    );

    expect(obtenerUsuarioPorId(2)).toBeUndefined();
    expect(screen.queryByText("#2")).toBeNull();
    expect(obtenerUsuarios()).toHaveLength(2);
  });
});
