import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";

import Pedidos from "../pages/admin/Pedidos.jsx";
import PedidoFila from "../components/admin/PedidoFila.jsx";
import {
  obtenerPedidos,
  obtenerPedidoPorCodigo,
  crearPedido,
} from "../data/pedidos.js";

// Datos aislados para las pruebas. No tocamos el catálogo real del equipo.
const usuariosPrueba = [
  {
    id: 0,
    nombre: "Administrador",
    correo: "admin@gmail.com",
    password: "admin123",
    telefono: "+569 11112222",
    direccion: "Av. Central 100, Santiago",
    rol: "Administrador",
  },
  {
    id: 1,
    nombre: "Juan Pérez",
    correo: "juan@gmail.com",
    password: "1234",
    telefono: "+569 12345678",
    direccion: "Av. Libertador 1540, Santiago",
    rol: "Cliente",
  },
];

const pedidoDelivery = {
  codigo: 1,
  usuarioId: 1,
  cliente: "Nombre anterior",
  correo: "juan@gmail.com",
  telefono: "+569 12345678",
  fecha: "24/10/2026",
  hora: "13:15",
  tipoEntrega: "Delivery",
  direccion: "Av. Libertador 1540, Santiago",
  comuna: "Santiago",
  referencia: "Portón negro",
  medioPago: "Tarjeta",
  subtotal: 11980,
  costoDelivery: 2000,
  neto: 11748,
  iva: 2232,
  total: 13980,
  productos: [
    {
      codigoProducto: 1,
      nombre: "Hamburguesa Clásica",
      cantidad: 2,
      precio: 5990,
      imagen: "/img/hamburguesa.png",
    },
  ],
};

const pedidoRetiro = {
  codigo: 2,
  usuarioId: null,
  cliente: "Invitada Laura",
  correo: "laura@gmail.com",
  telefono: "+569 87654321",
  fecha: "24/10/2026",
  hora: "14:20",
  tipoEntrega: "Retiro en local",
  direccion: "Retiro en local",
  comuna: "",
  referencia: "",
  medioPago: "Efectivo",
  subtotal: 8990,
  costoDelivery: 0,
  neto: 7555,
  iva: 1435,
  total: 8990,
  productos: [
    {
      codigoProducto: 2,
      nombre: "Papa Suprema",
      cantidad: 1,
      precio: 8990,
      imagen: "/img/papa.png",
    },
  ],
};

const guardarPedidosPrueba = (pedidos) => {
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
};

const abrirDetalle = (indice = 0) => {
  fireEvent.click(
    screen.getAllByRole("button", { name: "Ver detalle" })[indice]
  );
};

const texto = (elemento) => elemento?.textContent?.replace(/\s+/g, " ").trim();
const compacto = (elemento) => elemento?.textContent?.replace(/\s+/g, "");

beforeEach(() => {
  localStorage.clear();
  guardarPedidosPrueba([pedidoDelivery, pedidoRetiro]);
  localStorage.setItem("usuarios", JSON.stringify(usuariosPrueba));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("AdminPedidos: almacenamiento de pedidos", () => {
  it("1. Obtiene todos los pedidos guardados", () => {
    expect(obtenerPedidos()).toHaveLength(2);
  });

  it("2. Devuelve una lista nueva sin exponer el arreglo original", () => {
    const listaA = obtenerPedidos();
    const listaB = obtenerPedidos();
    expect(listaA).not.toBe(listaB);
    expect(listaA).toEqual(listaB);
  });

  it("3. Busca un pedido por su código", () => {
    expect(obtenerPedidoPorCodigo(2)?.cliente).toBe("Invitada Laura");
  });

  it("4. Devuelve undefined cuando el código no existe", () => {
    expect(obtenerPedidoPorCodigo(999)).toBeUndefined();
  });

  it("5. Asigna el siguiente código al crear un pedido", () => {
    const creado = crearPedido({ ...pedidoRetiro, codigo: undefined });
    expect(creado.codigo).toBe(3);
  });

  it("6. Conserva los datos del cliente y los productos al crear", () => {
    const creado = crearPedido({ ...pedidoRetiro, codigo: undefined });
    expect(creado.cliente).toBe("Invitada Laura");
    expect(creado.total).toBe(8990);
    expect(creado.productos[0].cantidad).toBe(1);
  });

  it("7. Persiste la creación de un pedido en localStorage", () => {
    crearPedido({ ...pedidoRetiro, codigo: undefined });
    expect(JSON.parse(localStorage.getItem("pedidos"))).toHaveLength(3);
  });

  it("8. Agrega nuevos pedidos sin eliminar los anteriores", () => {
    crearPedido({ ...pedidoRetiro, codigo: undefined });
    expect(obtenerPedidos().map((pedido) => pedido.codigo)).toEqual([1, 2, 3]);
  });

  it("9. Genera el código 1 cuando no hay pedidos anteriores", () => {
    guardarPedidosPrueba([]);
    const creado = crearPedido({ ...pedidoRetiro, codigo: undefined });
    expect(creado.codigo).toBe(1);
  });

  it("10. Usa el código máximo más uno aunque existan saltos", () => {
    guardarPedidosPrueba([{ ...pedidoRetiro, codigo: 10 }]);
    expect(crearPedido({ ...pedidoRetiro, codigo: undefined }).codigo).toBe(11);
  });
});

describe("AdminPedidos: pantalla de administración", () => {
  it("11. Muestra el número total de pedidos registrados", () => {
    const { container } = render(<Pedidos />);
    expect(texto(container.querySelector(".encabezado-pedidos p"))).toBe("2 pedidos");
  });

  it("12. Lista los pedidos con su código y total", () => {
    const { container } = render(<Pedidos />);
    const filas = container.querySelectorAll(".tabla-pedidos tbody tr");
    expect(filas).toHaveLength(2);
    expect(texto(filas[0])).toContain("#1");
    expect(texto(filas[0])).toContain("$13.980");
  });

  it("13. Muestra el nombre actualizado del cliente registrado", () => {
    const { container } = render(<Pedidos />);
    const primeraFila = container.querySelector(".tabla-pedidos tbody tr");
    expect(texto(primeraFila)).toContain("Juan Pérez");
    expect(texto(primeraFila)).not.toContain("Nombre anterior");
  });

  it("14. Muestra el nombre guardado cuando la compra fue como invitado", () => {
    const { container } = render(<Pedidos />);
    const filas = container.querySelectorAll(".tabla-pedidos tbody tr");
    expect(texto(filas[1])).toContain("Invitada Laura");
  });

  it("15. Muestra 'Invitado' si el pedido invitado no trae nombre", () => {
    guardarPedidosPrueba([{ ...pedidoRetiro, cliente: "" }]);
    const { container } = render(<Pedidos />);
    expect(texto(container.querySelector(".tabla-pedidos tbody tr"))).toContain("Invitado");
  });

  it("16. Usa el nombre del pedido cuando ya no existe el usuario", () => {
    guardarPedidosPrueba([{ ...pedidoDelivery, usuarioId: 999, cliente: "Cliente antiguo" }]);
    const { container } = render(<Pedidos />);
    expect(texto(container.querySelector(".tabla-pedidos tbody tr"))).toContain("Cliente antiguo");
  });

  it("17. Informa cuando no hay pedidos registrados", () => {
    guardarPedidosPrueba([]);
    render(<Pedidos />);
    expect(screen.getByText("No hay pedidos registrados.")).toBeTruthy();
  });

  it("18. Abre la boleta correspondiente al pulsar Ver detalle", () => {
    const { container } = render(<Pedidos />);
    abrirDetalle(0);
    expect(texto(container.querySelector(".detalle-pedido h2"))).toBe("Pedido #1");
  });

  it("19. Abre el pedido correcto al pulsar la segunda fila", () => {
    const { container } = render(<Pedidos />);
    abrirDetalle(1);
    expect(texto(container.querySelector(".detalle-pedido h2"))).toBe("Pedido #2");
  });

  it("20. Cierra el detalle sin eliminar el pedido", () => {
    const { container } = render(<Pedidos />);
    abrirDetalle(0);
    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(container.querySelector(".detalle-pedido")).toBeNull();
    expect(obtenerPedidos()).toHaveLength(2);
  });

  it("21. Identifica al cliente registrado en la boleta", () => {
    const { container } = render(<Pedidos />);
    abrirDetalle(0);
    expect(texto(container.querySelector(".datos-pedido"))).toContain("Registrado");
    expect(texto(container.querySelector(".datos-pedido"))).toContain("Juan Pérez");
  });

  it("22. Identifica al invitado en la boleta", () => {
    const { container } = render(<Pedidos />);
    abrirDetalle(1);
    expect(texto(container.querySelector(".datos-pedido"))).toContain("Invitado");
  });

  it("23. Muestra dirección, comuna y referencia de un delivery", () => {
    const { container } = render(<Pedidos />);
    abrirDetalle(0);
    const datos = texto(container.querySelector(".datos-pedido"));
    expect(datos).toContain("Av. Libertador 1540, Santiago");
    expect(compacto(container.querySelector(".datos-pedido"))).toContain("ComunaSantiago");
    expect(datos).toContain("Portón negro");
  });

  it("24. Indica retiro en local sin mostrar información de delivery", () => {
    const { container } = render(<Pedidos />);
    abrirDetalle(1);
    const datos = texto(container.querySelector(".datos-pedido"));
    expect(datos).toContain("Retiro en local");
    expect(datos).not.toContain("Comuna");
  });

  it("25. Calcula el precio de cada producto según su cantidad", () => {
    const { container } = render(<Pedidos />);
    abrirDetalle(0);
    const fila = texto(container.querySelector(".producto-pedido"));
    expect(fila).toContain("Hamburguesa Clásica");
    expect(compacto(container.querySelector(".producto-pedido"))).toContain("$5.990×2");
    expect(fila).toContain("$11.980");
  });

  it("26. Muestra subtotal, delivery, neto, IVA y total de la boleta", () => {
    const { container } = render(<Pedidos />);
    abrirDetalle(0);
    const resumen = texto(container.querySelector(".resumen-boleta"));
    expect(compacto(container.querySelector(".resumen-boleta"))).toContain("Subtotal$11.980");
    expect(compacto(container.querySelector(".resumen-boleta"))).toContain("Delivery$2.000");
    expect(compacto(container.querySelector(".resumen-boleta"))).toContain("Neto$11.748");
    expect(compacto(container.querySelector(".resumen-boleta"))).toContain("IVA19%$2.232");
    expect(compacto(container.querySelector(".resumen-boleta"))).toContain("Total$13.980");
  });

  it("27. Recupera neto, IVA y subtotal de pedidos antiguos", () => {
    guardarPedidosPrueba([{
      ...pedidoDelivery,
      neto: undefined,
      iva: undefined,
      subtotal: undefined,
      total: 11900,
      costoDelivery: 2000,
    }]);
    const { container } = render(<Pedidos />);
    abrirDetalle();
    const resumen = texto(container.querySelector(".resumen-boleta"));
    expect(compacto(container.querySelector(".resumen-boleta"))).toContain("Subtotal$9.900");
    expect(compacto(container.querySelector(".resumen-boleta"))).toContain("Neto$10.000");
    expect(compacto(container.querySelector(".resumen-boleta"))).toContain("IVA19%$1.900");
  });

  it("28. Usa textos alternativos para datos antiguos sin hora ni medio de pago", () => {
    guardarPedidosPrueba([{
      ...pedidoRetiro,
      hora: "",
      medioPago: "",
    }]);
    const { container } = render(<Pedidos />);
    abrirDetalle();
    expect(texto(container.querySelector(".datos-pedido"))).toContain("No registrada");
    expect(texto(container.querySelector(".datos-pedido"))).toContain("No registrado");
  });
});

describe("AdminPedidos: componente PedidoFila y eventos", () => {
  it("29. Envía el código del pedido al callback al hacer clic", () => {
    const onVerDetalle = vi.fn();
    render(
      <table><tbody>
        <PedidoFila
          codigo={42}
          cliente="Cliente de prueba"
          fecha="24/10/2026"
          total={6500}
          onVerDetalle={onVerDetalle}
        />
      </tbody></table>
    );
    fireEvent.click(screen.getByRole("button", { name: "Ver detalle" }));
    expect(onVerDetalle).toHaveBeenCalledTimes(1);
    expect(onVerDetalle).toHaveBeenCalledWith(42);
  });

  it("30. Representa los datos y el precio de una fila", () => {
    const { container } = render(
      <table><tbody>
        <PedidoFila
          codigo={7}
          cliente="Cliente especial"
          fecha="24/10/2026"
          total={12980}
          onVerDetalle={() => {}}
        />
      </tbody></table>
    );
    const fila = texto(container.querySelector("tbody tr"));
    expect(fila).toContain("#7");
    expect(fila).toContain("Cliente especial");
    expect(fila).toContain("24/10/2026");
    expect(fila).toContain("$12.980");
  });
});
