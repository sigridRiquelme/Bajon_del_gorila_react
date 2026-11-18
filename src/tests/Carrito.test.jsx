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

import {
  MemoryRouter,
  Routes,
  Route
} from "react-router-dom";

import Carrito from "../pages/carrito/Carrito.jsx";
import {
  obtenerCarrito,
  agregarAlCarrito,
  cambiarCantidad,
  eliminarDelCarrito,
  vaciarCarrito,
  obtenerCantidadCarrito,
  pasarCarritoInvitado
} from "../data/carrito.js";
import { obtenerProductosApi } from "../api/productos.js";

vi.mock("../api/productos.js", () => ({
  obtenerProductosApi: vi.fn(),
  obtenerPrecioFinal: vi.fn((producto) => producto.precio),
  obtenerProductoPorIdApi: vi.fn()
}));

const hamburguesa = {
  codigo: 101,
  nombre: "Hamburguesa de prueba",
  precio: 10000,
  stock: 3,
  estado: "Disponible",
  categoria: "Hamburguesas",
  promocion: false,
  descuento: 0,
  imagen: "/img/hamburguesa.png"
};

const papas = {
  codigo: 102,
  nombre: "Papas de prueba",
  precio: 5000,
  stock: 8,
  estado: "Disponible",
  categoria: "Papas",
  promocion: false,
  descuento: 0,
  imagen: "/img/papas.png"
};

function mostrarCarrito() {
  return render(
    <MemoryRouter initialEntries={["/carrito"]}>
      <Routes>
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<h1>Checkout de prueba</h1>} />
        <Route path="/admin" element={<h1>Panel administrativo de prueba</h1>} />
        <Route path="/menu" element={<h1>Menú de prueba</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Carrito", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    obtenerProductosApi.mockResolvedValue([hamburguesa, papas]);
  });

  afterEach(() => {
    cleanup();
  });

  it("maneja almacenamiento local del carrito", () => {
    expect(obtenerCarrito()).toEqual([]);
    agregarAlCarrito(hamburguesa);
    agregarAlCarrito(hamburguesa);
    agregarAlCarrito(papas);

    expect(obtenerCarrito()).toHaveLength(2);
    expect(obtenerCantidadCarrito()).toBe(3);

    cambiarCantidad(101, 3);
    expect(obtenerCarrito().find((item) => item.codigo === 101).cantidad).toBe(3);

    eliminarDelCarrito(102);
    expect(obtenerCarrito()).toHaveLength(1);

    vaciarCarrito();
    expect(obtenerCarrito()).toEqual([]);
  });

  it("transfiere el carrito invitado a un cliente", () => {
    agregarAlCarrito(hamburguesa);
    pasarCarritoInvitado(9);

    expect(localStorage.getItem("carrito_invitado")).toBeNull();
    expect(JSON.parse(localStorage.getItem("carrito_9"))[0].codigo).toBe(101);
  });

  it("muestra carrito vacío", async () => {
    mostrarCarrito();
    expect(screen.getByRole("heading", { name: "TU CARRITO ESTÁ VACÍO" }))
      .toBeTruthy();
  });

  it("muestra productos y totales", async () => {
    agregarAlCarrito(hamburguesa);
    agregarAlCarrito(papas);
    const { container } = mostrarCarrito();

    expect(await screen.findByRole("heading", { name: "Hamburguesa de prueba" }))
      .toBeTruthy();
    expect(screen.getByRole("heading", { name: "Papas de prueba" })).toBeTruthy();
    expect(container.querySelector(".carrito-resumen-total strong").textContent)
      .toBe("$15.000");
  });

  it("aumenta cantidades respetando el stock de la API", async () => {
    agregarAlCarrito(hamburguesa);
    const { container } = mostrarCarrito();
    await screen.findByRole("heading", { name: "Hamburguesa de prueba" });

    const articulo = container.querySelector(".carrito-producto");
    fireEvent.click(within(articulo).getByRole("button", { name: "+" }));
    expect(obtenerCarrito()[0].cantidad).toBe(2);

    fireEvent.click(within(articulo).getByRole("button", { name: "+" }));
    fireEvent.click(within(articulo).getByRole("button", { name: "+" }));
    expect(obtenerCarrito()[0].cantidad).toBe(3);
    expect(screen.getByText(/Solo hay 3 unidades disponibles/)).toBeTruthy();
  });

  it("permite eliminar productos desde la interfaz", async () => {
    agregarAlCarrito(hamburguesa);
    mostrarCarrito();
    await screen.findByRole("heading", { name: "Hamburguesa de prueba" });
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(obtenerCarrito()).toEqual([]);
  });

  it("continúa al checkout con productos", async () => {
    agregarAlCarrito(hamburguesa);
    mostrarCarrito();
    await screen.findByRole("heading", { name: "Hamburguesa de prueba" });
    fireEvent.click(screen.getByRole("button", { name: /CONTINUAR A ENTREGA/i }));
    expect(screen.getByRole("heading", { name: "Checkout de prueba" })).toBeTruthy();
  });

  it("redirige admin y vendedor al panel", () => {
    localStorage.setItem("token", "token-admin");
    localStorage.setItem("usuarioRol", "ADMINISTRADOR");
    mostrarCarrito();
    expect(screen.getByRole("heading", { name: "Panel administrativo de prueba" }))
      .toBeTruthy();
  });
});
