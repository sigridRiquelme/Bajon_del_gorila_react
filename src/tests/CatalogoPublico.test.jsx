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

import Inicio from "../pages/Inicio.jsx";
import Menu from "../pages/Menu.jsx";
import Promociones from "../pages/Promociones.jsx";
import { obtenerProductosApi } from "../api/productos.js";
import { obtenerCategoriasApi } from "../api/categorias.js";

vi.mock("../api/productos.js", () => ({
  obtenerProductosApi: vi.fn(),
  obtenerPrecioFinal: vi.fn((producto) => {
    if (!producto.promocion || producto.descuento <= 0) return producto.precio;
    return Math.round(producto.precio * (1 - producto.descuento / 100));
  }),
  obtenerProductoPorIdApi: vi.fn()
}));

vi.mock("../api/categorias.js", () => ({
  obtenerCategoriasApi: vi.fn(),
  crearCategoriaApi: vi.fn(),
  eliminarCategoriaApi: vi.fn()
}));

const productosPrueba = [
  {
    codigo: 1,
    nombre: "Hamburguesa Clásica",
    categoria: "Hamburguesas",
    categoriaId: 1,
    descripcion: "Hamburguesa con queso",
    precio: 5990,
    stock: 10,
    estado: "Disponible",
    promocion: false,
    descuento: 0,
    valoracion: 4.8,
    imagen: "/img/hamburguesa.png"
  },
  {
    codigo: 2,
    nombre: "Papa Suprema",
    categoria: "Papas",
    categoriaId: 2,
    descripcion: "Papas con cheddar",
    precio: 10000,
    stock: 10,
    estado: "Disponible",
    promocion: true,
    descuento: 20,
    valoracion: 4.7,
    imagen: "/img/papas.png"
  },
  {
    codigo: 3,
    nombre: "Producto Oculto",
    categoria: "Papas",
    categoriaId: 2,
    descripcion: "No publicado",
    precio: 3000,
    stock: 10,
    estado: "Oculto",
    promocion: true,
    descuento: 30,
    valoracion: 4,
    imagen: "/img/oculto.png"
  }
];

const categoriasPrueba = [
  { id: 1, nombre: "Hamburguesas" },
  { id: 2, nombre: "Papas" }
];

function mostrar(Componente) {
  return render(
    <MemoryRouter>
      <Componente />
    </MemoryRouter>
  );
}

describe("Catálogo público", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    obtenerProductosApi.mockResolvedValue(productosPrueba);
    obtenerCategoriasApi.mockResolvedValue(categoriasPrueba);
  });

  afterEach(() => cleanup());

  it("Inicio obtiene productos desde la API y oculta inactivos", async () => {
    mostrar(Inicio);
    expect(await screen.findByRole("heading", { name: "Hamburguesa Clásica" }))
      .toBeTruthy();
    expect(screen.getByRole("heading", { name: "Papa Suprema" })).toBeTruthy();
    expect(screen.queryByText("Producto Oculto")).toBeNull();
    expect(obtenerProductosApi).toHaveBeenCalled();
  });

  it("Inicio muestra una promoción real", async () => {
    mostrar(Inicio);

    const nombresPromo =
      await screen.findAllByText("Papa Suprema");

    expect(nombresPromo.length).toBeGreaterThanOrEqual(2);

    const preciosPromo =
      screen.getAllByText("$8.000");

    expect(preciosPromo.length).toBeGreaterThanOrEqual(2);
  });

  it("Menu carga productos y categorías desde API", async () => {
    mostrar(Menu);
    expect(await screen.findByRole("heading", { name: "Hamburguesa Clásica" }))
      .toBeTruthy();
    expect(obtenerProductosApi).toHaveBeenCalled();
    expect(obtenerCategoriasApi).toHaveBeenCalled();
    expect(screen.queryByText("Producto Oculto")).toBeNull();
  });

  it("Menu permite buscar productos", async () => {
    mostrar(Menu);
    await screen.findByRole("heading", { name: "Hamburguesa Clásica" });

    const input = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(input, { target: { value: "Papa" } });

    expect(screen.getByRole("heading", { name: "Papa Suprema" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Hamburguesa Clásica" })).toBeNull();
  });

  it("Promociones muestra solo promociones activas", async () => {
    mostrar(Promociones);
    expect(await screen.findByRole("heading", { name: "Papa Suprema" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Hamburguesa Clásica" })).toBeNull();
    expect(screen.queryByText("Producto Oculto")).toBeNull();
  });

  it("administrador no puede agregar productos desde catálogo", async () => {
    localStorage.setItem("token", "token-admin");
    localStorage.setItem("usuarioRol", "ADMINISTRADOR");
    mostrar(Menu);
    await screen.findByRole("heading", { name: "Hamburguesa Clásica" });
    expect(screen.getAllByRole("button", { name: "AGREGAR" })[0].disabled).toBe(true);
  });
});
