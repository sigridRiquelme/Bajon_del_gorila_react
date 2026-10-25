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

import Login from "../components/Login.jsx";
import Registro from "../components/Registro.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { obtenerUsuarios } from "../data/usuarios.js";

// MOCK: aislamos el menú lateral. La validación real de roles
// sigue ejecutándose dentro de AdminLayout.
vi.mock("../components/admin/AdminSidebar.jsx", () => ({
  default: () => <nav>Menú administrativo simulado</nav>
}));

// Rutas de prueba para verificar hacia dónde navega Login.
function mostrarLogin() {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<p>Inicio de prueba</p>} />
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
  render(
    <MemoryRouter>
      <Registro />
    </MemoryRouter>
  );
}

function completarRegistro({
  nombre = "Camila de Prueba",
  correo = "camila@gmail.com",
  password = "123456",
  confirmPassword = "123456",
  telefono = "12345678",
  direccion = "Av. Principal 1234, Santiago"
} = {}) {
  const completar = (etiqueta, valor) => {
    fireEvent.change(screen.getByLabelText(etiqueta), {
      target: { value: valor }
    });
  };

  completar("Nombre completo", nombre);
  completar("Correo electrónico", correo);
  completar("Contraseña", password);
  completar("Confirmar contraseña", confirmPassword);
  // El campo ya muestra el prefijo +569 fuera del input.
  completar("Teléfono", telefono);
  completar("Dirección", direccion);

  fireEvent.click(screen.getByRole("button", { name: "REGISTRARME" }));
}

function mostrarRutaAdmin() {
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route
          path="/login"
          element={<p>Acceso restringido de prueba</p>}
        />
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={<p>Contenido protegido de prueba</p>}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("Acceso, registro y roles", () => {
  beforeEach(() => {
    localStorage.clear();
    obtenerUsuarios(); // Restaura los tres usuarios de prueba.
  });

  afterEach(() => {
    cleanup();
  });

  // LOGIN
  it("1. Rechaza el inicio de sesión con campos vacíos", () => {
    mostrarLogin();
    fireEvent.click(screen.getByRole("button", { name: "INGRESAR" }));

    expect(screen.getByText("Completa todos los campos.")).toBeTruthy();
    expect(localStorage.getItem("usuarioActualId")).toBeNull();
  });

  it("2. Rechaza un correo que no está registrado", () => {
    mostrarLogin();
    ingresarCredenciales("desconocido@gmail.com", "1234");

    expect(screen.getByText("El correo no está registrado.")).toBeTruthy();
    expect(localStorage.getItem("usuarioActualId")).toBeNull();
  });

  it("3. Rechaza una contraseña incorrecta", () => {
    mostrarLogin();
    ingresarCredenciales("juan@gmail.com", "incorrecta");

    expect(screen.getByText("La contraseña es incorrecta.")).toBeTruthy();
    expect(localStorage.getItem("usuarioActualId")).toBeNull();
  });

  it("4. Permite entrar a un cliente con sus credenciales", () => {
    mostrarLogin();
    ingresarCredenciales("juan@gmail.com", "1234");

    expect(localStorage.getItem("usuarioActualId")).toBe("1");
    expect(screen.getByText("Inicio de prueba")).toBeTruthy();
  });

  it("5. Envía al administrador a su panel", () => {
    mostrarLogin();
    ingresarCredenciales("admin@gmail.com", "admin123");

    expect(localStorage.getItem("usuarioActualId")).toBe("0");
    expect(screen.getByText("Panel admin de prueba")).toBeTruthy();
  });

  // REGISTRO
  it("6. Impide registrar un correo que ya existe", () => {
    mostrarRegistro();
    completarRegistro({ correo: "juan@gmail.com" });

    expect(screen.getByText("Este correo ya está registrado.")).toBeTruthy();
    expect(obtenerUsuarios()).toHaveLength(3);
  });

  it("7. Rechaza un correo de un dominio no permitido", () => {
    mostrarRegistro();
    completarRegistro({ correo: "camila@hotmail.com" });

    expect(
      screen.getByText("El correo debe ser Gmail, Duoc o Duoc UC.")
    ).toBeTruthy();
    expect(obtenerUsuarios()).toHaveLength(3);
  });

  it("8. Rechaza contraseñas que no coinciden", () => {
    mostrarRegistro();
    completarRegistro({ confirmPassword: "654321" });

    expect(screen.getByText("Las contraseñas no coinciden.")).toBeTruthy();
    expect(obtenerUsuarios()).toHaveLength(3);
  });

  it("9. Registra un cliente con datos válidos", () => {
    mostrarRegistro();
    completarRegistro({ correo: "CAMILA@GMAIL.COM" });

    expect(screen.getByText("Usuario registrado correctamente.")).toBeTruthy();

    const usuarios = obtenerUsuarios();
    const nuevo = usuarios.find((u) => u.correo === "camila@gmail.com");

    expect(usuarios).toHaveLength(4);
    expect(nuevo).toBeDefined();
    expect(nuevo.nombre).toBe("Camila de Prueba");
    expect(nuevo.rol).toBe("Cliente");
  });

  // PROTECCIÓN DE RUTAS
  it("10. Impide que un invitado entre al panel admin", () => {
    mostrarRutaAdmin();

    expect(screen.getByText("Acceso restringido de prueba")).toBeTruthy();
    expect(screen.queryByText("Contenido protegido de prueba")).toBeNull();
  });

  it("11. Impide que un cliente entre al panel admin", () => {
    localStorage.setItem("usuarioActualId", "1");
    mostrarRutaAdmin();

    expect(screen.getByText("Acceso restringido de prueba")).toBeTruthy();
    expect(screen.queryByText("Contenido protegido de prueba")).toBeNull();
  });

  it("12. Permite que el administrador acceda al panel", () => {
    localStorage.setItem("usuarioActualId", "0");
    mostrarRutaAdmin();

    expect(screen.getByText("Contenido protegido de prueba")).toBeTruthy();
    expect(screen.getByText("Menú administrativo simulado")).toBeTruthy();
  });
});
