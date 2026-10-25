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
import { MemoryRouter } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard.jsx";
import ReporteVentas from "../pages/admin/ReporteVentas.jsx";
import ReporteProductosVendidos from "../pages/admin/ReporteProductosVendidos.jsx";
import ReporteUsuarios from "../pages/admin/ReporteUsuarios.jsx";
import ReporteInventario from "../pages/admin/ReporteInventario.jsx";

// Datos ficticios, independientes de las cuentas, pedidos y productos del navegador.
// Octubre tiene dos ventas y septiembre una, para probar filtros de fechas.
const usuariosPrueba = [
  {
    id: 0, nombre: "Administrador", correo: "admin@gmail.com",
    telefono: "+569 11111111", direccion: "Av. Central 100, Santiago",
    rol: "Administrador"
  },
  {
    id: 1, nombre: "Ana Rojas", correo: "ana@gmail.com",
    telefono: "+569 12345678", direccion: "Av. Central 123, Santiago",
    rol: "Cliente"
  },
  {
    id: 2, nombre: "Bruno Soto", correo: "bruno@gmail.com",
    telefono: "+569 22223333", direccion: "Calle Larga 456, Santiago",
    rol: "Cliente"
  },
  {
    id: 3, nombre: "Celia Díaz", correo: "celia@gmail.com",
    telefono: "+569 33334444", direccion: "Pasaje Corto 789, Santiago",
    rol: "Cliente"
  }
];

const productosPrueba = [
  {
    codigo: 1, nombre: "Hamburguesa Clásica", categoria: "Hamburguesas",
    stock: 12, precio: 5000, estado: "Disponible", promocion: false, descuento: 0
  },
  {
    codigo: 2, nombre: "Papa Suprema", categoria: "Papas",
    stock: 4, precio: 2000, estado: "Disponible", promocion: false, descuento: 0
  },
  {
    codigo: 3, nombre: "Fajita Italiana", categoria: "Fajitas",
    stock: 0, precio: 3000, estado: "Sin stock", promocion: false, descuento: 0
  }
];

const pedidosPrueba = [
  {
    codigo: 11, usuarioId: 1, cliente: "Nombre anterior de Ana",
    fecha: "05/10/2026", total: 14000, subtotal: 12000, costoDelivery: 2000,
    productos: [
      { codigoProducto: 1, nombre: "Hamburguesa Clásica", cantidad: 2, precio: 5000 },
      { codigoProducto: 2, nombre: "Papa Suprema", cantidad: 1, precio: 2000 }
    ]
  },
  {
    codigo: 12, usuarioId: 2, cliente: "Bruno Soto",
    fecha: "05/10/2026", total: 6000, subtotal: 6000, costoDelivery: 0,
    productos: [
      { codigoProducto: 2, nombre: "Papa Suprema", cantidad: 3, precio: 2000 }
    ]
  },
  {
    codigo: 13, usuarioId: null, cliente: "Invitado Sol",
    fecha: "18/09/2026", total: 5000, subtotal: 5000, costoDelivery: 0,
    productos: [
      { codigoProducto: 1, nombre: "Hamburguesa Clásica", cantidad: 1, precio: 5000 }
    ]
  }
];

const guardar = (clave, contenido) => {
  localStorage.setItem(clave, JSON.stringify(contenido));
};

const tarjetasReporte = (contenedor) =>
  [...contenedor.querySelectorAll(".reporte-card-bootstrap h3")]
    .map((elemento) => elemento.textContent.trim());

const cambiarFiltro = (tipo, fecha, etiqueta = "Mostrar por") => {
  fireEvent.change(screen.getByLabelText(etiqueta), {
    target: { value: tipo }
  });

  if (fecha !== undefined) {
    const etiquetaFecha = tipo === "dia" ? "Seleccionar día" :
      tipo === "mes" ? "Seleccionar mes" : "Seleccionar año";
    fireEvent.change(screen.getByLabelText(etiquetaFecha), {
      target: { value: fecha }
    });
  }
};

const obtenerFila = (contenedor, texto) =>
  [...contenedor.querySelectorAll("tbody tr")]
    .find((fila) => fila.textContent.includes(texto));

beforeEach(() => {
  localStorage.clear();
  guardar("usuarios", usuariosPrueba);
  guardar("productos", productosPrueba);
  guardar("pedidos", pedidosPrueba);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Dashboard: accesos administrativos", () => {
  it("1. Muestra los cuatro accesos principales del panel", () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Panel de administración" })).toBeTruthy();
    for (const nombre of ["Productos", "Pedidos", "Usuarios", "Reportes"]) {
      expect(screen.getByRole("heading", { name: nombre })).toBeTruthy();
    }
  });

  it("2. Envía cada tarjeta a su ruta correspondiente", () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);

    expect(screen.getByRole("link", { name: /Productos Gestionar productos/i }).getAttribute("href"))
      .toBe("/admin/productos");
    expect(screen.getByRole("link", { name: /Pedidos Revisar órdenes/i }).getAttribute("href"))
      .toBe("/admin/pedidos");
    expect(screen.getByRole("link", { name: /Usuarios Revisar usuarios/i }).getAttribute("href"))
      .toBe("/admin/usuarios");
    expect(screen.getByRole("link", { name: /Reportes Consultar reportes/i }).getAttribute("href"))
      .toBe("/admin/reportes/ventas");
  });
});

describe("Reporte de ventas: totales, clientes y filtros", () => {
  it("3. Cuenta ventas y calcula el monto total y promedio", () => {
    const { container } = render(<ReporteVentas />);
    expect(tarjetasReporte(container)).toEqual(["3", "$25.000", "$8.333"]);
  });

  it("4. Agrupa pedidos de la misma fecha y suma sus ventas", () => {
    const { container } = render(<ReporteVentas />);
    const tabla = [...container.querySelectorAll("table")][0];
    const fila = within(tabla).getByText("05/10/2026").closest("tr");

    expect(fila.children[1].textContent.trim()).toBe("2");
    expect(fila.children[2].textContent.trim()).toBe("$20.000");
  });

  it("5. Usa el nombre actualizado del cliente y el nombre del invitado", () => {
    const { container } = render(<ReporteVentas />);
    const tabla = [...container.querySelectorAll("table")][1];
    expect(within(tabla).getByText("Ana Rojas")).toBeTruthy();
    expect(within(tabla).getByText("Invitado Sol")).toBeTruthy();
    expect(within(tabla).queryByText("Nombre anterior de Ana")).toBeNull();
  });

  it("6. Cuenta las unidades incluidas en cada boleta", () => {
    const { container } = render(<ReporteVentas />);
    const detalle = [...container.querySelectorAll("table")][1];
    const fila = within(detalle).getByText("#11").closest("tr");
    expect(fila.children[3].textContent.trim()).toBe("3");
  });

  it("7. Filtra las ventas de un día específico", () => {
    const { container } = render(<ReporteVentas />);
    cambiarFiltro("dia", "2026-09-18");

    expect(tarjetasReporte(container)).toEqual(["1", "$5.000", "$5.000"]);
    expect(screen.getByText("#13")).toBeTruthy();
    expect(screen.queryByText("#11")).toBeNull();
  });

  it("8. Filtra por mes sin mezclar ventas de otros meses", () => {
    const { container } = render(<ReporteVentas />);
    cambiarFiltro("mes", "2026-10");
    expect(tarjetasReporte(container)).toEqual(["2", "$20.000", "$10.000"]);
  });

  it("9. Filtra las ventas por año", () => {
    const { container } = render(<ReporteVentas />);
    cambiarFiltro("anio", "2026");
    expect(tarjetasReporte(container)[0]).toBe("3");
    expect(tarjetasReporte(container)[1]).toBe("$25.000");
  });

  it("10. Muestra avisos y montos en cero si no hay ventas para ese año", () => {
    const { container } = render(<ReporteVentas />);
    cambiarFiltro("anio", "2025");
    expect(tarjetasReporte(container)).toEqual(["0", "$0", "$0"]);
    expect(screen.getAllByText("No hay ventas para el filtro seleccionado.")).toHaveLength(2);
  });

  it("11. Limpia la fecha al cambiar el tipo de filtro", () => {
    const { container } = render(<ReporteVentas />);
    cambiarFiltro("mes", "2026-09");
    expect(tarjetasReporte(container)[0]).toBe("1");

    fireEvent.change(screen.getByLabelText("Mostrar por"), {
      target: { value: "dia" }
    });

    expect(screen.getByLabelText("Seleccionar día").value).toBe("");
    expect(tarjetasReporte(container)[0]).toBe("0");
  });

  it("12. Muestra estadísticas vacías si el sistema no tiene pedidos", () => {
    guardar("pedidos", []);
    const { container } = render(<ReporteVentas />);
    expect(tarjetasReporte(container)).toEqual(["0", "$0", "$0"]);
    expect(screen.getAllByText("No hay ventas para el filtro seleccionado.")).toHaveLength(2);
  });
});

describe("Reporte de productos vendidos: unidades, ingresos y categorías", () => {
  it("13. Identifica como más vendido al producto con más unidades", () => {
    const { container } = render(<ReporteProductosVendidos />);
    expect(tarjetasReporte(container)[0]).toBe("Papa Suprema");
  });

  it("14. Suma unidades vendidas de todas las boletas", () => {
    const { container } = render(<ReporteProductosVendidos />);
    expect(tarjetasReporte(container)[1]).toBe("7");
  });

  it("15. Calcula ingresos de productos sin sumar el recargo de delivery", () => {
    const { container } = render(<ReporteProductosVendidos />);
    expect(tarjetasReporte(container)[2]).toBe("$23.000");
  });

  it("16. Agrupa las unidades e ingresos por producto", () => {
    const { container } = render(<ReporteProductosVendidos />);
    const tabla = [...container.querySelectorAll("table")][0];
    const filaPapa = within(tabla).getByText("Papa Suprema").closest("tr");
    const filaBurger = within(tabla).getByText("Hamburguesa Clásica").closest("tr");

    expect(filaPapa.children[1].textContent.trim()).toBe("4");
    expect(filaPapa.children[2].textContent.trim()).toBe("$8.000");
    expect(filaBurger.children[1].textContent.trim()).toBe("3");
    expect(filaBurger.children[2].textContent.trim()).toBe("$15.000");
  });

  it("17. Agrupa ventas por categoría correctamente", () => {
    const { container } = render(<ReporteProductosVendidos />);
    const tabla = [...container.querySelectorAll("table")][1];
    const filaPapas = within(tabla).getByText("Papas").closest("tr");
    expect(filaPapas.children[1].textContent.trim()).toBe("4");
    expect(filaPapas.children[2].textContent.trim()).toBe("$8.000");
  });

  it("18. Filtra los productos vendidos por día", () => {
    const { container } = render(<ReporteProductosVendidos />);
    cambiarFiltro("dia", "2026-09-18");
    expect(tarjetasReporte(container)).toEqual(["Hamburguesa Clásica", "1", "$5.000"]);
  });

  it("19. Filtra por mes y recalcula unidades e ingresos", () => {
    const { container } = render(<ReporteProductosVendidos />);
    cambiarFiltro("mes", "2026-10");
    expect(tarjetasReporte(container)).toEqual(["Papa Suprema", "6", "$18.000"]);
  });

  it("20. Permite filtrar los productos vendidos por año", () => {
    const { container } = render(<ReporteProductosVendidos />);
    cambiarFiltro("anio", "2026");
    expect(tarjetasReporte(container)[1]).toBe("7");
  });

  it("21. Muestra reportes vacíos cuando no hay ventas", () => {
    guardar("pedidos", []);
    const { container } = render(<ReporteProductosVendidos />);
    expect(tarjetasReporte(container)).toEqual(["Sin ventas", "0", "$0"]);
    expect(screen.getByText("No hay productos vendidos para el filtro seleccionado.")).toBeTruthy();
    expect(screen.getByText("No hay categorías con ventas para el filtro seleccionado.")).toBeTruthy();
  });

  it("22. Agrupa productos que ya no existen en el catálogo como sin categoría", () => {
    const pedidos = JSON.parse(JSON.stringify(pedidosPrueba));
    pedidos[0].productos.push({
      codigoProducto: 99, nombre: "Producto retirado", cantidad: 1, precio: 1000
    });
    guardar("pedidos", pedidos);
    const { container } = render(<ReporteProductosVendidos />);

    expect(tarjetasReporte(container)[1]).toBe("8");
    const tabla = [...container.querySelectorAll("table")][1];
    const fila = within(tabla).getByText("Sin categoría").closest("tr");
    expect(fila.children[1].textContent.trim()).toBe("1");
    expect(fila.children[2].textContent.trim()).toBe("$1.000");
  });
});

describe("Reporte de usuarios: actividad y montos", () => {
  it("23. Cuenta clientes, compradores, clientes sin compras y administradores", () => {
    const { container } = render(<ReporteUsuarios />);
    expect(tarjetasReporte(container)).toEqual(["3", "2", "1", "1"]);
  });

  it("24. Calcula cuánto ha gastado cada cliente registrado", () => {
    const { container } = render(<ReporteUsuarios />);
    const filaAna = obtenerFila(container, "#1 Ana Rojas");
    const filaBruno = obtenerFila(container, "#2 Bruno Soto");

    expect(filaAna.children[5].textContent.trim()).toBe("1");
    expect(filaAna.children[6].textContent.trim()).toBe("$14.000");
    expect(filaBruno.children[5].textContent.trim()).toBe("1");
    expect(filaBruno.children[6].textContent.trim()).toBe("$6.000");
  });

  it("25. Muestra cero compras y cero gasto para un usuario inactivo", () => {
    const { container } = render(<ReporteUsuarios />);
    const filaCelia = obtenerFila(container, "#3 Celia Díaz");
    expect(filaCelia.children[5].textContent.trim()).toBe("0");
    expect(filaCelia.children[6].textContent.trim()).toBe("$0");
  });

  it("26. Los pedidos de invitados no cuentan como compras de clientes registrados", () => {
    const pedidos = JSON.parse(JSON.stringify(pedidosPrueba));
    pedidos.push({
      codigo: 14, usuarioId: null, cliente: "Otra invitada",
      fecha: "06/10/2026", total: 1000, productos: []
    });
    guardar("pedidos", pedidos);
    const { container } = render(<ReporteUsuarios />);
    expect(tarjetasReporte(container)).toEqual(["3", "2", "1", "1"]);
  });

  it("27. Sin pedidos, todos los clientes figuran sin compras", () => {
    guardar("pedidos", []);
    const { container } = render(<ReporteUsuarios />);
    expect(tarjetasReporte(container)).toEqual(["3", "0", "3", "1"]);
  });
});

describe("Reporte de inventario: cantidades y clasificación", () => {
  const valorResumen = (container, etiqueta) => {
    const tarjeta = [...container.querySelectorAll(".resumen-inventario-card")]
      .find((elemento) => elemento.textContent.includes(etiqueta));
    return tarjeta?.querySelector("strong")?.textContent.trim();
  };

  it("28. Cuenta productos y calcula el stock acumulado", () => {
    const { container } = render(<ReporteInventario />);
    expect(valorResumen(container, "Productos registrados")).toBe("3");
    expect(valorResumen(container, "Stock total")).toBe("16");
  });

  it("29. Distingue productos de stock crítico de productos agotados", () => {
    const { container } = render(<ReporteInventario />);
    expect(valorResumen(container, "Stock crítico")).toBe("1");
    expect(valorResumen(container, "Sin stock")).toBe("1");
  });

  it("30. Agrupa el inventario por categorías y muestra el stock de cada artículo", () => {
    const { container } = render(<ReporteInventario />);
    const categoriaPapas = [...container.querySelectorAll(".inventario-categoria")]
      .find((elemento) => elemento.querySelector("h2")?.textContent === "Papas");
    expect(categoriaPapas).toBeTruthy();
    expect(categoriaPapas.textContent).toContain("Papa Suprema");
    expect(categoriaPapas.textContent).toContain("Stock: 4");
  });

  it("31. Muestra totales en cero cuando el catálogo no tiene productos", () => {
    guardar("productos", []);
    const { container } = render(<ReporteInventario />);
    expect(valorResumen(container, "Productos registrados")).toBe("0");
    expect(valorResumen(container, "Stock total")).toBe("0");
    expect(valorResumen(container, "Stock crítico")).toBe("0");
    expect(valorResumen(container, "Sin stock")).toBe("0");
    expect(container.querySelectorAll(".inventario-categoria")).toHaveLength(0);
  });
});
