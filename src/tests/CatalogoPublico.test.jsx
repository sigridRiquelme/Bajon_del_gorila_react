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
import { obtenerProductos } from "../data/productos.js";

// Aislamos el catálogo de localStorage. La lógica real de las páginas
// y del componente ProductoCard sigue funcionando durante las pruebas.
vi.mock("../data/productos.js", () => ({
  obtenerProductos: vi.fn(),
  obtenerPrecioFinal: vi.fn((producto) => {
    if (!producto.promocion || producto.descuento <= 0) {
      return producto.precio;
    }
    return Math.round(
      producto.precio * (1 - producto.descuento / 100)
    );
  })
}));

const productosPrueba = [
  {
    codigo: 1,
    nombre: "Hamburguesa Clásica",
    categoria: "Hamburguesas",
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
    nombre: "Fajita Italiana",
    categoria: "Fajitas",
    descripcion: "Fajita con palta",
    precio: 4990,
    stock: 10,
    estado: "Disponible",
    promocion: false,
    descuento: 0,
    valoracion: 4.6,
    imagen: "/img/fajita.png"
  },
  {
    codigo: 4,
    nombre: "Combo Bajón",
    categoria: "Combos",
    descripcion: "Combo de la casa",
    precio: 10990,
    stock: 10,
    estado: "Disponible",
    promocion: false,
    descuento: 0,
    valoracion: 4.9,
    imagen: "/img/combo.png"
  },
  {
    codigo: 5,
    nombre: "Bebida Grande",
    categoria: "Bebidas",
    descripcion: "Bebida refrescante",
    precio: 2490,
    stock: 10,
    estado: "Disponible",
    promocion: false,
    descuento: 0,
    valoracion: 4.5,
    imagen: "/img/bebida.png"
  },
  {
    codigo: 6,
    nombre: "Producto Oculto",
    categoria: "Papas",
    descripcion: "No está publicado",
    precio: 3000,
    stock: 10,
    estado: "Oculto",
    promocion: true,
    descuento: 30,
    valoracion: 4.0,
    imagen: "/img/oculto.png"
  }
];

function mostrarPagina(Componente) {
  return render(
    <MemoryRouter>
      <Componente />
    </MemoryRouter>
  );
}

describe("Catálogo público: Inicio, Menú y Promociones", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Cada llamada obtiene su propia copia de los productos.
    obtenerProductos.mockImplementation(() =>
      productosPrueba.map((producto) => ({ ...producto }))
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe("Inicio", () => {
    it("1. Muestra como máximo cuatro productos destacados visibles", () => {
      const { container } = mostrarPagina(Inicio);

      expect(
        container.querySelectorAll(".tarjeta-producto")
      ).toHaveLength(4);
      expect(
        screen.getByRole("heading", { name: "Hamburguesa Clásica" })
      ).toBeTruthy();
      expect(
        screen.queryByRole("heading", { name: "Bebida Grande" })
      ).toBeNull();
      expect(
        screen.queryByRole("heading", { name: "Producto Oculto" })
      ).toBeNull();
    });

    it("2. Muestra la oferta semanal y calcula el descuento", () => {
      const { container } = mostrarPagina(Inicio);
      const oferta = container.querySelector(".promocion-semanal");

      expect(oferta).not.toBeNull();
      expect(oferta.textContent).toContain("Papa Suprema");
      expect(
        oferta.querySelector(".precio-grande").textContent.trim()
      ).toBe("$8.000");
      expect(
        screen.getByRole("link", { name: /QUIERO ESTA PROMO/i })
          .getAttribute("href")
      ).toBe("/producto/2");
    });

    it("3. Oculta la oferta semanal cuando no hay promociones activas", () => {
      obtenerProductos.mockReturnValue(
        productosPrueba.map((p) => ({ ...p, promocion: false }))
      );

      const { container } = mostrarPagina(Inicio);
      expect(container.querySelector(".promocion-semanal")).toBeNull();
    });

    it("4. Muestra un estado vacío cuando no hay productos publicados", () => {
      obtenerProductos.mockReturnValue([
        { ...productosPrueba[5] }
      ]);

      mostrarPagina(Inicio);
      expect(
        screen.getByRole("heading", {
          name: "NO HAY PRODUCTOS DISPONIBLES"
        })
      ).toBeTruthy();
    });

    it("5. Tiene un enlace funcional hacia el Menú", () => {
      mostrarPagina(Inicio);
      expect(
        screen.getByRole("link", { name: "VER EL MENÚ" })
          .getAttribute("href")
      ).toBe("/menu");
    });

    it("6. Permite agregar un producto desde Inicio al carrito", () => {
      mostrarPagina(Inicio);
      fireEvent.click(
        screen.getAllByRole("button", { name: "AGREGAR" })[0]
      );

      const carrito = JSON.parse(
        localStorage.getItem("carrito_invitado")
      );
      expect(carrito).toHaveLength(1);
      expect(carrito[0].codigo).toBe(1);
      expect(carrito[0].cantidad).toBe(1);
    });
  });

  describe("Menú", () => {
    it("7. Lista los productos publicados pero no los ocultos", () => {
      const { container } = mostrarPagina(Menu);

      expect(
        container.querySelectorAll(".tarjeta-producto")
      ).toHaveLength(5);
      expect(
        screen.queryByRole("heading", { name: "Producto Oculto" })
      ).toBeNull();
    });

    it("8. Busca por nombre sin importar mayúsculas ni tildes", () => {
      mostrarPagina(Menu);
      fireEvent.change(screen.getByRole("searchbox"), {
        target: { value: "CLASICA" }
      });

      expect(
        screen.getByRole("heading", { name: "Hamburguesa Clásica" })
      ).toBeTruthy();
      expect(
        screen.queryByRole("heading", { name: "Fajita Italiana" })
      ).toBeNull();
    });

    it("9. Filtra los productos por categoría", () => {
      const { container } = mostrarPagina(Menu);
      const [categoria] = screen.getAllByRole("combobox");

      fireEvent.change(categoria, { target: { value: "Papas" } });

      expect(
        container.querySelectorAll(".tarjeta-producto")
      ).toHaveLength(1);
      expect(
        screen.getByRole("heading", { name: "Papa Suprema" })
      ).toBeTruthy();
    });

    it("10. Ordena los productos desde el precio más bajo", () => {
      const { container } = mostrarPagina(Menu);
      const [, orden] = screen.getAllByRole("combobox");

      fireEvent.change(orden, {
        target: { value: "Menor precio" }
      });

      const nombres = Array.from(
        container.querySelectorAll(".grilla-productos .titulo-producto")
      ).map((elemento) => elemento.textContent.trim());

      expect(nombres).toEqual([
        "Bebida Grande",
        "Fajita Italiana",
        "Hamburguesa Clásica",
        "Papa Suprema",
        "Combo Bajón"
      ]);
    });

    it("11. Muestra un aviso cuando la búsqueda no tiene resultados", () => {
      mostrarPagina(Menu);
      fireEvent.change(screen.getByRole("searchbox"), {
        target: { value: "producto-inexistente-xyz" }
      });

      expect(
        screen.getByRole("heading", { name: "NO ENCONTRAMOS ESO" })
      ).toBeTruthy();
    });
  });

  describe("Promociones", () => {
    it("12. Muestra solo descuentos activos y excluye productos ocultos", () => {
      const { container } = mostrarPagina(Promociones);

      expect(
        container.querySelectorAll(".tarjeta-producto")
      ).toHaveLength(1);
      expect(
        screen.getByRole("heading", { name: "Papa Suprema" })
      ).toBeTruthy();
      expect(
        screen.queryByRole("heading", { name: "Producto Oculto" })
      ).toBeNull();
    });

    it("13. Muestra un mensaje cuando no hay descuentos activos", () => {
      obtenerProductos.mockReturnValue(
        productosPrueba.map((p) => ({ ...p, promocion: false }))
      );

      mostrarPagina(Promociones);
      expect(
        screen.getByRole("heading", {
          name: "NO HAY PROMOCIONES ACTIVAS"
        })
      ).toBeTruthy();
    });

    it("14. Agrega al carrito el precio final con descuento", () => {
      mostrarPagina(Promociones);
      fireEvent.click(
        screen.getByRole("button", { name: "AGREGAR" })
      );

      const carrito = JSON.parse(
        localStorage.getItem("carrito_invitado")
      );

      expect(carrito).toHaveLength(1);
      expect(carrito[0].codigo).toBe(2);
      expect(carrito[0].precio).toBe(8000);
      expect(carrito[0].cantidad).toBe(1);
    });

    it("15. Impide agregar productos si accede el administrador", () => {
      localStorage.setItem("usuarioActualId", "0");
      const { container } = mostrarPagina(Promociones);

      const botones = Array.from(
        container.querySelectorAll(".boton-agregar")
      );
      expect(botones).toHaveLength(1);
      expect(botones[0].disabled).toBe(true);
      expect(localStorage.getItem("carrito_0")).toBeNull();
    });
  });
});
