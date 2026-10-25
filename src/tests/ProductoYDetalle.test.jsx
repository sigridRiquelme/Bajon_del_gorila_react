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
import { obtenerPrecioFinal } from "../data/productos.js";

// Producto ficticio. No cambia el catálogo de la aplicación real.
const productoBase = {
  codigo: 10,
  nombre: "GORILA BURGER",
  categoria: "Hamburguesas",
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

function mostrarDetalle(producto, codigo = 10) {
  // Guardamos exclusivamente los productos de esta prueba en jsdom.
  // Es el módulo REAL de productos.js quien los leerá.
  localStorage.setItem(
    "productos",
    JSON.stringify(producto ? [producto] : [])
  );

  return render(
    <MemoryRouter initialEntries={[`/producto/${codigo}`]}>
      <Routes>
        <Route
          path="/producto/:codigo"
          element={<DetalleProducto />}
        />
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

  describe("Cálculo real de precios", () => {
    it("1. Mantiene el precio si el producto no está en promoción", () => {
      const producto = crearProducto({ promocion: false, descuento: 0 });
      expect(obtenerPrecioFinal(producto)).toBe(10000);
    });

    it("2. Aplica correctamente un descuento del 20%", () => {
      expect(obtenerPrecioFinal(crearProducto())).toBe(8000);
    });

    it("3. Redondea el precio final cuando hay decimales", () => {
      const producto = crearProducto({ precio: 999, descuento: 15 });
      expect(obtenerPrecioFinal(producto)).toBe(849);
    });
  });

  describe("ProductoCard: props, estados y eventos", () => {
    it("4. Muestra nombre, categoría y precio promocional", () => {
      mostrarTarjeta(crearProducto(), vi.fn());

      expect(
        screen.getByRole("heading", { name: "GORILA BURGER" })
      ).toBeTruthy();
      expect(screen.getByText("Hamburguesas")).toBeTruthy();
      expect(screen.getByText("-20% OFF")).toBeTruthy();
      expect(screen.getByText("$8.000")).toBeTruthy();
    });

    it("5. Cambia el corazón de favorito al hacer clic", () => {
      mostrarTarjeta(crearProducto(), vi.fn());

      fireEvent.click(screen.getByRole("button", { name: "🤍" }));
      expect(screen.getByRole("button", { name: "❤️" })).toBeTruthy();

      fireEvent.click(screen.getByRole("button", { name: "❤️" }));
      expect(screen.getByRole("button", { name: "🤍" })).toBeTruthy();
    });

    it("6. Respeta los límites al aumentar y disminuir la cantidad", () => {
      mostrarTarjeta(crearProducto({ stock: 2 }), vi.fn());

      const aumentar = screen.getByRole("button", { name: "+" });
      const disminuir = screen.getByRole("button", { name: "−" });
      expect(disminuir.disabled).toBe(true);

      fireEvent.click(aumentar);
      expect(aumentar.disabled).toBe(true);

      const cantidad = document.querySelector(
        ".selector-cantidad-producto span"
      );
      expect(cantidad.textContent).toBe("2");

      fireEvent.click(disminuir);
      expect(cantidad.textContent).toBe("1");
      expect(disminuir.disabled).toBe(true);
    });

    it("7. Llama al callback con cantidad y precio final correctos", () => {
      const onAgregar = vi.fn(); // Mock de la función que recibe el producto.
      const { container } = mostrarTarjeta(crearProducto(), onAgregar);

      fireEvent.click(screen.getByRole("button", { name: "+" }));
      fireEvent.click(screen.getByRole("button", { name: "AGREGAR" }));

      expect(onAgregar).toHaveBeenCalledTimes(1);
      expect(onAgregar).toHaveBeenCalledWith(
        expect.objectContaining({ codigo: 10, precio: 8000 }),
        2
      );
      expect(
        container.querySelector(".selector-cantidad-producto span").textContent
      ).toBe("1");
    });

    it("8. Impide agregar productos sin stock", () => {
      const onAgregar = vi.fn();
      mostrarTarjeta(
        crearProducto({ stock: 0, estado: "Sin stock" }),
        onAgregar
      );

      expect(screen.getByText("Sin stock disponible")).toBeTruthy();
      const boton = screen.getByRole("button", { name: "SIN STOCK" });
      expect(boton.disabled).toBe(true);
      fireEvent.click(boton);
      expect(onAgregar).not.toHaveBeenCalled();
    });

    it("9. Deshabilita la compra si no recibe la prop onAgregar", () => {
      mostrarTarjeta(crearProducto());
      expect(
        screen.getByRole("button", { name: "AGREGAR" }).disabled
      ).toBe(true);
    });

    it("10. Advierte cuando quedan pocas unidades", () => {
      mostrarTarjeta(crearProducto({ stock: 3 }), vi.fn());
      expect(
        screen.getByText("Últimas 3 unidades disponibles")
      ).toBeTruthy();
    });
  });

  describe("DetalleProducto: navegación, stock y carrito", () => {
    it("11. Muestra la información del producto y un enlace al menú", () => {
      mostrarDetalle(crearProducto({ promocion: false, descuento: 0 }));

      expect(
        screen.getByRole("heading", { name: "GORILA BURGER" })
      ).toBeTruthy();
      expect(screen.getByText("Hamburguesa con queso y tomate")).toBeTruthy();
      expect(
        screen.getByRole("link", { name: /Volver al menú/i })
          .getAttribute("href")
      ).toBe("/menu");
      expect(screen.getByText("$10.000")).toBeTruthy();
    });

    it("12. Muestra un aviso cuando el producto no existe", () => {
      mostrarDetalle(null, 999);
      expect(
        screen.getByRole("heading", { name: "Producto no disponible" })
      ).toBeTruthy();
    });

    it("13. Impide mostrar el detalle de un producto oculto", () => {
      mostrarDetalle(crearProducto({ estado: "Oculto" }));
      expect(
        screen.getByRole("heading", { name: "Producto no disponible" })
      ).toBeTruthy();
      expect(
        screen.queryByRole("button", { name: "AGREGAR AL CARRITO" })
      ).toBeNull();
    });

    it("14. Muestra precio anterior y final en una promoción", () => {
      const { container } = mostrarDetalle(crearProducto());
      expect(container.querySelector(".detalle-etiqueta-promocion").textContent)
        .toContain("-20% OFF");
      expect(container.querySelector(".detalle-precio-anterior").textContent.trim())
        .toBe("$10.000");
      expect(container.querySelector(".detalle-producto-precio").textContent.trim())
        .toBe("$8.000");
    });

    it("15. Agrega dos unidades al carrito con el precio descontado", () => {
      mostrarDetalle(crearProducto({ stock: 3 }));

      fireEvent.click(screen.getByRole("button", { name: "+" }));
      fireEvent.click(
        screen.getByRole("button", { name: "AGREGAR AL CARRITO" })
      );

      const carrito = JSON.parse(localStorage.getItem("carrito_invitado"));
      expect(carrito).toHaveLength(1);
      expect(carrito[0].codigo).toBe(10);
      expect(carrito[0].cantidad).toBe(2);
      expect(carrito[0].precio).toBe(8000);
      expect(
        screen.getByText("2 GORILA BURGER agregado al carrito.")
      ).toBeTruthy();
      expect(screen.getByText("Últimas 1 unidades disponibles")).toBeTruthy();
    });

    it("16. No permite aumentar la cantidad por encima del stock", () => {
      mostrarDetalle(crearProducto({ stock: 2 }));

      const aumentar = screen.getByRole("button", { name: "+" });
      const disminuir = screen.getByRole("button", { name: "−" });

      expect(disminuir.disabled).toBe(true);
      fireEvent.click(aumentar);
      expect(aumentar.disabled).toBe(true);
      expect(document.querySelector(".detalle-selector-cantidad strong").textContent)
        .toBe("2");
    });

    it("17. Impide la compra al administrador", () => {
      // La cuenta 0 es Administrador en usuarios.js.
      localStorage.setItem("usuarioActualId", "0");
      mostrarDetalle(crearProducto());

      expect(
        screen.getByText("La cuenta de administrador no puede realizar compras.")
      ).toBeTruthy();
      expect(
        screen.queryByRole("button", { name: "AGREGAR AL CARRITO" })
      ).toBeNull();
    });

    it("18. Deshabilita la compra si el stock ya se agotó", () => {
      mostrarDetalle(crearProducto({ stock: 0, estado: "Sin stock" }));

      expect(screen.getByText("Sin stock disponible")).toBeTruthy();
      expect(screen.getByRole("button", { name: "SIN STOCK" }).disabled)
        .toBe(true);
    });

    it("19. Descuenta del stock disponible lo que ya está en el carrito", () => {
      localStorage.setItem("carrito_invitado", JSON.stringify([
        {
          codigo: 10,
          nombre: "GORILA BURGER",
          precio: 8000,
          cantidad: 2,
          stock: 3
        }
      ]));
      mostrarDetalle(crearProducto({ stock: 3 }));

      expect(screen.getByText("Últimas 1 unidades disponibles")).toBeTruthy();
      expect(screen.getByRole("button", { name: "+" }).disabled)
        .toBe(true);
    });
  });
});
