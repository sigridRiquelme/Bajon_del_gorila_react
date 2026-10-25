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

import Productos from "../pages/admin/Productos.jsx";
import ProductosCriticos from "../pages/admin/ProductosCriticos.jsx";
import ReporteInventario from "../pages/admin/ReporteInventario.jsx";
import {
  obtenerProductos,
  obtenerProductoPorCodigo,
  agregarProducto,
  actualizarProducto,
  eliminarProducto
} from "../data/productos.js";

// Datos controlados para que cada prueba comience en el mismo estado.
// El localStorage usado por Vitest/jsdom es independiente del navegador real.
const productosIniciales = [
  {
    codigo: 1,
    nombre: "Hamburguesa Clásica",
    categoria: "Hamburguesas",
    descripcion: "Hamburguesa de carne con queso cheddar",
    precio: 5990,
    stock: 15,
    estado: "Disponible",
    promocion: false,
    descuento: 0,
    imagen: "/img/hamburguesa-clasica.png"
  },
  {
    codigo: 2,
    nombre: "Papa Suprema",
    categoria: "Papas",
    descripcion: "Papas fritas con queso cheddar",
    precio: 8990,
    stock: 4,
    estado: "Disponible",
    promocion: true,
    descuento: 20,
    imagen: "/img/papa-suprema.png"
  },
  {
    codigo: 3,
    nombre: "Fajita Italiana",
    categoria: "Fajitas",
    descripcion: "Fajita rellena con carne y palta",
    precio: 4990,
    stock: 0,
    estado: "Sin stock",
    promocion: false,
    descuento: 0,
    imagen: "/img/fajita-italiana.png"
  }
];

const renderizarProductos = () => render(<Productos />);

const abrirFormularioNuevo = () => {
  fireEvent.click(screen.getByRole("button", { name: /\+ AGREGAR PRODUCTO/i }));
};

const cambiarCampo = (etiqueta, valor) => {
  fireEvent.change(screen.getByLabelText(etiqueta), {
    target: { value: valor }
  });
};

const filaDelProducto = (nombre) => {
  const celda = screen.getByText(nombre);
  return celda.closest("tr");
};

const guardarNuevo = () => {
  fireEvent.click(screen.getByRole("button", { name: "AGREGAR PRODUCTO" }));
};

const datosValidos = () => {
  cambiarCampo("Nombre del producto", "Combo Familiar");
  cambiarCampo("Categoría", "Combos");
  cambiarCampo("Descripción", "Combo con hamburguesas y papas");
  cambiarCampo("Precio", "12990");
  cambiarCampo("Stock", "8");
};

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("productos", JSON.stringify(productosIniciales));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Administración: lógica real de productos (CRUD)", () => {
  it("1. Recupera los productos almacenados", () => {
    expect(obtenerProductos()).toHaveLength(3);
    expect(obtenerProductos().map(p => p.nombre)).toContain("Papa Suprema");
  });

  it("2. Completa los campos opcionales de un producto antiguo", () => {
    localStorage.setItem("productos", JSON.stringify([
      { codigo: 9, nombre: "Producto antiguo", categoria: "Otros", precio: 3000, stock: 2, estado: "Disponible", imagen: "/img/test.png" }
    ]));

    const [producto] = obtenerProductos();
    expect(producto.promocion).toBe(false);
    expect(producto.descuento).toBe(0);
    expect(producto.descripcion).toBe("Producto disponible en El Bajón del Gorila.");
  });

  it("3. Busca por código y devuelve undefined si no existe", () => {
    expect(obtenerProductoPorCodigo(2).nombre).toBe("Papa Suprema");
    expect(obtenerProductoPorCodigo(999)).toBeUndefined();
  });

  it("4. Crea un producto con código nuevo y valores de promoción por defecto", () => {
    const creado = agregarProducto({
      nombre: "Nuevo combo", categoria: "Combos", precio: 7000,
      stock: 7, estado: "Disponible", imagen: "/img/nuevo.png"
    });
    expect(creado.codigo).toBe(4);
    expect(creado.promocion).toBe(false);
    expect(creado.descuento).toBe(0);
    expect(obtenerProductos()).toHaveLength(4);
  });

  it("5. Edita y conserva el código del producto", () => {
    actualizarProducto(1, { nombre: "Hamburguesa Editada", precio: 7000 });
    const actualizado = obtenerProductoPorCodigo(1);
    expect(actualizado.nombre).toBe("Hamburguesa Editada");
    expect(actualizado.precio).toBe(7000);
    expect(actualizado.codigo).toBe(1);
  });

  it("6. Elimina únicamente el producto solicitado", () => {
    eliminarProducto(2);
    expect(obtenerProductoPorCodigo(2)).toBeUndefined();
    expect(obtenerProductos().map(p => p.codigo)).toEqual([1, 3]);
  });
});

describe("Administración: pantalla de gestión Productos.jsx", () => {
  it("7. Muestra las filas del catálogo con precios, estados y promociones", () => {
    renderizarProductos();
    expect(screen.getAllByRole("row")).toHaveLength(4); // Encabezado + tres productos
    expect(screen.getByText("Hamburguesa Clásica")).toBeTruthy();
    expect(within(filaDelProducto("Papa Suprema")).getByText("20% OFF")).toBeTruthy();
    expect(within(filaDelProducto("Fajita Italiana")).getByText("Sin stock")).toBeTruthy();
  });

  it("8. Filtra por nombre sin importar mayúsculas", () => {
    renderizarProductos();
    fireEvent.change(screen.getByPlaceholderText("Buscar por nombre..."), {
      target: { value: "PAPA" }
    });
    expect(screen.getByText("Papa Suprema")).toBeTruthy();
    expect(screen.queryByText("Hamburguesa Clásica")).toBeNull();
  });

  it("9. Filtra el catálogo por categoría", () => {
    renderizarProductos();
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Fajitas" }
    });
    expect(screen.getByText("Fajita Italiana")).toBeTruthy();
    expect(screen.queryByText("Papa Suprema")).toBeNull();
  });

  it("10. Informa cuando no hay productos que coincidan con la búsqueda", () => {
    renderizarProductos();
    fireEvent.change(screen.getByPlaceholderText("Buscar por nombre..."), {
      target: { value: "producto imposible" }
    });
    expect(screen.getByText("No se encontraron productos.")).toBeTruthy();
  });

  it("11. Abre el formulario para crear y permite cancelarlo", () => {
    renderizarProductos();
    abrirFormularioNuevo();
    expect(screen.getByRole("heading", { name: "Agregar producto" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "CANCELAR" }));
    expect(screen.queryByRole("heading", { name: "Agregar producto" })).toBeNull();
  });

  it("12. Rechaza guardar un formulario vacío y muestra los errores", () => {
    renderizarProductos();
    abrirFormularioNuevo();
    guardarNuevo();
    expect(screen.getByText("El nombre del producto es obligatorio.")).toBeTruthy();
    expect(screen.getByText("La categoría es obligatoria.")).toBeTruthy();
    expect(screen.getByText("El precio es obligatorio.")).toBeTruthy();
    expect(screen.getByText("El stock es obligatorio.")).toBeTruthy();
    expect(screen.getByText("Debes seleccionar una imagen.")).toBeTruthy();
    expect(obtenerProductos()).toHaveLength(3);
  });

  it("13. Exige al menos tres caracteres para el nombre", () => {
    renderizarProductos();
    abrirFormularioNuevo();
    cambiarCampo("Nombre del producto", "AB");
    guardarNuevo();
    expect(screen.getByText("El nombre debe tener al menos 3 caracteres.")).toBeTruthy();
  });

  it("14. Impide precios iguales a cero", () => {
    renderizarProductos();
    abrirFormularioNuevo();
    cambiarCampo("Precio", "0");
    guardarNuevo();
    expect(screen.getByText("El precio debe ser mayor a 0.")).toBeTruthy();
  });

  it("15. Impide stock negativo", () => {
    renderizarProductos();
    abrirFormularioNuevo();
    cambiarCampo("Stock", "-1");
    guardarNuevo();
    expect(screen.getByText("El stock no puede ser negativo.")).toBeTruthy();
  });

  it("16. Valida la longitud mínima de la descripción", () => {
    renderizarProductos();
    abrirFormularioNuevo();
    cambiarCampo("Descripción", "Corta");
    guardarNuevo();
    expect(screen.getByText("La descripción debe tener al menos 10 caracteres.")).toBeTruthy();
  });

  it("17. Muestra el campo de descuento cuando se activa una promoción", () => {
    renderizarProductos();
    abrirFormularioNuevo();
    expect(screen.queryByLabelText("Descuento %")).toBeNull();
    fireEvent.click(screen.getByRole("checkbox", { name: "Producto en promoción" }));
    expect(screen.getByLabelText("Descuento %")).toBeTruthy();
    guardarNuevo();
    expect(screen.getByText("Ingresa el porcentaje de descuento.")).toBeTruthy();
  });

  it("18. Rechaza descuentos mayores al 90%", () => {
    renderizarProductos();
    abrirFormularioNuevo();
    fireEvent.click(screen.getByRole("checkbox", { name: "Producto en promoción" }));
    cambiarCampo("Descuento %", "95");
    guardarNuevo();
    expect(screen.getByText("El descuento debe estar entre 1% y 90%.")).toBeTruthy();
  });

  it("19. Permite editar precio y nombre de un producto existente", () => {
    renderizarProductos();
    fireEvent.click(within(filaDelProducto("Hamburguesa Clásica")).getByRole("button", { name: "Editar" }));
    expect(screen.getByRole("heading", { name: "Editar producto" })).toBeTruthy();
    cambiarCampo("Nombre del producto", "Hamburguesa Especial");
    cambiarCampo("Precio", "7990");
    fireEvent.click(screen.getByRole("button", { name: "GUARDAR CAMBIOS" }));
    const actualizado = obtenerProductoPorCodigo(1);
    expect(actualizado.nombre).toBe("Hamburguesa Especial");
    expect(actualizado.precio).toBe(7990);
    expect(screen.getByText("Hamburguesa Especial")).toBeTruthy();
  });

  it("20. Apaga una promoción y elimina su porcentaje de descuento", () => {
    renderizarProductos();
    fireEvent.click(within(filaDelProducto("Papa Suprema")).getByRole("button", { name: "Editar" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Producto en promoción" }));
    fireEvent.click(screen.getByRole("button", { name: "GUARDAR CAMBIOS" }));
    const actualizado = obtenerProductoPorCodigo(2);
    expect(actualizado.promocion).toBe(false);
    expect(actualizado.descuento).toBe(0);
  });

  it("21. Cambia automáticamente a Sin stock cuando se edita el stock a cero", () => {
    renderizarProductos();
    fireEvent.click(within(filaDelProducto("Hamburguesa Clásica")).getByRole("button", { name: "Editar" }));
    cambiarCampo("Stock", "0");
    fireEvent.click(screen.getByRole("button", { name: "GUARDAR CAMBIOS" }));
    expect(obtenerProductoPorCodigo(1).estado).toBe("Sin stock");
  });

  it("22. Crea un producto desde el formulario incluyendo una imagen simulada", () => {
    // Mock exclusivo de la lectura del archivo; no se sube nada a internet.
    class LectorImagenSimulado {
      constructor() { this.result = null; this.onload = null; }
      readAsDataURL() {
        this.result = "data:image/png;base64,VEVTVA==";
        if (this.onload) this.onload();
      }
    }
    vi.stubGlobal("FileReader", LectorImagenSimulado);

    renderizarProductos();
    abrirFormularioNuevo();
    datosValidos();
    const archivo = new File(["test"], "foto.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Seleccionar imagen"), {
      target: { files: [archivo] }
    });
    guardarNuevo();
    const creado = obtenerProductos().find(p => p.nombre === "Combo Familiar");
    expect(creado).toBeDefined();
    expect(creado.precio).toBe(12990);
    expect(creado.stock).toBe(8);
    expect(creado.imagen).toContain("data:image/png;base64,");
    expect(screen.getByText("Combo Familiar")).toBeTruthy();
  });

  it("23. Elimina un producto desde la tabla", () => {
    renderizarProductos();
    fireEvent.click(within(filaDelProducto("Papa Suprema")).getByRole("button", { name: "Eliminar" }));
    expect(obtenerProductoPorCodigo(2)).toBeUndefined();
    expect(screen.queryByText("Papa Suprema")).toBeNull();
    expect(obtenerProductos()).toHaveLength(2);
  });
});

describe("Administración: productos críticos e inventario", () => {
  it("24. Identifica productos críticos y sin stock (stock menor o igual a cinco)", () => {
    render(<ProductosCriticos />);
    expect(screen.getByText("Papa Suprema")).toBeTruthy();
    expect(screen.getByText("Fajita Italiana")).toBeTruthy();
    expect(screen.queryByText("Hamburguesa Clásica")).toBeNull();
    expect(screen.getByText("Stock crítico")).toBeTruthy();
    expect(screen.getByText("Sin stock")).toBeTruthy();
  });

  it("25. Muestra el aviso cuando no existen productos críticos", () => {
    localStorage.setItem("productos", JSON.stringify(
      productosIniciales.map(p => ({ ...p, stock: 12, estado: "Disponible" }))
    ));
    render(<ProductosCriticos />);
    expect(screen.getByText("No hay productos con stock crítico.")).toBeTruthy();
  });

  it("26. Calcula totales, productos críticos y agotados en el inventario", () => {
    const { container } = render(<ReporteInventario />);
    const tarjetas = container.querySelectorAll(".resumen-inventario-card");
    const resumen = [...tarjetas].map(t => t.textContent.replace(/\s+/g, " ").trim());
    expect(resumen).toContain("Productos registrados3");
    expect(resumen).toContain("Stock total19");
    expect(resumen).toContain("Stock crítico1");
    expect(resumen).toContain("Sin stock1");
  });

  it("27. Agrupa el inventario por categorías y muestra el stock por producto", () => {
    const { container } = render(<ReporteInventario />);
    const grupos = container.querySelectorAll(".inventario-categoria");
    expect(grupos).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "Hamburguesas" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Papas" })).toBeTruthy();
    expect(screen.getByText("Stock: 15")).toBeTruthy();
    expect(screen.getByText("Stock: 0")).toBeTruthy();
  });
});
