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
  waitFor
} from "@testing-library/react";

import {
  MemoryRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "../components/Login.jsx";
import Registro from "../components/Registro.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

import {
  iniciarSesionApi,
  registrarUsuarioApi
} from "../api/auth.js";

vi.mock("../api/auth.js", () => ({
  iniciarSesionApi: vi.fn(),
  registrarUsuarioApi: vi.fn(),
  obtenerMiPerfilApi: vi.fn(),
  actualizarMiPerfilApi: vi.fn()
}));

vi.mock("../components/admin/AdminSidebar.jsx", () => ({
  default: () => <nav>Menú administrativo simulado</nav>
}));

function mostrarLogin(estado = undefined) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/login", state: estado }]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<p>Inicio de prueba</p>} />
        <Route path="/checkout" element={<p>Checkout de prueba</p>} />
        <Route path="/admin" element={<p>Panel admin de prueba</p>} />
      </Routes>
    </MemoryRouter>
  );
}

function ingresarCredenciales(correo, password) {
  fireEvent.change(screen.getByLabelText("Correo electrónico"), {
    target: { value: correo }
  });

  fireEvent.change(screen.getByLabelText("Contraseña"), {
    target: { value: password }
  });

  fireEvent.click(screen.getByRole("button", { name: "INGRESAR" }));
}

function mostrarRegistro() {
  return render(
    <MemoryRouter>
      <Registro />
    </MemoryRouter>
  );
}

function completarRegistro() {
  fireEvent.change(screen.getByLabelText("Nombre completo"), {
    target: { value: "Camila Prueba" }
  });
  fireEvent.change(screen.getByLabelText("Correo electrónico"), {
    target: { value: "camila@gmail.com" }
  });
  fireEvent.change(screen.getByLabelText("Contraseña"), {
    target: { value: "123456" }
  });
  fireEvent.change(screen.getByLabelText("Confirmar contraseña"), {
    target: { value: "123456" }
  });
  fireEvent.change(screen.getByLabelText("Teléfono"), {
    target: { value: "12345678" }
  });
  fireEvent.change(screen.getByLabelText("Dirección"), {
    target: { value: "Av. Principal 1234, Santiago" }
  });
  fireEvent.click(screen.getByRole("button", { name: "REGISTRARME" }));
}

function mostrarRutaAdmin() {
  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route path="/login" element={<p>Acceso restringido de prueba</p>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<p>Contenido protegido de prueba</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("Acceso, registro y roles", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("valida campos vacíos del login", () => {
    mostrarLogin();
    fireEvent.click(screen.getByRole("button", { name: "INGRESAR" }));
    expect(screen.getByText("Completa todos los campos.")).toBeTruthy();
    expect(iniciarSesionApi).not.toHaveBeenCalled();
  });

  it("guarda sesión y envía al cliente al inicio", async () => {
    iniciarSesionApi.mockResolvedValue({
      token: "token-cliente",
      idUsuario: 7,
      rol: "CLIENTE",
      nombre: "Cliente Prueba",
      correo: "cliente@gmail.com"
    });

    mostrarLogin();
    ingresarCredenciales("CLIENTE@gmail.com", "1234");

    expect(await screen.findByText("Inicio de prueba")).toBeTruthy();
    expect(localStorage.getItem("token")).toBe("token-cliente");
    expect(localStorage.getItem("usuarioActualId")).toBe("7");
    expect(localStorage.getItem("usuarioRol")).toBe("CLIENTE");
    expect(iniciarSesionApi).toHaveBeenCalledWith("cliente@gmail.com", "1234");
  });

  it("envía administrador y vendedor al panel", async () => {
    iniciarSesionApi.mockResolvedValue({
      token: "token-admin",
      idUsuario: 1,
      rol: "ADMINISTRADOR",
      nombre: "Admin",
      correo: "admin@gmail.com"
    });

    mostrarLogin();
    ingresarCredenciales("admin@gmail.com", "Admin1234");
    expect(await screen.findByText("Panel admin de prueba")).toBeTruthy();
  });

  it("muestra el error entregado por backend al iniciar sesión", async () => {
    iniciarSesionApi.mockRejectedValue({
      response: { data: { mensaje: "CREDENCIALES INVALIDAS" } }
    });

    mostrarLogin();
    ingresarCredenciales("error@gmail.com", "1234");
    expect(await screen.findByText("CREDENCIALES INVALIDAS")).toBeTruthy();
  });

  it("registra un cliente usando la API", async () => {
    registrarUsuarioApi.mockResolvedValue({ idUsuario: 20 });
    mostrarRegistro();
    completarRegistro();

    expect(await screen.findByText("Usuario registrado correctamente.")).toBeTruthy();
    expect(registrarUsuarioApi).toHaveBeenCalledWith(expect.objectContaining({
      nombre: "Camila Prueba",
      correo: "camila@gmail.com",
      password: "123456",
      telefono: "+569 12345678"
    }));
  });

  it("muestra correo repetido informado por backend", async () => {
    registrarUsuarioApi.mockRejectedValue({
      response: { data: { mensaje: "EL CORREO YA ESTA REGISTRADO" } }
    });

    mostrarRegistro();
    completarRegistro();
    expect(await screen.findByText("Este correo ya está registrado.")).toBeTruthy();
  });

  it("AdminLayout rechaza una sesión inexistente", () => {
    mostrarRutaAdmin();
    expect(screen.getByText("Acceso restringido de prueba")).toBeTruthy();
  });

  it("AdminLayout permite administrador y vendedor con JWT", () => {
    localStorage.setItem("token", "token-prueba");
    localStorage.setItem("usuarioRol", "ADMINISTRADOR");

    mostrarRutaAdmin();
    expect(screen.getByText("Contenido protegido de prueba")).toBeTruthy();
  });
});
