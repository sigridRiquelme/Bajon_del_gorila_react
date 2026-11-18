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

import Productos from "../pages/admin/Productos.jsx";
import ProductosCriticos from "../pages/admin/ProductosCriticos.jsx";
import ReporteInventario from "../pages/admin/ReporteInventario.jsx";
import {
  obtenerProductosApi,
  crearProductoApi,
  actualizarProductoApi,
  eliminarProductoApi
} from "../api/productos.js";
import {
  obtenerCategoriasApi,
  crearCategoriaApi
} from "../api/categorias.js";

vi.mock("../api/productos.js", () => ({
  obtenerProductosApi: vi.fn(),
  crearProductoApi: vi.fn(),
  actualizarProductoApi: vi.fn(),
  eliminarProductoApi: vi.fn(),
  obtenerProductoPorIdApi: vi.fn(),
  obtenerPrecioFinal: vi.fn((p) => p.precio)
}));

vi.mock("../api/categorias.js", () => ({
  obtenerCategoriasApi: vi.fn(),
  crearCategoriaApi: vi.fn(),
  eliminarCategoriaApi: vi.fn()
}));

const productos = [
  {
    codigo: 1,
    nombre: "Hamburguesa Clásica",
    categoria: "Hamburguesas",
    categoriaId: 1,
    descripcion: "Hamburguesa de carne con queso cheddar",
    precio: 5990,
    stock: 15,
    estado: "Disponible",
    promocion: false,
    descuento: 0,
    imagen: "/img/hamburguesa.png"
  },
  {
    codigo: 2,
    nombre: "Papa Suprema",
    categoria: "Papas",
    categoriaId: 2,
    descripcion: "Papas fritas con queso cheddar",
    precio: 8990,
    stock: 4,
    estado: "Disponible",
    promocion: true,
    descuento: 20,
    imagen: "/img/papas.png"
  },
  {
    codigo: 3,
    nombre: "Fajita Italiana",
    categoria: "Fajitas",
    categoriaId: 3,
    descripcion: "Fajita rellena con carne y palta",
    precio: 4990,
    stock: 0,
    estado: "Sin stock",
    promocion: false,
    descuento: 0,
    imagen: "/img/fajita.png"
  }
];

const categorias = [
  { id: 1, nombre: "Hamburguesas" },
  { id: 2, nombre: "Papas" },
  { id: 3, nombre: "Fajitas" }
];

describe("Administración de productos", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("usuarioRol", "ADMINISTRADOR");
    vi.clearAllMocks();
    obtenerProductosApi.mockResolvedValue(productos);
    obtenerCategoriasApi.mockResolvedValue(categorias);
    crearProductoApi.mockResolvedValue({});
    actualizarProductoApi.mockResolvedValue({});
    eliminarProductoApi.mockResolvedValue();
  });

  afterEach(() => cleanup());

  it("carga productos y categorías desde API", async () => {
    render(<Productos />);
    expect(await screen.findByText("Hamburguesa Clásica")).toBeTruthy();
    expect(screen.getByText("Papa Suprema")).toBeTruthy();
    expect(obtenerProductosApi).toHaveBeenCalled();
    expect(obtenerCategoriasApi).toHaveBeenCalled();
  });

  it("muestra solo lectura para vendedor", async () => {
    localStorage.setItem("usuarioRol", "VENDEDOR");
    render(<Productos />);
    expect(await screen.findAllByText("Solo lectura")).not.toHaveLength(0);
    expect(screen.queryByRole("button", { name: /AGREGAR PRODUCTO/i })).toBeNull();
  });

  it("permite crear una categoría", async () => {
    crearCategoriaApi.mockResolvedValue({ id: 4, nombre: "Combos" });
    render(<Productos />);
    await screen.findByText("Hamburguesa Clásica");

    const input = screen.getByPlaceholderText(/nueva categoría/i);
    fireEvent.change(input, { target: { value: "Combos" } });
    fireEvent.click(screen.getByRole("button", { name: /AGREGAR CATEGORÍA/i }));

    expect(await screen.findByText("Categoría creada correctamente.")).toBeTruthy();
    expect(crearCategoriaApi).toHaveBeenCalledWith("Combos");
  });

  it("valida formulario de producto vacío", async () => {
    render(<Productos />);
    await screen.findByText("Hamburguesa Clásica");
    fireEvent.click(screen.getByRole("button", { name: /AGREGAR PRODUCTO/i }));
    fireEvent.click(screen.getByRole("button", { name: "AGREGAR PRODUCTO" }));
    expect(screen.getByText("El nombre del producto es obligatorio.")).toBeTruthy();
    expect(crearProductoApi).not.toHaveBeenCalled();
  });

  it("ProductosCríticos usa los stocks reales de API", async () => {
    render(<ProductosCriticos />);
    expect(await screen.findByText("Papa Suprema")).toBeTruthy();
    expect(screen.getByText("Fajita Italiana")).toBeTruthy();
    expect(screen.queryByText("Hamburguesa Clásica")).toBeNull();
  });

  it("ReporteInventario calcula resumen real", async () => {
    const { container } = render(<ReporteInventario />);
    await screen.findByText("Stock disponible por categoría");
    const resumen = container.querySelector(".resumen-inventario").textContent;
    expect(resumen).toContain("Productos registrados");
    expect(resumen).toContain("19");
    expect(resumen).toContain("Stock crítico");
  });

  it("muestra error de carga", async () => {
    obtenerProductosApi.mockRejectedValue(new Error("Error"));
    render(<ProductosCriticos />);
    expect(await screen.findByText("No fue posible cargar los productos.")).toBeTruthy();
  });
});
