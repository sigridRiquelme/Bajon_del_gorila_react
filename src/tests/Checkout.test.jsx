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
  Route,
  useLocation
} from "react-router-dom";

import Checkout from "../pages/carrito/Checkout.jsx";
import CompraExitosa from "../pages/carrito/CompraExitosa.jsx";
import CompraError from "../pages/carrito/CompraError.jsx";
import { agregarAlCarrito, obtenerCarrito } from "../data/carrito.js";
import { crearPedidoApi } from "../api/pedidos.js";
import { obtenerMiPerfilApi } from "../api/auth.js";

vi.mock("../api/pedidos.js", () => ({
  crearPedidoApi: vi.fn(),
  obtenerMisPedidosApi: vi.fn(),
  obtenerPedidosApi: vi.fn(),
  obtenerDetallePedidoApi: vi.fn(),
  obtenerPedidosConDetallesApi: vi.fn()
}));

vi.mock("../api/auth.js", () => ({
  obtenerMiPerfilApi: vi.fn(),
  actualizarMiPerfilApi: vi.fn(),
  iniciarSesionApi: vi.fn(),
  registrarUsuarioApi: vi.fn()
}));

const hamburguesa = {
  codigo: 101,
  nombre: "Hamburguesa de prueba",
  precio: 10000,
  stock: 3,
  imagen: "/img/hamburguesa.png"
};

function LoginPrueba() {
  const location = useLocation();
  return <p>{location.state?.desdeCheckout ? "Login desde Checkout" : "Login normal"}</p>;
}

function mostrarCheckout() {
  return render(
    <MemoryRouter initialEntries={["/checkout"]}>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/carrito" element={<h1>Carrito de prueba</h1>} />
        <Route path="/admin" element={<h1>Panel admin de prueba</h1>} />
        <Route path="/login" element={<LoginPrueba />} />
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
        <Route path="/compra-error" element={<CompraError />} />
      </Routes>
    </MemoryRouter>
  );
}

function completarDatos() {
  fireEvent.change(screen.getByLabelText(/Nombre completo/), {
    target: { value: "Cliente de Prueba" }
  });
  fireEvent.change(screen.getByLabelText(/Teléfono/), {
    target: { value: "+569 12345678" }
  });
  fireEvent.change(screen.getByLabelText(/Correo electrónico/), {
    target: { value: "cliente@gmail.com" }
  });
  fireEvent.change(screen.getByLabelText(/Dirección \*/), {
    target: { value: "Av. Principal 1234, Santiago" }
  });
  fireEvent.change(screen.getByLabelText(/Comuna \*/), {
    target: { value: "Santiago" }
  });
}

describe("Checkout", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => cleanup());

  it("redirige al carrito si está vacío", () => {
    mostrarCheckout();
    expect(screen.getByRole("heading", { name: "Carrito de prueba" })).toBeTruthy();
  });

  it("permite comprar como invitado", () => {
    agregarAlCarrito(hamburguesa);
    mostrarCheckout();
    expect(screen.getByText("Estás comprando como invitado")).toBeTruthy();
  });

  it("lleva al login recordando que venía de checkout", () => {
    agregarAlCarrito(hamburguesa);
    mostrarCheckout();
    fireEvent.click(screen.getByRole("button", { name: "INICIAR SESIÓN" }));
    expect(screen.getByText("Login desde Checkout")).toBeTruthy();
  });

  it("precarga los datos de un cliente autenticado", async () => {
    localStorage.setItem("token", "token-cliente");
    localStorage.setItem("usuarioRol", "CLIENTE");
    localStorage.setItem("usuarioActualId", "8");
    agregarAlCarrito(hamburguesa);

    obtenerMiPerfilApi.mockResolvedValue({
      idUsuario: 8,
      nombre: "Cliente Registrado",
      correo: "cliente@gmail.com",
      telefono: "+569 12345678",
      direccion: "Av. Principal 1234, Santiago",
      rol: "CLIENTE"
    });

    mostrarCheckout();
    expect(await screen.findByDisplayValue("Cliente Registrado")).toBeTruthy();
    expect(screen.getByDisplayValue("cliente@gmail.com")).toBeTruthy();
  });

  it("valida campos antes de enviar", () => {
    agregarAlCarrito(hamburguesa);
    mostrarCheckout();
    fireEvent.click(screen.getByRole("button", { name: /CONFIRMAR PEDIDO/i }));
    expect(screen.getByText(/nombre debe tener al menos 3/i)).toBeTruthy();
    expect(crearPedidoApi).not.toHaveBeenCalled();
  });

  it("crea un pedido real y vacía el carrito", async () => {
    agregarAlCarrito(hamburguesa);
    crearPedidoApi.mockResolvedValue({
      idPedido: 55,
      usuario: null,
      cliente: "Cliente de Prueba",
      correo: "cliente@gmail.com",
      telefono: "+569 12345678",
      fecha: "17/11/2026",
      hora: "20:00",
      tipoEntrega: "DELIVERY",
      direccion: "Av. Principal 1234, Santiago",
      comuna: "Santiago",
      referencia: "",
      medioPago: "Tarjeta",
      subtotal: 10000,
      costoDelivery: 2000,
      neto: 10084,
      iva: 1916,
      total: 12000
    });

    mostrarCheckout();
    completarDatos();
    fireEvent.click(screen.getByRole("button", { name: /CONFIRMAR PEDIDO/i }));

    expect(
      await screen.findByText(
        (_, elemento) =>
          elemento?.tagName === "STRONG" &&
          elemento.textContent
            .replace(/\s/g, "") ===
            "#55"
      )
    ).toBeTruthy();
    expect(crearPedidoApi).toHaveBeenCalledWith(
      expect.objectContaining({
        cliente: "Cliente de Prueba",
        tipoEntrega: "Delivery"
      }),
      expect.any(Array)
    );
    expect(obtenerCarrito()).toEqual([]);
    expect(sessionStorage.getItem("ultimaCompra")).not.toBeNull();
  });

  it("conserva carrito y muestra página de error si backend rechaza", async () => {
    agregarAlCarrito(hamburguesa);
    crearPedidoApi.mockRejectedValue({
      response: { data: { mensaje: "STOCK INSUFICIENTE" } }
    });

    mostrarCheckout();
    completarDatos();
    fireEvent.click(screen.getByRole("button", { name: /CONFIRMAR PEDIDO/i }));

    expect(await screen.findByText(/STOCK INSUFICIENTE/i)).toBeTruthy();
    expect(obtenerCarrito()).toHaveLength(1);
  });

  it("redirige administrador y vendedor", () => {
    localStorage.setItem("token", "token-admin");
    localStorage.setItem("usuarioRol", "ADMINISTRADOR");
    agregarAlCarrito(hamburguesa);
    mostrarCheckout();
    expect(screen.getByRole("heading", { name: "Panel admin de prueba" })).toBeTruthy();
  });
});
