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
  cleanup,
  within,
  act
} from "@testing-library/react";

import {
  MemoryRouter,
  Routes,
  Route
} from "react-router-dom";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Contacto from "../components/Contacto.jsx";
import Nosotros from "../components/Nosotros.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import PerfilCliente from "../pages/PerfilCliente.jsx";
import PerfilAdmin from "../pages/admin/PerfilAdmin.jsx";
import {
  obtenerMiPerfilApi,
  actualizarMiPerfilApi
} from "../api/auth.js";
import { obtenerMisPedidosApi } from "../api/pedidos.js";

vi.mock("../api/auth.js", () => ({
  obtenerMiPerfilApi: vi.fn(),
  actualizarMiPerfilApi: vi.fn(),
  iniciarSesionApi: vi.fn(),
  registrarUsuarioApi: vi.fn()
}));

vi.mock("../api/pedidos.js", () => ({
  obtenerMisPedidosApi: vi.fn(),
  obtenerPedidosApi: vi.fn(),
  obtenerDetallePedidoApi: vi.fn(),
  obtenerPedidosConDetallesApi: vi.fn(),
  crearPedidoApi: vi.fn()
}));

const cliente = {
  idUsuario: 2,
  nombre: "Juan Prueba",
  correo: "juan@gmail.com",
  telefono: "+569 12345678",
  direccion: "Av. Libertador 1540, Santiago",
  rol: "CLIENTE"
};

const admin = {
  idUsuario: 1,
  nombre: "Administrador",
  correo: "admin@gmail.com",
  telefono: "+569 11112222",
  direccion: "Av. Principal 1234, Santiago",
  rol: "ADMINISTRADOR"
};

const pedido = {
  codigo: 71,
  usuarioId: 2,
  cliente: "Juan Prueba",
  fecha: "24/10/2026",
  hora: "18:00",
  medioPago: "Tarjeta",
  tipoEntrega: "Delivery",
  direccion: "Av. Libertador 1540, Santiago",
  comuna: "Santiago",
  subtotal: 5000,
  costoDelivery: 2000,
  neto: 5882,
  iva: 1118,
  total: 7000,
  productos: [
    { codigoProducto: 1, nombre: "Hamburguesa Prueba", precio: 5000, cantidad: 1 }
  ]
};

const montar = (componente, ruta = "/") => render(
  <MemoryRouter initialEntries={[ruta]}>{componente}</MemoryRouter>
);

function sesion(rol, id = 1) {
  localStorage.setItem("token", `token-${rol}`);
  localStorage.setItem("usuarioRol", rol);
  localStorage.setItem("usuarioActualId", String(id));
}

function montarPerfilCliente() {
  return montar(
    <Routes>
      <Route path="/perfil" element={<PerfilCliente />} />
      <Route path="/login" element={<h1>Destino Login</h1>} />
      <Route path="/admin/perfil" element={<h1>Destino Perfil Admin</h1>} />
    </Routes>,
    "/perfil"
  );
}

function montarAdminLayout() {
  return montar(
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<h1>Dashboard protegido</h1>} />
      </Route>
      <Route path="/login" element={<h1>Destino Login</h1>} />
    </Routes>,
    "/admin"
  );
}

describe("Navegación y perfiles", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
    obtenerMiPerfilApi.mockResolvedValue(cliente);
    obtenerMisPedidosApi.mockResolvedValue([pedido]);
    actualizarMiPerfilApi.mockResolvedValue(cliente);
  });

  afterEach(() => cleanup());

  it("Header ofrece navegación pública", () => {
    montar(<Header />);
    const nav = screen.getByRole("navigation", { name: "Navegación principal" });
    expect(within(nav).getByRole("link", { name: "Inicio" })).toBeTruthy();
    expect(within(nav).getByRole("link", { name: "Menú" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Mi cuenta" }).getAttribute("href"))
      .toBe("/login");
  });

  it("Header reconoce cliente, admin y vendedor mediante token y rol", () => {
    sesion("CLIENTE", 2);
    const { unmount } = montar(<Header />);
    expect(screen.getByRole("link", { name: "Mi cuenta" }).getAttribute("href"))
      .toBe("/perfil");
    unmount();

    sesion("ADMINISTRADOR", 1);
    montar(<Header />);
    expect(screen.getByRole("link", { name: "PANEL ADMIN" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Carrito" })).toBeNull();
  });

  it("Header actualiza contador del carrito", () => {
    localStorage.setItem("carrito_invitado", JSON.stringify([{ codigo: 1, cantidad: 4 }]));
    montar(<Header />);
    act(() => window.dispatchEvent(new Event("carritoActualizado")));
    expect(screen.getByRole("link", { name: "Carrito" }).textContent.trim()).toBe("4");
  });

  it("Footer y layout público se renderizan", () => {
    const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    montar(
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/contacto" element={<h1>Contenido de prueba</h1>} />
        </Route>
      </Routes>,
      "/contacto"
    );
    expect(screen.getByRole("heading", { name: "Contenido de prueba" })).toBeTruthy();
    expect(screen.getByText("hola@elbajondelgorila.cl")).toBeTruthy();
    expect(scroll).toHaveBeenCalled();
  });

  it("Sidebar muestra usuarios solo al administrador", () => {
    sesion("ADMINISTRADOR");
    const { unmount } = montar(<AdminSidebar />, "/admin");
    expect(screen.getByRole("link", { name: "Usuarios" })).toBeTruthy();
    unmount();

    sesion("VENDEDOR", 3);
    montar(<AdminSidebar />, "/admin");
    expect(screen.queryByRole("link", { name: "Usuarios" })).toBeNull();
  });

  it("AdminLayout permite admin y vendedor y rechaza cliente", () => {
    sesion("ADMINISTRADOR");
    const { unmount } = montarAdminLayout();
    expect(screen.getByRole("heading", { name: "Dashboard protegido" })).toBeTruthy();
    unmount();

    localStorage.clear();
    sesion("CLIENTE", 2);
    montarAdminLayout();
    expect(screen.getByRole("heading", { name: "Destino Login" })).toBeTruthy();
  });

  it("PerfilCliente redirige según rol", () => {
    montarPerfilCliente();
    expect(screen.getByRole("heading", { name: "Destino Login" })).toBeTruthy();
    cleanup();

    sesion("ADMINISTRADOR");
    montarPerfilCliente();
    expect(screen.getByRole("heading", { name: "Destino Perfil Admin" })).toBeTruthy();
  });

  it("PerfilCliente carga datos y boletas desde APIs", async () => {
    sesion("CLIENTE", 2);
    montarPerfilCliente();
    expect(await screen.findByRole("heading", { name: "MI PERFIL" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Juan Prueba" })).toBeTruthy();
    expect(screen.getByText(/#71/)).toBeTruthy();
  });

  it("PerfilCliente abre detalle y actualiza datos", async () => {
    sesion("CLIENTE", 2);
    actualizarMiPerfilApi.mockResolvedValue({ ...cliente, nombre: "Juan Actualizado" });
    montarPerfilCliente();
    await screen.findByRole("heading", { name: "Juan Prueba" });

    fireEvent.click(screen.getByRole("button", { name: "VER DETALLE" }));
    expect(screen.getByText("Hamburguesa Prueba")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "EDITAR" }));
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Juan Actualizado" }
    });
    fireEvent.click(screen.getByRole("button", { name: "GUARDAR CAMBIOS" }));
    expect(await screen.findByText("Datos actualizados correctamente.")).toBeTruthy();
    expect(actualizarMiPerfilApi).toHaveBeenCalled();
  });

  it("PerfilAdmin carga y actualiza el usuario autenticado", async () => {
    sesion("ADMINISTRADOR");
    obtenerMiPerfilApi.mockResolvedValue(admin);
    actualizarMiPerfilApi.mockResolvedValue({ ...admin, nombre: "Admin Actualizado" });

    render(<PerfilAdmin />);
    expect(await screen.findByRole("heading", { name: "Perfil" })).toBeTruthy();
    expect(screen.getByText("admin@gmail.com")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Editar perfil/i }));
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Admin Actualizado" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(await screen.findByText("Los datos del perfil fueron actualizados correctamente."))
      .toBeTruthy();
  });

  it("Contacto y Nosotros mantienen sus contenidos", () => {
    const { unmount } = render(<Contacto />);
    fireEvent.click(screen.getByRole("button", { name: "ENVIAR MENSAJE" }));
    expect(screen.getByText("El nombre debe tener al menos 3 caracteres.")).toBeTruthy();
    unmount();

    render(<Nosotros />);
    expect(screen.getByRole("heading", { name: "EL BAJÓN DEL GORILA" })).toBeTruthy();
  });
});
