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
  cleanup,
  within
} from "@testing-library/react";

import Usuarios from "../pages/admin/Usuarios.jsx";
import {
  obtenerUsuariosApi,
  crearUsuarioAdministrativoApi,
  cambiarRolUsuarioApi,
  eliminarUsuarioApi
} from "../api/usuarios.js";
import { obtenerPedidosConDetallesApi } from "../api/pedidos.js";

vi.mock("../api/usuarios.js", () => ({
  obtenerUsuariosApi: vi.fn(),
  obtenerUsuarioPorIdApi: vi.fn(),
  crearUsuarioAdministrativoApi: vi.fn(),
  cambiarRolUsuarioApi: vi.fn(),
  eliminarUsuarioApi: vi.fn()
}));

vi.mock("../api/pedidos.js", () => ({
  obtenerPedidosConDetallesApi: vi.fn(),
  obtenerPedidosApi: vi.fn(),
  obtenerDetallePedidoApi: vi.fn(),
  obtenerMisPedidosApi: vi.fn(),
  crearPedidoApi: vi.fn()
}));

const usuarios = [
  {
    id: 1,
    nombre: "Administrador Principal",
    correo: "admin@gmail.com",
    telefono: "+569 11112222",
    direccion: "Av. Principal 1234, Santiago",
    rol: "Administrador",
    rolBackend: "ADMINISTRADOR",
    administradorPrincipal: true
  },
  {
    id: 2,
    nombre: "Juan Pérez",
    correo: "juan@gmail.com",
    telefono: "+569 12345678",
    direccion: "Av. Libertador 1540, Santiago",
    rol: "Cliente",
    rolBackend: "CLIENTE",
    administradorPrincipal: false
  },
  {
    id: 3,
    nombre: "Vendedor Uno",
    correo: "vendedor@gmail.com",
    telefono: "+569 87654321",
    direccion: "Las Rejas 2450, Santiago",
    rol: "Vendedor",
    rolBackend: "VENDEDOR",
    administradorPrincipal: false
  }
];

const pedidos = [
  {
    codigo: 50,
    usuarioId: 2,
    cliente: "Juan Pérez",
    fecha: "17/11/2026",
    total: 12000,
    productos: []
  }
];

describe("Administración de usuarios", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("usuarioActualId", "1");
    localStorage.setItem("usuarioRol", "ADMINISTRADOR");
    vi.clearAllMocks();
    obtenerUsuariosApi.mockResolvedValue(usuarios.map((u) => ({ ...u })));
    obtenerPedidosConDetallesApi.mockResolvedValue(pedidos);
    crearUsuarioAdministrativoApi.mockResolvedValue({});
    cambiarRolUsuarioApi.mockResolvedValue({});
    eliminarUsuarioApi.mockResolvedValue();
  });

  afterEach(() => cleanup());

  it("carga usuarios reales desde API", async () => {
    render(<Usuarios />);
    expect(await screen.findByText("Juan Pérez")).toBeTruthy();
    expect(screen.getByText("Vendedor Uno")).toBeTruthy();
    expect(obtenerUsuariosApi).toHaveBeenCalled();
  });

  it("protege administrador principal", async () => {
    render(<Usuarios />);
    await screen.findByText("Administrador Principal");
    const fila = screen.getByText("Administrador Principal").closest("tr");
    expect(within(fila).queryByRole("button", { name: "Eliminar" })).toBeNull();
    expect(within(fila).queryByRole("button", { name: "Cambiar rol" })).toBeNull();
  });

  it("muestra historial de compras del cliente", async () => {
    render(<Usuarios />);
    await screen.findByText("Juan Pérez");
    const fila = screen.getByText("Juan Pérez").closest("tr");
    fireEvent.click(within(fila).getByRole("button", { name: "Ver" }));
    expect(screen.getByText("Pedido #50")).toBeTruthy();
    expect(screen.getByText("$12.000")).toBeTruthy();
  });

  it("cambia el rol de un usuario normal", async () => {
    render(<Usuarios />);
    await screen.findByText("Juan Pérez");
    const fila = screen.getByText("Juan Pérez").closest("tr");
    fireEvent.click(within(fila).getByRole("button", { name: "Cambiar rol" }));
    fireEvent.change(screen.getByLabelText("Rol"), { target: { value: "Vendedor" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar rol" }));

    expect(cambiarRolUsuarioApi).toHaveBeenCalledWith(2, "Vendedor");
  });

  it("elimina un usuario normal conservando historial en backend", async () => {
    render(<Usuarios />);
    await screen.findByText("Vendedor Uno");
    const fila = screen.getByText("Vendedor Uno").closest("tr");
    fireEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));
    const modal = screen.getByRole("heading", { name: "Eliminar usuario" }).closest("div");
    fireEvent.click(within(modal).getByRole("button", { name: "Eliminar" }));
    expect(eliminarUsuarioApi).toHaveBeenCalledWith(3);
  });

  it("crea vendedores o administradores", async () => {
    render(<Usuarios />);
    await screen.findByText("Juan Pérez");
    fireEvent.click(screen.getByRole("button", { name: /AGREGAR USUARIO ADMINISTRATIVO/i }));

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Nuevo Vendedor" } });
    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "nuevo@gmail.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Teléfono"), { target: { value: "+569 22223333" } });
    fireEvent.change(screen.getByLabelText("Dirección"), { target: { value: "Av. Nueva 1234, Santiago" } });
    fireEvent.change(screen.getByLabelText("Rol"), { target: { value: "Vendedor" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));

    expect(crearUsuarioAdministrativoApi).toHaveBeenCalledWith(
      expect.objectContaining({ rol: "Vendedor", correo: "nuevo@gmail.com" })
    );
  });

  it("muestra error cuando falla la carga", async () => {
    obtenerUsuariosApi.mockRejectedValue(new Error("Error"));
    render(<Usuarios />);
    expect(await screen.findByText("No fue posible cargar los usuarios.")).toBeTruthy();
  });
});
