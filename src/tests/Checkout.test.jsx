import {
  describe, it, expect, beforeEach, afterEach
} from "vitest";
import {
  render, screen, fireEvent, cleanup
} from "@testing-library/react";
import {
  MemoryRouter, Routes, Route, useLocation
} from "react-router-dom";

import Checkout from "../pages/carrito/Checkout.jsx";
import CompraExitosa from "../pages/carrito/CompraExitosa.jsx";
import CompraError from "../pages/carrito/CompraError.jsx";
import {
  agregarAlCarrito, obtenerCarrito
} from "../data/carrito.js";
import {
  obtenerProductos
} from "../data/productos.js";
import {
  obtenerPedidos, obtenerPedidoPorCodigo, crearPedido
} from "../data/pedidos.js";
import { obtenerUsuarios } from "../data/usuarios.js";

// Datos de prueba: no corresponden a compras reales.
const hamburguesa = {
  codigo: 101,
  nombre: "Hamburguesa de prueba",
  categoria: "Hamburguesas",
  descripcion: "Hamburguesa de testing",
  precio: 10000,
  stock: 3,
  estado: "Disponible",
  imagen: "/img/hamburguesa.png",
  promocion: false,
  descuento: 0
};

const papas = {
  codigo: 102,
  nombre: "Papas de prueba",
  categoria: "Papas",
  descripcion: "Papas de testing",
  precio: 5000,
  stock: 8,
  estado: "Disponible",
  imagen: "/img/papas.png",
  promocion: false,
  descuento: 0
};

function LoginDePrueba() {
  const location = useLocation();
  return (
    <p>
      {location.state?.desdeCheckout
        ? "Login desde Checkout"
        : "Login normal"}
    </p>
  );
}

// Rutas mínimas para observar las redirecciones reales de Checkout.
function mostrarRuta(ruta = "/checkout") {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/carrito" element={<h1>Carrito de prueba</h1>} />
        <Route path="/admin" element={<h1>Panel admin de prueba</h1>} />
        <Route path="/login" element={<LoginDePrueba />} />
        <Route path="/menu" element={<h1>Menú de prueba</h1>} />
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
        <Route path="/compra-error" element={<CompraError />} />
      </Routes>
    </MemoryRouter>
  );
}

function prepararCarrito({ usuarioId = null, cantidad = 1, producto = hamburguesa } = {}) {
  if (usuarioId !== null) {
    localStorage.setItem("usuarioActualId", String(usuarioId));
  }
  for (let i = 0; i < cantidad; i++) {
    agregarAlCarrito(producto);
  }
}

function completarDatos({
  nombre = "Cliente de Prueba",
  telefono = "+569 12345678",
  correo = "cliente@gmail.com",
  direccion = "Av. Principal 1234, Santiago",
  comuna = "Santiago",
  referencia = "Casa de prueba"
} = {}) {
  fireEvent.change(screen.getByLabelText(/Nombre completo/), {
    target: { value: nombre }
  });
  fireEvent.change(screen.getByLabelText(/Teléfono/), {
    target: { value: telefono }
  });
  fireEvent.change(screen.getByLabelText(/Correo electrónico/), {
    target: { value: correo }
  });

  // Dirección y comuna se muestran solamente con Delivery.
  if (screen.queryByLabelText(/Dirección \*/)) {
    fireEvent.change(screen.getByLabelText(/Dirección \*/), {
      target: { value: direccion }
    });
    fireEvent.change(screen.getByLabelText(/Comuna \*/), {
      target: { value: comuna }
    });
    fireEvent.change(screen.getByLabelText("Referencia"), {
      target: { value: referencia }
    });
  }
}

function confirmar() {
  fireEvent.click(
    screen.getByRole("button", { name: /CONFIRMAR PEDIDO/i })
  );
}

function elegirRetiro() {
  fireEvent.click(
    screen.getByRole("button", { name: /Retiro en local/i })
  );
}

function totalVisible(container) {
  return container.querySelector(".checkout-total strong")?.textContent.trim();
}

describe("Checkout: compra, stock, pedidos y resultados", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("productos", JSON.stringify([hamburguesa, papas]));
    localStorage.setItem("pedidos", JSON.stringify([]));
    obtenerUsuarios(); // Restaura los usuarios de demostración.
  });

  afterEach(() => {
    cleanup();
  });

  describe("Acceso y presentación del formulario", () => {
    it("1. Redirige al carrito cuando se intenta pagar sin productos", () => {
      mostrarRuta();
      expect(screen.getByRole("heading", { name: "Carrito de prueba" })).toBeTruthy();
    });

    it("2. Impide que el administrador realice una compra", () => {
      prepararCarrito({ usuarioId: 0 });
      mostrarRuta();
      expect(screen.getByRole("heading", { name: "Panel admin de prueba" })).toBeTruthy();
    });

    it("3. Ofrece al invitado iniciar sesión y recuerda que venía de Checkout", () => {
      prepararCarrito();
      mostrarRuta();
      expect(screen.getByText("Estás comprando como invitado")).toBeTruthy();
      fireEvent.click(screen.getByRole("button", { name: "INICIAR SESIÓN" }));
      expect(screen.getByText("Login desde Checkout")).toBeTruthy();
    });

    it("4. Precarga los datos de un cliente conectado", () => {
      prepararCarrito({ usuarioId: 1 });
      mostrarRuta();
      expect(screen.getByLabelText(/Nombre completo/).value).toBe("Juan Pérez");
      expect(screen.getByLabelText(/Correo electrónico/).value).toBe("juan@gmail.com");
      expect(screen.getByLabelText(/Teléfono/).value).toBe("+569 12345678");
      expect(screen.queryByText("Estás comprando como invitado")).toBeNull();
    });

    it("5. Calcula subtotal, costo de Delivery y total inicial", () => {
      prepararCarrito();
      const { container } = mostrarRuta();
      expect(container.querySelector(".checkout-resumen").textContent).toContain("$10.000");
      expect(totalVisible(container)).toBe("$12.000");
    });

    it("6. Retiro en local elimina el costo de Delivery y sus campos", () => {
      prepararCarrito();
      const { container } = mostrarRuta();
      elegirRetiro();
      expect(totalVisible(container)).toBe("$10.000");
      expect(screen.queryByLabelText(/Dirección \*/)).toBeNull();
      expect(screen.queryByLabelText(/Comuna \*/)).toBeNull();
    });

    it("7. Volver a Delivery recupera el recargo y solicita dirección", () => {
      prepararCarrito();
      const { container } = mostrarRuta();
      elegirRetiro();
      fireEvent.click(screen.getByRole("button", { name: /Delivery/i }));
      expect(totalVisible(container)).toBe("$12.000");
      expect(screen.getByLabelText(/Dirección \*/)).toBeTruthy();
    });

    it("8. Permite seleccionar Efectivo como medio de pago", () => {
      prepararCarrito();
      mostrarRuta();
      const efectivo = screen.getByRole("button", { name: /Efectivo al recibir/i });
      fireEvent.click(efectivo);
      expect(efectivo.className).toContain("activa");
    });
  });

  describe("Validaciones del formulario", () => {
    it("9. Rechaza formulario vacío y no crea pedidos", () => {
      prepararCarrito();
      mostrarRuta();
      confirmar();
      expect(screen.getByText("El nombre debe tener al menos 3 caracteres.")).toBeTruthy();
      expect(screen.getByText("Selecciona una comuna.")).toBeTruthy();
      expect(obtenerPedidos()).toHaveLength(0);
      expect(obtenerCarrito()).toHaveLength(1);
    });

    it("10. Rechaza correos de dominios no autorizados", () => {
      prepararCarrito();
      mostrarRuta();
      completarDatos({ correo: "cliente@ejemplo.com" });
      confirmar();
      expect(screen.getByText("Ingresa un correo Gmail, Duoc o DuocUC válido.")).toBeTruthy();
      expect(obtenerPedidos()).toHaveLength(0);
    });

    it("11. Rechaza teléfonos con formato incorrecto", () => {
      prepararCarrito();
      mostrarRuta();
      completarDatos({ telefono: "123" });
      confirmar();
      expect(screen.getByText("Ingresa un teléfono válido. Ej: +569 12345678.")).toBeTruthy();
    });

    it("12. Delivery exige una dirección de al menos diez caracteres", () => {
      prepararCarrito();
      mostrarRuta();
      completarDatos({ direccion: "Calle 1" });
      confirmar();
      expect(screen.getByText("La dirección debe tener al menos 10 caracteres.")).toBeTruthy();
    });

    it("13. Delivery exige que el cliente seleccione una comuna", () => {
      prepararCarrito();
      mostrarRuta();
      completarDatos({ comuna: "" });
      confirmar();
      expect(screen.getByText("Selecciona una comuna.")).toBeTruthy();
    });
  });

  describe("Registro real de compras y actualización de inventario", () => {
    it("14. Permite comprar como invitado con Retiro en local", () => {
      prepararCarrito();
      mostrarRuta();
      elegirRetiro();
      completarDatos();
      confirmar();

      const [pedido] = obtenerPedidos();
      expect(pedido).toMatchObject({
        usuarioId: null,
        cliente: "Cliente de Prueba",
        tipoEntrega: "Retiro en local",
        direccion: "Retiro en local",
        costoDelivery: 0,
        subtotal: 10000,
        total: 10000
      });
      expect(obtenerCarrito()).toHaveLength(0);
      expect(sessionStorage.getItem("compraFueInvitado")).toBe("true");
      expect(screen.getByRole("heading", { name: /TU PEDIDO FUE CONFIRMADO/i })).toBeTruthy();
    });

    it("15. Guarda dirección, comuna, referencia y pago al comprar con Delivery", () => {
      prepararCarrito();
      mostrarRuta();
      completarDatos();
      fireEvent.click(screen.getByRole("button", { name: /Efectivo al recibir/i }));
      confirmar();

      const [pedido] = obtenerPedidos();
      expect(pedido).toMatchObject({
        tipoEntrega: "Delivery",
        direccion: "Av. Principal 1234, Santiago",
        comuna: "Santiago",
        referencia: "Casa de prueba",
        medioPago: "Efectivo",
        subtotal: 10000,
        costoDelivery: 2000,
        total: 12000
      });
      expect(pedido.neto + pedido.iva).toBe(12000);
      expect(sessionStorage.getItem("compraError")).toBeNull();
    });

    it("16. Asocia el pedido al usuario conectado y marca que no es invitado", () => {
      prepararCarrito({ usuarioId: 1 });
      mostrarRuta();
      fireEvent.change(screen.getByLabelText(/Comuna \*/), {
        target: { value: "Santiago" }
      });
      confirmar();

      expect(obtenerPedidos()[0].usuarioId).toBe(1);
      expect(sessionStorage.getItem("compraFueInvitado")).toBe("false");
      expect(screen.getByRole("link", { name: "VER MIS BOLETAS" })).toBeTruthy();
    });

    it("17. Descuenta el stock del producto comprado", () => {
      prepararCarrito({ cantidad: 2 });
      mostrarRuta();
      elegirRetiro();
      completarDatos();
      confirmar();
      expect(obtenerProductos().find(p => p.codigo === 101).stock).toBe(1);
      expect(obtenerPedidos()[0].productos[0]).toMatchObject({
        codigoProducto: 101, cantidad: 2, precio: 10000
      });
    });

    it("18. Marca Sin stock cuando se compran todas las unidades", () => {
      prepararCarrito({ cantidad: 3 });
      mostrarRuta();
      elegirRetiro();
      completarDatos();
      confirmar();
      expect(obtenerProductos().find(p => p.codigo === 101)).toMatchObject({
        stock: 0,
        estado: "Sin stock"
      });
    });

    it("19. Registra dos productos y calcula la suma de sus importes", () => {
      prepararCarrito({ cantidad: 2 });
      agregarAlCarrito(papas);
      mostrarRuta();
      elegirRetiro();
      completarDatos();
      confirmar();

      const [pedido] = obtenerPedidos();
      expect(pedido.productos).toHaveLength(2);
      expect(pedido.subtotal).toBe(25000);
      expect(pedido.total).toBe(25000);
      expect(pedido.neto + pedido.iva).toBe(25000);
      expect(obtenerProductos().find(p => p.codigo === 102).stock).toBe(7);
    });
  });

  describe("Errores de stock y disponibilidad", () => {
    it("20. Rechaza compra sin stock suficiente y conserva el carrito", () => {
      prepararCarrito({ cantidad: 3 });
      localStorage.setItem("productos", JSON.stringify([
        { ...hamburguesa, stock: 2 }, papas
      ]));
      mostrarRuta();
      elegirRetiro();
      completarDatos();
      confirmar();

      expect(screen.getByRole("heading", { name: "NO PUDIMOS PROCESAR TU PEDIDO" })).toBeTruthy();
      expect(sessionStorage.getItem("compraError")).toContain("suficiente stock");
      expect(obtenerPedidos()).toHaveLength(0);
      expect(obtenerCarrito()[0].cantidad).toBe(3);
    });

    it("21. Rechaza un producto que fue ocultado después de agregarlo", () => {
      prepararCarrito();
      localStorage.setItem("productos", JSON.stringify([
        { ...hamburguesa, estado: "Oculto" }, papas
      ]));
      mostrarRuta();
      elegirRetiro();
      completarDatos();
      confirmar();
      expect(sessionStorage.getItem("compraError")).toContain("ya no está disponible");
      expect(obtenerPedidos()).toHaveLength(0);
    });

    it("22. Rechaza un producto que fue eliminado del catálogo", () => {
      prepararCarrito();
      localStorage.setItem("productos", JSON.stringify([papas]));
      mostrarRuta();
      elegirRetiro();
      completarDatos();
      confirmar();
      expect(sessionStorage.getItem("compraError")).toContain("ya no está disponible");
      expect(obtenerCarrito()).toHaveLength(1);
    });
  });

  describe("Pantallas de confirmación y error", () => {
    it("23. Una confirmación sin compra guardada vuelve al menú", () => {
      mostrarRuta("/compra-exitosa");
      expect(screen.getByRole("heading", { name: "Menú de prueba" })).toBeTruthy();
    });

    it("24. La confirmación de invitado muestra su pedido y enlace al inicio", () => {
      sessionStorage.setItem("ultimaCompra", JSON.stringify({
        codigo: 8,
        fecha: "24/10/2026",
        hora: "20:00",
        cliente: "Cliente de Prueba",
        tipoEntrega: "Retiro en local",
        medioPago: "Efectivo",
        subtotal: 10000,
        costoDelivery: 0,
        neto: 8403,
        iva: 1597,
        total: 10000,
        productos: [{ codigoProducto: 101, nombre: "Hamburguesa de prueba", cantidad: 1, precio: 10000, imagen: "/img/hamburguesa.png" }]
      }));
      sessionStorage.setItem("compraFueInvitado", "true");
      mostrarRuta("/compra-exitosa");
      expect(screen.getByRole("heading", { name: /TU PEDIDO FUE CONFIRMADO/i })).toBeTruthy();
      expect(screen.getByText("Hamburguesa de prueba")).toBeTruthy();
      expect(screen.getByRole("link", { name: "VOLVER AL INICIO" }).getAttribute("href")).toBe("/");
      expect(screen.queryByRole("link", { name: "VER MIS BOLETAS" })).toBeNull();
    });

    it("25. La página de error muestra el motivo y permite volver al carrito", () => {
      sessionStorage.setItem("compraError", "Prueba: producto sin disponibilidad.");
      mostrarRuta("/compra-error");
      expect(screen.getByText("Prueba: producto sin disponibilidad.")).toBeTruthy();
      expect(screen.getByRole("link", { name: "VOLVER AL CARRITO" }).getAttribute("href")).toBe("/carrito");
      expect(screen.getByRole("link", { name: "VOLVER A INTENTAR" }).getAttribute("href")).toBe("/checkout");
    });
  });

  describe("Persistencia real de pedidos", () => {
    it("26. Recupera por código un pedido que fue guardado", () => {
      const pedido = crearPedido({
        cliente: "Prueba de pedido",
        total: 7000,
        productos: []
      });
      expect(pedido.codigo).toBe(1);
      expect(obtenerPedidoPorCodigo(1)).toMatchObject({
        codigo: 1,
        cliente: "Prueba de pedido",
        total: 7000
      });
      expect(JSON.parse(localStorage.getItem("pedidos"))).toHaveLength(1);
    });
  });
});
