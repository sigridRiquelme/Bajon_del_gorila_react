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

import Pedidos from "../pages/admin/Pedidos.jsx";
import PedidoFila from "../components/admin/PedidoFila.jsx";
import {
  obtenerPedidosApi,
  obtenerDetallePedidoApi
} from "../api/pedidos.js";

vi.mock("../api/pedidos.js", () => ({
  obtenerPedidosApi: vi.fn(),
  obtenerDetallePedidoApi: vi.fn(),
  obtenerMisPedidosApi: vi.fn(),
  obtenerPedidosConDetallesApi: vi.fn(),
  crearPedidoApi: vi.fn()
}));

const pedidos = [
  {
    codigo: 2,
    usuarioId: null,
    cliente: "Invitada Laura",
    fecha: "24/10/2026",
    tipoEntrega: "Retiro en local",
    total: 8990
  },
  {
    codigo: 1,
    usuarioId: 1,
    cliente: "Juan Pérez",
    fecha: "24/10/2026",
    tipoEntrega: "Delivery",
    total: 13980
  }
];

const detalle = {
  codigo: 1,
  usuarioId: 1,
  cliente: "Juan Pérez",
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
      precio: 5990
    }
  ]
};

describe("Administración de pedidos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    obtenerPedidosApi.mockResolvedValue(pedidos);
    obtenerDetallePedidoApi.mockResolvedValue(detalle);
  });

  afterEach(() => cleanup());

  it("carga pedidos reales desde API", async () => {
    render(<Pedidos />);
    expect(await screen.findByText("2 pedidos")).toBeTruthy();
    expect(screen.getByText("Juan Pérez")).toBeTruthy();
    expect(screen.getByText("Invitada Laura")).toBeTruthy();
    expect(obtenerPedidosApi).toHaveBeenCalledTimes(1);
  });

  it("ordena los pedidos más nuevos primero", async () => {
    const { container } = render(<Pedidos />);
    await screen.findByText("2 pedidos");
    const filas = container.querySelectorAll(".tabla-pedidos tbody tr");
    expect(filas[0].textContent).toContain("#2");
  });

  it("abre el detalle consultándolo al backend", async () => {
    render(<Pedidos />);
    await screen.findByText("2 pedidos");
    fireEvent.click(screen.getAllByRole("button", { name: "Ver detalle" })[1]);

    expect(await screen.findByText("Pedido #1")).toBeTruthy();
    expect(obtenerDetallePedidoApi).toHaveBeenCalledWith(1);
    expect(screen.getByText("Hamburguesa Clásica")).toBeTruthy();
    expect(screen.getByText("Av. Libertador 1540, Santiago")).toBeTruthy();
  });

  it("cierra el detalle sin modificar pedidos", async () => {
    render(<Pedidos />);
    await screen.findByText("2 pedidos");
    fireEvent.click(screen.getAllByRole("button", { name: "Ver detalle" })[1]);
    await screen.findByText("Pedido #1");
    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(screen.queryByText("Pedido #1")).toBeNull();
  });

  it("muestra mensaje si no existen pedidos", async () => {
    obtenerPedidosApi.mockResolvedValue([]);
    render(<Pedidos />);
    expect(await screen.findByText("No hay pedidos registrados.")).toBeTruthy();
  });

  it("muestra error si falla la API", async () => {
    obtenerPedidosApi.mockRejectedValue(new Error("Error"));
    render(<Pedidos />);
    expect(await screen.findByText("No fue posible cargar los pedidos.")).toBeTruthy();
  });

  it("PedidoFila envía el código al callback", () => {
    const onVerDetalle = vi.fn();
    render(
      <table>
        <tbody>
          <PedidoFila
            codigo={42}
            cliente="Cliente"
            fecha="24/10/2026"
            entrega="Delivery"
            total={6500}
            onVerDetalle={onVerDetalle}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByRole("button", { name: "Ver detalle" }));
    expect(onVerDetalle).toHaveBeenCalledWith(42);
  });
});
