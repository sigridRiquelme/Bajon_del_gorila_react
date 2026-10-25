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

// Estos productos solo existen en el entorno de pruebas (jsdom).
// No se modifica el catálogo real del proyecto.
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
        <Route
          path="/checkout"
          element={<h1>Checkout de prueba</h1>}
        />
        <Route
          path="/admin"
          element={<h1>Panel administrativo de prueba</h1>}
        />
        <Route path="/menu" element={<h1>Menú de prueba</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Carrito: almacenamiento y pantalla de compra", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // El componente Carrito consulta el stock actual de productos.js.
    localStorage.setItem(
      "productos",
      JSON.stringify([hamburguesa, papas])
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe("Lógica real del carrito (carrito.js)", () => {
    it("1. Devuelve un carrito vacío cuando no hay productos", () => {
      expect(obtenerCarrito()).toEqual([]);
      expect(obtenerCantidadCarrito()).toBe(0);
    });

    it("2. Guarda un producto en el carrito del invitado", () => {
      agregarAlCarrito(hamburguesa);

      expect(obtenerCarrito()).toHaveLength(1);
      expect(obtenerCarrito()[0]).toMatchObject({
        codigo: 101,
        precio: 10000,
        cantidad: 1
      });
      expect(JSON.parse(localStorage.getItem("carrito_invitado")))
        .toHaveLength(1);
    });

    it("3. Agrupa las unidades al agregar dos veces el mismo producto", () => {
      agregarAlCarrito(hamburguesa);
      agregarAlCarrito(hamburguesa);

      expect(obtenerCarrito()).toHaveLength(1);
      expect(obtenerCarrito()[0].cantidad).toBe(2);
    });

    it("4. Mantiene productos diferentes y cuenta todas sus unidades", () => {
      agregarAlCarrito(hamburguesa);
      agregarAlCarrito(hamburguesa);
      agregarAlCarrito(papas);

      expect(obtenerCarrito()).toHaveLength(2);
      expect(obtenerCantidadCarrito()).toBe(3);
    });

    it("5. Modifica la cantidad y guarda el cambio", () => {
      agregarAlCarrito(hamburguesa);
      cambiarCantidad(101, 3);

      expect(obtenerCarrito()[0].cantidad).toBe(3);
      expect(JSON.parse(localStorage.getItem("carrito_invitado"))[0].cantidad)
        .toBe(3);
    });

    it("6. Elimina un producto sin borrar los otros", () => {
      agregarAlCarrito(hamburguesa);
      agregarAlCarrito(papas);
      eliminarDelCarrito(101);

      expect(obtenerCarrito()).toHaveLength(1);
      expect(obtenerCarrito()[0].codigo).toBe(102);
    });

    it("7. Vacía el carrito y deja cero unidades", () => {
      agregarAlCarrito(hamburguesa);
      vaciarCarrito();

      expect(obtenerCarrito()).toEqual([]);
      expect(obtenerCantidadCarrito()).toBe(0);
      expect(localStorage.getItem("carrito_invitado")).toBeNull();
    });

    it("8. Separa el carrito del invitado del de un cliente conectado", () => {
      agregarAlCarrito(hamburguesa); // Invitado
      localStorage.setItem("usuarioActualId", "1");
      agregarAlCarrito(papas); // Cliente

      expect(obtenerCarrito().map((item) => item.codigo)).toEqual([102]);
      expect(JSON.parse(localStorage.getItem("carrito_invitado"))[0].codigo)
        .toBe(101);
      expect(JSON.parse(localStorage.getItem("carrito_1"))[0].codigo)
        .toBe(102);
    });

    it("9. Transfiere el carrito del invitado a un cliente", () => {
      agregarAlCarrito(hamburguesa);
      pasarCarritoInvitado(1);

      expect(localStorage.getItem("carrito_invitado")).toBeNull();
      expect(JSON.parse(localStorage.getItem("carrito_1"))[0]).toMatchObject({
        codigo: 101,
        cantidad: 1
      });
    });

    it("10. Suma cantidades iguales al combinar dos carritos", () => {
      agregarAlCarrito(hamburguesa);
      agregarAlCarrito(hamburguesa); // 2 como invitado
      localStorage.setItem("usuarioActualId", "1");
      agregarAlCarrito(hamburguesa); // 1 como cliente
      agregarAlCarrito(papas); // Otro producto del cliente

      pasarCarritoInvitado(1);

      const carritoCliente = obtenerCarrito();
      expect(carritoCliente).toHaveLength(2);
      expect(carritoCliente.find((item) => item.codigo === 101).cantidad)
        .toBe(3);
      expect(carritoCliente.find((item) => item.codigo === 102).cantidad)
        .toBe(1);
      expect(localStorage.getItem("carrito_invitado")).toBeNull();
    });

    it("11. No modifica el carrito del cliente si no hay carrito invitado", () => {
      localStorage.setItem("usuarioActualId", "1");
      agregarAlCarrito(papas);
      const antes = localStorage.getItem("carrito_1");

      pasarCarritoInvitado(1);

      expect(localStorage.getItem("carrito_1")).toBe(antes);
    });

    it("12. Emite un evento al cambiar el carrito para actualizar el Header", () => {
      const escucharCambio = vi.fn();
      window.addEventListener("carritoActualizado", escucharCambio);

      try {
        agregarAlCarrito(hamburguesa);
        cambiarCantidad(101, 2);
        vaciarCarrito();

        expect(escucharCambio).toHaveBeenCalledTimes(3);
      } finally {
        window.removeEventListener("carritoActualizado", escucharCambio);
      }
    });
  });

  describe("Interfaz real del carrito (Carrito.jsx)", () => {
    it("13. Muestra el estado vacío y un enlace al menú", () => {
      mostrarCarrito();

      expect(screen.getByRole("heading", {
        name: "TU CARRITO ESTÁ VACÍO"
      })).toBeTruthy();
      expect(screen.getByRole("link", { name: "VER MENÚ" })
        .getAttribute("href")).toBe("/menu");
    });

    it("14. Muestra productos y calcula el total, neto e IVA", () => {
      agregarAlCarrito(hamburguesa);
      agregarAlCarrito(hamburguesa);
      agregarAlCarrito(papas);
      const { container } = mostrarCarrito();

      expect(screen.getByRole("heading", {
        name: "Hamburguesa de prueba"
      })).toBeTruthy();
      expect(screen.getByRole("heading", {
        name: "Papas de prueba"
      })).toBeTruthy();

      const total = 25000;
      const neto = Math.round(total / 1.19);
      const iva = total - neto;

      expect(container.querySelector(".carrito-resumen-total strong").textContent)
        .toBe(`$${total.toLocaleString("es-CL")}`);
      expect(container.querySelector(".carrito-resumen").textContent)
        .toContain(`$${neto.toLocaleString("es-CL")}`);
      expect(container.querySelector(".carrito-resumen").textContent)
        .toContain(`$${iva.toLocaleString("es-CL")}`);
    });

    it("15. Permite aumentar la cantidad y actualiza el importe", () => {
      agregarAlCarrito(hamburguesa);
      const { container } = mostrarCarrito();

      fireEvent.click(within(container.querySelector(".carrito-producto"))
        .getByRole("button", { name: "+" }));

      expect(obtenerCarrito()[0].cantidad).toBe(2);
      expect(container.querySelector(".carrito-resumen-total strong").textContent)
        .toBe("$20.000");
    });

    it("16. Al disminuir de una unidad elimina el producto", () => {
      agregarAlCarrito(hamburguesa);
      const { container } = mostrarCarrito();

      fireEvent.click(within(container.querySelector(".carrito-producto"))
        .getByRole("button", { name: "−" }));

      expect(obtenerCarrito()).toEqual([]);
      expect(screen.getByRole("heading", {
        name: "TU CARRITO ESTÁ VACÍO"
      })).toBeTruthy();
    });

    it("17. El botón Eliminar quita el producto seleccionado", () => {
      agregarAlCarrito(hamburguesa);
      agregarAlCarrito(papas);
      const { container } = mostrarCarrito();

      fireEvent.click(within(container.querySelector(".carrito-producto"))
        .getByRole("button", { name: "Eliminar" }));

      expect(obtenerCarrito().map((item) => item.codigo)).toEqual([102]);
      expect(screen.getByText("Producto eliminado del carrito.")).toBeTruthy();
    });

    it("18. Impide aumentar por encima del stock actual del catálogo", () => {
      agregarAlCarrito(hamburguesa);
      cambiarCantidad(101, 3); // El stock actual es de 3 unidades
      const { container } = mostrarCarrito();

      fireEvent.click(within(container.querySelector(".carrito-producto"))
        .getByRole("button", { name: "+" }));

      expect(obtenerCarrito()[0].cantidad).toBe(3);
      expect(screen.getByText(
        "Solo hay 3 unidades disponibles de Hamburguesa de prueba."
      )).toBeTruthy();
    });

    it("19. Permite continuar hacia Checkout con productos", () => {
      agregarAlCarrito(hamburguesa);
      mostrarCarrito();

      fireEvent.click(screen.getByRole("button", {
        name: /CONTINUAR A ENTREGA/i
      }));

      expect(screen.getByRole("heading", {
        name: "Checkout de prueba"
      })).toBeTruthy();
    });

    it("20. Redirige al administrador a su panel sin mostrar el carrito", () => {
      localStorage.setItem("usuarioActualId", "0");
      mostrarCarrito();

      expect(screen.getByRole("heading", {
        name: "Panel administrativo de prueba"
      })).toBeTruthy();
      expect(screen.queryByRole("heading", { name: "CARRITO" }))
        .toBeNull();
    });
  });
});
