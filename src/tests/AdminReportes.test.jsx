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
  cleanup
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard.jsx";
import ReporteVentas from "../pages/admin/ReporteVentas.jsx";
import ReporteProductosVendidos from "../pages/admin/ReporteProductosVendidos.jsx";
import ReporteUsuarios from "../pages/admin/ReporteUsuarios.jsx";
import ReporteInventario from "../pages/admin/ReporteInventario.jsx";
import { obtenerPedidosConDetallesApi } from "../api/pedidos.js";
import { obtenerUsuariosApi } from "../api/usuarios.js";
import { obtenerProductosApi } from "../api/productos.js";

vi.mock("../api/pedidos.js", () => ({
  obtenerPedidosConDetallesApi: vi.fn(),
  obtenerPedidosApi: vi.fn(),
  obtenerDetallePedidoApi: vi.fn(),
  obtenerMisPedidosApi: vi.fn(),
  crearPedidoApi: vi.fn()
}));

vi.mock("../api/usuarios.js", () => ({
  obtenerUsuariosApi: vi.fn(),
  obtenerUsuarioPorIdApi: vi.fn(),
  crearUsuarioAdministrativoApi: vi.fn(),
  cambiarRolUsuarioApi: vi.fn(),
  eliminarUsuarioApi: vi.fn()
}));

vi.mock("../api/productos.js", () => ({
  obtenerProductosApi: vi.fn(),
  obtenerPrecioFinal: vi.fn((p) => p.precio),
  obtenerProductoPorIdApi: vi.fn(),
  crearProductoApi: vi.fn(),
  actualizarProductoApi: vi.fn(),
  eliminarProductoApi: vi.fn()
}));

const pedidos = [
  {
    codigo: 11,
    usuarioId: 1,
    cliente: "Ana Rojas",
    fecha: "05/10/2026",
    total: 14000,
    productos: [
      { codigoProducto: 1, nombre: "Hamburguesa Clásica", categoria: "Hamburguesas", cantidad: 2, precio: 5000 },
      { codigoProducto: 2, nombre: "Papa Suprema", categoria: "Papas", cantidad: 1, precio: 2000 }
    ]
  },
  {
    codigo: 12,
    usuarioId: 2,
    cliente: "Bruno Soto",
    fecha: "05/10/2026",
    total: 6000,
    productos: [
      { codigoProducto: 2, nombre: "Papa Suprema", categoria: "Papas", cantidad: 3, precio: 2000 }
    ]
  },
  {
    codigo: 13,
    usuarioId: null,
    cliente: "Invitado Sol",
    fecha: "18/09/2026",
    total: 5000,
    productos: [
      { codigoProducto: 1, nombre: "Hamburguesa Clásica", categoria: "Hamburguesas", cantidad: 1, precio: 5000 }
    ]
  }
];

const usuarios = [
  { id: 1, nombre: "Ana Rojas", correo: "ana@gmail.com", telefono: "+569 1", direccion: "A", rol: "Cliente" },
  { id: 2, nombre: "Bruno Soto", correo: "bruno@gmail.com", telefono: "+569 2", direccion: "B", rol: "Cliente" },
  { id: 3, nombre: "Celia Díaz", correo: "celia@gmail.com", telefono: "+569 3", direccion: "C", rol: "Cliente" },
  { id: 4, nombre: "Admin", correo: "admin@gmail.com", telefono: "+569 4", direccion: "D", rol: "Administrador" },
  { id: 5, nombre: "Vendedor", correo: "vendedor@gmail.com", telefono: "+569 5", direccion: "E", rol: "Vendedor" }
];

const productos = [
  { codigo: 1, nombre: "Hamburguesa Clásica", categoria: "Hamburguesas", stock: 12 },
  { codigo: 2, nombre: "Papa Suprema", categoria: "Papas", stock: 4 },
  { codigo: 3, nombre: "Fajita Italiana", categoria: "Fajitas", stock: 0 }
];

describe("Reportes administrativos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    obtenerPedidosConDetallesApi.mockResolvedValue(pedidos);
    obtenerUsuariosApi.mockResolvedValue(usuarios);
    obtenerProductosApi.mockResolvedValue(productos);
  });

  afterEach(() => cleanup());

  it("Dashboard mantiene accesos administrativos", () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Panel de administración" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Productos/ })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Pedidos/ })).toBeTruthy();
  });

  it("ReporteVentas calcula cantidad, total y promedio", async () => {
    const { container } = render(<ReporteVentas />);
    await screen.findByText("Detalle de ventas");
    const texto = container.textContent;
    expect(texto).toContain("3");
    expect(texto).toContain("$25.000");
    expect(texto).toContain("Ana Rojas");
  });

  it("ReporteVentas filtra por mes", async () => {
    render(<ReporteVentas />);
    await screen.findByText("Detalle de ventas");
    fireEvent.change(screen.getByLabelText("Mostrar por"), { target: { value: "mes" } });
    fireEvent.change(screen.getByLabelText("Seleccionar mes"), { target: { value: "2026-10" } });
    expect(screen.queryByText("18/09/2026")).toBeNull();
    expect(screen.getAllByText("05/10/2026").length).toBeGreaterThan(0);
  });

  it("ReporteProductosVendidos agrupa productos y categorías", async () => {
    render(<ReporteProductosVendidos />);
    expect(await screen.findByText("Artículos vendidos")).toBeTruthy();
    expect(
      screen.getAllByText(
        "Papa Suprema"
      ).length
    ).toBeGreaterThanOrEqual(
      2
    );
    expect(screen.getByText("Hamburguesas")).toBeTruthy();
    expect(screen.getByText("Papas")).toBeTruthy();
  });

  it("ReporteUsuarios calcula clientes con y sin compras", async () => {
    const { container } = render(<ReporteUsuarios />);
    await screen.findByText("Detalle de usuarios");
    const texto = container.textContent;
    expect(texto).toContain("Clientes registrados");
    expect(texto).toContain("Clientes con compras");
    expect(texto).toContain("Clientes sin compras");
    expect(texto).toContain("Ana Rojas");
  });

  it("ReporteInventario calcula stock real", async () => {
    const { container } = render(<ReporteInventario />);
    await screen.findByText("Stock disponible por categoría");
    expect(container.textContent).toContain("16");
    expect(container.textContent).toContain("Hamburguesas");
  });

  it("reportes muestran errores de API", async () => {
    obtenerPedidosConDetallesApi.mockRejectedValue(new Error("Error"));
    render(<ReporteVentas />);
    expect(await screen.findByText("No fue posible cargar el reporte de ventas."))
      .toBeTruthy();
  });
});
