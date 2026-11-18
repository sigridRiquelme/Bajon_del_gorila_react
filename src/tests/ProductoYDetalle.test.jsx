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

import {
  MemoryRouter,
  Routes,
  Route
} from "react-router-dom";

import ProductoCard from "../components/ProductoCard.jsx";
import DetalleProducto from "../pages/DetalleProducto.jsx";
import {
  obtenerPrecioFinal,
  obtenerProductoPorIdApi
} from "../api/productos.js";

vi.mock("../api/productos.js", () => ({
  obtenerPrecioFinal: vi.fn((producto) => {
    if (!producto.promocion || producto.descuento <= 0) {
      return producto.precio;
    }
    return Math.round(producto.precio * (1 - producto.descuento / 100));
  }),
  obtenerProductoPorIdApi: vi.fn(),
  obtenerProductosApi: vi.fn(),
  crearProductoApi: vi.fn(),
  actualizarProductoApi: vi.fn(),
  eliminarProductoApi: vi.fn()
}));

const productoBase = {
  codigo: 10,
  nombre: "GORILA BURGER",
  categoria: "Hamburguesas",
  categoriaId: 1,
  precio: 10000,
  stock: 5,
  estado: "Disponible",
  promocion: true,
  descuento: 20,
  descripcion: "Hamburguesa con queso y tomate",
  imagen: "/img/gorila-burger.png",
  valoracion: 4.9
};

function crearProducto(cambios = {}) {
  return { ...productoBase, ...cambios };
}

function mostrarTarjeta(producto, onAgregar) {
  return render(
    <MemoryRouter>
      <ProductoCard producto={producto} onAgregar={onAgregar} />
    </MemoryRouter>
  );
}

function mostrarDetalle(codigo = 10) {
  return render(
    <MemoryRouter initialEntries={[`/producto/${codigo}`]}>
      <Routes>
        <Route path="/producto/:codigo" element={<DetalleProducto />} />
        <Route path="/menu" element={<h1>Menú prueba</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Productos, tarjetas y detalle", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("calcula precio normal y promocional", () => {
    expect(obtenerPrecioFinal(crearProducto({ promocion: false, descuento: 0 })))
      .toBe(10000);
    expect(obtenerPrecioFinal(crearProducto())).toBe(8000);
  });

  it("ProductoCard muestra producto y precio promocional", () => {
    mostrarTarjeta(crearProducto(), vi.fn());
    expect(screen.getByRole("heading", { name: "GORILA BURGER" })).toBeTruthy();
    expect(screen.getByText("Hamburguesas")).toBeTruthy();
    expect(screen.getByText("-20% OFF")).toBeTruthy();
    expect(screen.getByText("$8.000")).toBeTruthy();
  });

  it("ProductoCard respeta stock y entrega cantidad al callback", () => {
    const onAgregar = vi.fn();
    mostrarTarjeta(crearProducto({ stock: 2 }), onAgregar);

    fireEvent.click(screen.getByRole("button", { name: "+" }));
    expect(screen.getByRole("button", { name: "+" }).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "AGREGAR" }));

    expect(onAgregar).toHaveBeenCalledWith(
      expect.objectContaining({ codigo: 10, precio: 8000 }),
      2
    );
  });

  it("ProductoCard deshabilita productos sin stock", () => {
    mostrarTarjeta(crearProducto({ stock: 0, estado: "Sin stock" }), vi.fn());
    expect(screen.getByText("Sin stock disponible")).toBeTruthy();
    expect(screen.getByRole("button", { name: "SIN STOCK" }).disabled).toBe(true);
  });

  it("DetalleProducto carga la información desde la API", async () => {
    obtenerProductoPorIdApi.mockResolvedValue(
      crearProducto({ promocion: false, descuento: 0 })
    );

    mostrarDetalle();
    expect(await screen.findByRole("heading", { name: "GORILA BURGER" })).toBeTruthy();
    expect(screen.getByText("Hamburguesa con queso y tomate")).toBeTruthy();
    expect(obtenerProductoPorIdApi).toHaveBeenCalledWith(10);
  });

  it("DetalleProducto informa producto inexistente", async () => {
    obtenerProductoPorIdApi.mockRejectedValue(new Error("No existe"));
    mostrarDetalle(999);
    expect(await screen.findByRole("heading", { name: "Producto no disponible" }))
      .toBeTruthy();
  });

  it("DetalleProducto impide mostrar un producto oculto", async () => {
    obtenerProductoPorIdApi.mockResolvedValue(crearProducto({ estado: "Oculto" }));
    mostrarDetalle();
    expect(await screen.findByRole("heading", { name: "Producto no disponible" }))
      .toBeTruthy();
  });

  it("DetalleProducto permite agregar al carrito a un cliente o invitado", async () => {
    obtenerProductoPorIdApi.mockResolvedValue(crearProducto({ stock: 3 }));
    mostrarDetalle();

    await screen.findByRole("heading", { name: "GORILA BURGER" });
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    fireEvent.click(screen.getByRole("button", { name: "AGREGAR AL CARRITO" }));

    const carrito = JSON.parse(localStorage.getItem("carrito_invitado"));
    expect(carrito[0]).toMatchObject({ codigo: 10, cantidad: 2 });
  });

  it("DetalleProducto bloquea compras para administrador", async () => {
    localStorage.setItem("usuarioRol", "ADMINISTRADOR");
    localStorage.setItem("token", "token-admin");
    obtenerProductoPorIdApi.mockResolvedValue(crearProducto());

    mostrarDetalle();
    await screen.findByRole("heading", { name: "GORILA BURGER" });
    expect(screen.getByText(/no puede realizar compras/i)).toBeTruthy();
  });
});
