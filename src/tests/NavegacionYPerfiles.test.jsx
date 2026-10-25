import {
  describe, it, expect, beforeEach, afterEach, vi
} from "vitest";
import {
  render, screen, within, fireEvent, act, cleanup
} from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Contacto from "../components/Contacto.jsx";
import Nosotros from "../components/Nosotros.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import PerfilCliente from "../pages/PerfilCliente.jsx";
import PerfilAdmin from "../pages/admin/PerfilAdmin.jsx";

// Datos aislados: ninguna prueba cambia los usuarios o pedidos de tu navegador.
const usuariosPrueba = [
  {
    id: 0, nombre: "Administrador", correo: "admin@gmail.com",
    password: "admin123", telefono: "+569 11112222",
    direccion: "Av. Principal 1234, Santiago", rol: "Administrador"
  },
  {
    id: 1, nombre: "Juan Prueba", correo: "juan@gmail.com",
    password: "1234", telefono: "+569 12345678",
    direccion: "Av. Libertador 1540, Santiago", rol: "Cliente"
  },
  {
    id: 2, nombre: "María Prueba", correo: "maria@gmail.com",
    password: "1234", telefono: "+569 87654321",
    direccion: "Av. Central 1200, Santiago", rol: "Cliente"
  }
];

const pedidosPrueba = [
  {
    codigo: 71, usuarioId: 1, cliente: "Juan Prueba",
    fecha: "24/10/2026", hora: "18:00", medioPago: "Tarjeta",
    tipoEntrega: "Delivery", direccion: "Av. Libertador 1540, Santiago",
    comuna: "Santiago", subtotal: 5000, costoDelivery: 2000,
    neto: 5882, iva: 1118, total: 7000,
    productos: [
      { codigoProducto: 1, nombre: "Hamburguesa Prueba", precio: 5000, cantidad: 1 }
    ]
  },
  {
    codigo: 72, usuarioId: 2, cliente: "María Prueba",
    fecha: "23/10/2026", hora: "17:30", medioPago: "Efectivo",
    tipoEntrega: "Retiro en local", subtotal: 3000, costoDelivery: 0,
    neto: 2521, iva: 479, total: 3000,
    productos: [
      { codigoProducto: 2, nombre: "Papas Prueba", precio: 3000, cantidad: 1 }
    ]
  }
];

const montar = (componente, ruta = "/") => render(
  <MemoryRouter initialEntries={[ruta]}>{componente}</MemoryRouter>
);

const montarPerfilCliente = () => montar(
  <Routes>
    <Route path="/perfil" element={<PerfilCliente />} />
    <Route path="/login" element={<h1>Destino Login</h1>} />
    <Route path="/admin/perfil" element={<h1>Destino Perfil Admin</h1>} />
  </Routes>,
  "/perfil"
);

const montarAdminLayout = () => montar(
  <Routes>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<h1>Dashboard protegido</h1>} />
    </Route>
    <Route path="/login" element={<h1>Destino Login</h1>} />
  </Routes>,
  "/admin"
);

const completarContacto = (telefono = "") => {
  fireEvent.change(screen.getByLabelText("Nombre completo *"), {
    target: { value: "Juan Prueba" }
  });
  fireEvent.change(screen.getByLabelText("Correo *"), {
    target: { value: "juan@gmail.com" }
  });
  if (telefono !== "") {
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: telefono }
    });
  }
  fireEvent.change(screen.getByLabelText("Motivo de contacto *"), {
    target: { value: "pedido" }
  });
  fireEvent.change(screen.getByLabelText("Mensaje *"), {
    target: { value: "Necesito información sobre mi pedido." }
  });
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem("usuarios", JSON.stringify(usuariosPrueba));
  localStorage.setItem("pedidos", JSON.stringify(pedidosPrueba));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Header: navegación y sesión", () => {
  it("1. Ofrece las cinco rutas principales del sitio", () => {
    montar(<Header />);
    const nav = screen.getByRole("navigation", { name: "Navegación principal" });
    const rutas = [
      ["Inicio", "/"], ["Menú", "/menu"],
      ["Promociones", "/promociones"],
      ["Quiénes Somos", "/nosotros"], ["Contacto", "/contacto"]
    ];
    for (const [nombre, ruta] of rutas) {
      expect(within(nav).getByRole("link", { name: nombre }).getAttribute("href"))
        .toBe(ruta);
    }
  });

  it("2. Envía al invitado a Login y muestra el carrito vacío", () => {
    montar(<Header />);
    expect(screen.getByRole("link", { name: "Mi cuenta" }).getAttribute("href"))
      .toBe("/login");
    expect(screen.getByRole("link", { name: "Carrito" }).textContent.trim())
      .toBe("0");
    expect(screen.getByRole("link", { name: "PEDIR AHORA" }).getAttribute("href"))
      .toBe("/menu");
  });

  it("3. Un cliente ve su perfil y la cantidad guardada en su carrito", () => {
    localStorage.setItem("usuarioActualId", "1");
    localStorage.setItem("carrito_1", JSON.stringify([
      { codigo: 1, cantidad: 2 }, { codigo: 2, cantidad: 3 }
    ]));
    montar(<Header />);
    expect(screen.getByRole("link", { name: "Mi cuenta" }).getAttribute("href"))
      .toBe("/perfil");
    expect(screen.getByRole("link", { name: "Carrito" }).textContent.trim())
      .toBe("5");
  });

  it("4. Actualiza el contador al recibir el evento carritoActualizado", () => {
    montar(<Header />);
    localStorage.setItem("carrito_invitado", JSON.stringify([
      { codigo: 1, cantidad: 4 }
    ]));
    act(() => window.dispatchEvent(new Event("carritoActualizado")));
    expect(screen.getByRole("link", { name: "Carrito" }).textContent.trim())
      .toBe("4");
  });

  it("5. El administrador ve su panel y no muestra acceso al carrito", () => {
    localStorage.setItem("usuarioActualId", "0");
    montar(<Header />);
    expect(screen.getByRole("link", { name: "Mi cuenta" }).getAttribute("href"))
      .toBe("/admin/perfil");
    expect(screen.getByRole("link", { name: "PANEL ADMIN" }).getAttribute("href"))
      .toBe("/admin");
    expect(screen.queryByRole("link", { name: "Carrito" })).toBeNull();
  });
});

describe("Footer y layout público", () => {
  it("6. Ofrece enlaces al menú, promociones y contacto", () => {
    montar(<Footer />);
    expect(screen.getByRole("link", { name: "Hamburguesas" }).getAttribute("href"))
      .toBe("/menu");
    expect(screen.getByRole("link", { name: "Promociones" }).getAttribute("href"))
      .toBe("/promociones");
    expect(screen.getByRole("link", { name: "Contacto" }).getAttribute("href"))
      .toBe("/contacto");
  });

  it("7. Publica datos de contacto y horarios", () => {
    montar(<Footer />);
    expect(screen.getByText("hola@elbajondelgorila.cl")).toBeTruthy();
    expect(screen.getByText(/Lun–Jue: 12:00/)).toBeTruthy();
  });

  it("8. PublicLayout rodea el contenido con Header y Footer", () => {
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
    expect(screen.getByRole("navigation", { name: "Navegación principal" })).toBeTruthy();
    expect(screen.getByText("hola@elbajondelgorila.cl")).toBeTruthy();
    expect(scroll).toHaveBeenCalled();
  });
});

describe("Navegación administrativa", () => {
  it("9. El Sidebar ofrece accesos a Dashboard, Pedidos y Usuarios", () => {
    montar(<AdminSidebar />, "/admin");
    for (const [nombre, ruta] of [
      ["Dashboard", "/admin"], ["Pedidos", "/admin/pedidos"],
      ["Usuarios", "/admin/usuarios"]
    ]) {
      expect(screen.getByRole("link", { name: nombre }).getAttribute("href"))
        .toBe(ruta);
    }
  });

  it("10. Despliega los submenús de Productos y Reportes", () => {
    montar(<AdminSidebar />, "/admin");
    expect(screen.queryByRole("link", { name: "Productos críticos" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Productos" }));
    expect(screen.getByRole("link", { name: "Productos críticos" }).getAttribute("href"))
      .toBe("/admin/productos/criticos");
    fireEvent.click(screen.getByRole("button", { name: "Reportes" }));
    expect(screen.getByRole("link", { name: "Reporte de ventas" }).getAttribute("href"))
      .toBe("/admin/reportes/ventas");
  });

  it("11. Mantiene Productos desplegado si la ruta está dentro de esa sección", () => {
    montar(<AdminSidebar />, "/admin/productos/criticos");
    expect(screen.getByRole("link", { name: "Reporte inventario" }).getAttribute("href"))
      .toBe("/admin/productos/reporte");
  });

  it("12. Cerrar sesión limpia el usuario y navega a Login", () => {
    localStorage.setItem("usuarioActualId", "0");
    montar(
      <Routes>
        <Route path="/admin" element={<AdminSidebar />} />
        <Route path="/login" element={<h1>Destino Login</h1>} />
      </Routes>,
      "/admin"
    );
    fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(localStorage.getItem("usuarioActualId")).toBeNull();
    expect(screen.getByRole("heading", { name: "Destino Login" })).toBeTruthy();
  });

  it("13. AdminLayout redirige a Login si no hay sesión", () => {
    montarAdminLayout();
    expect(screen.getByRole("heading", { name: "Destino Login" })).toBeTruthy();
  });

  it("14. AdminLayout rechaza a un cliente normal", () => {
    localStorage.setItem("usuarioActualId", "1");
    montarAdminLayout();
    expect(screen.getByRole("heading", { name: "Destino Login" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Dashboard protegido" })).toBeNull();
  });

  it("15. AdminLayout permite ingresar a un administrador", () => {
    localStorage.setItem("usuarioActualId", "0");
    montarAdminLayout();
    expect(screen.getByRole("heading", { name: "Dashboard protegido" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "ADMINISTRACIÓN" })).toBeTruthy();
  });
});

describe("Contacto y Nosotros", () => {
  it("16. Contacto valida los campos obligatorios", () => {
    render(<Contacto />);
    fireEvent.click(screen.getByRole("button", { name: "ENVIAR MENSAJE" }));
    expect(screen.getByText("El nombre debe tener al menos 3 caracteres.")).toBeTruthy();
    expect(screen.getByText("Ingresa un correo Gmail, Duoc o DuocUC válido.")).toBeTruthy();
    expect(screen.getByText("Selecciona un motivo de contacto.")).toBeTruthy();
    expect(screen.getByText("El mensaje debe tener al menos 10 caracteres.")).toBeTruthy();
  });

  it("17. Rechaza teléfonos incorrectos cuando se proporciona uno", () => {
    render(<Contacto />);
    completarContacto("123");
    fireEvent.click(screen.getByRole("button", { name: "ENVIAR MENSAJE" }));
    expect(screen.getByText("Ingresa un teléfono válido. Ej: +569 12345678.")).toBeTruthy();
    expect(screen.queryByText(/Mensaje enviado correctamente/)).toBeNull();
  });

  it("18. Confirma el envío simulado y limpia el formulario", () => {
    render(<Contacto />);
    completarContacto();
    fireEvent.click(screen.getByRole("button", { name: "ENVIAR MENSAJE" }));
    expect(screen.getByText("Mensaje enviado correctamente. Nos pondremos en contacto contigo.")).toBeTruthy();
    expect(screen.getByLabelText("Nombre completo *").value).toBe("");
    expect(screen.getByLabelText("Correo *").value).toBe("");
    expect(screen.getByLabelText("Motivo de contacto *").value).toBe("");
  });

  it("19. Acepta teléfonos válidos opcionales en el formulario", () => {
    render(<Contacto />);
    completarContacto("+569 12345678");
    fireEvent.click(screen.getByRole("button", { name: "ENVIAR MENSAJE" }));
    expect(screen.getByText("Mensaje enviado correctamente. Nos pondremos en contacto contigo.")).toBeTruthy();
  });

  it("20. Nosotros muestra información del negocio y sus valores", () => {
    render(<Nosotros />);
    expect(screen.getByRole("heading", { name: "EL BAJÓN DEL GORILA" })).toBeTruthy();
    for (const valor of ["BUENA COMIDA", "CERCANÍA", "SABOR GORILA"]) {
      expect(screen.getByRole("heading", { name: valor })).toBeTruthy();
    }
  });
});

describe("Perfil de cliente", () => {
  it("21. Redirige a Login cuando el visitante no está autenticado", () => {
    montarPerfilCliente();
    expect(screen.getByRole("heading", { name: "Destino Login" })).toBeTruthy();
  });

  it("22. Redirige al administrador a su propio perfil", () => {
    localStorage.setItem("usuarioActualId", "0");
    montarPerfilCliente();
    expect(screen.getByRole("heading", { name: "Destino Perfil Admin" })).toBeTruthy();
  });

  it("23. Muestra los datos y solo las boletas del cliente conectado", () => {
    localStorage.setItem("usuarioActualId", "1");
    const { container } = montarPerfilCliente();
    expect(screen.getByRole("heading", { name: "MI PERFIL" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Juan Prueba" })).toBeTruthy();
    expect(container.querySelectorAll(".perfil-pedido")).toHaveLength(1);
    expect(container.querySelector(".perfil-pedido").textContent).toContain("#71");
    expect(container.textContent).not.toContain("#72");
  });

  it("24. Abre y cierra los detalles de una boleta", () => {
    localStorage.setItem("usuarioActualId", "1");
    const { container } = montarPerfilCliente();
    fireEvent.click(screen.getByRole("button", { name: "VER DETALLE" }));
    expect(container.querySelector(".perfil-pedido-detalle")).not.toBeNull();
    expect(screen.getByText("Hamburguesa Prueba")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "OCULTAR" }));
    expect(container.querySelector(".perfil-pedido-detalle")).toBeNull();
  });

  it("25. Permite editar los datos personales del cliente", () => {
    localStorage.setItem("usuarioActualId", "1");
    montarPerfilCliente();
    fireEvent.click(screen.getByRole("button", { name: "EDITAR" }));
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Juan Actualizado" }
    });
    fireEvent.click(screen.getByRole("button", { name: "GUARDAR CAMBIOS" }));
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    expect(usuarios.find(u => u.id === 1).nombre).toBe("Juan Actualizado");
    expect(screen.getByText("Datos actualizados correctamente.")).toBeTruthy();
  });

  it("26. Rechaza un nombre de cliente demasiado corto", () => {
    localStorage.setItem("usuarioActualId", "1");
    montarPerfilCliente();
    fireEvent.click(screen.getByRole("button", { name: "EDITAR" }));
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "A" }
    });
    fireEvent.click(screen.getByRole("button", { name: "GUARDAR CAMBIOS" }));
    expect(screen.getByText("El nombre debe tener al menos 3 caracteres.")).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("usuarios")).find(u => u.id === 1).nombre)
      .toBe("Juan Prueba");
  });

  it("27. Cancela la edición sin guardar cambios", () => {
    localStorage.setItem("usuarioActualId", "1");
    montarPerfilCliente();
    fireEvent.click(screen.getByRole("button", { name: "EDITAR" }));
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Nombre temporal" }
    });
    fireEvent.click(screen.getByRole("button", { name: "CANCELAR" }));
    expect(screen.getByRole("heading", { name: "Juan Prueba" })).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("usuarios")).find(u => u.id === 1).nombre)
      .toBe("Juan Prueba");
  });

  it("28. Cierra sesión y navega a Login", () => {
    localStorage.setItem("usuarioActualId", "1");
    montarPerfilCliente();
    fireEvent.click(screen.getByRole("button", { name: "CERRAR SESIÓN" }));
    expect(localStorage.getItem("usuarioActualId")).toBeNull();
    expect(screen.getByRole("heading", { name: "Destino Login" })).toBeTruthy();
  });
});

describe("Perfil de administrador", () => {
  it("29. Muestra el nombre y los datos del administrador", () => {
    render(<PerfilAdmin />);
    expect(screen.getByRole("heading", { name: "Perfil" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Administrador" })).toBeTruthy();
    expect(screen.getByText("admin@gmail.com")).toBeTruthy();
  });

  it("30. Guarda cambios válidos en el perfil administrativo", () => {
    render(<PerfilAdmin />);
    fireEvent.click(screen.getByRole("button", { name: /Editar perfil/i }));
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Administrador Actualizado" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    const admin = JSON.parse(localStorage.getItem("usuarios")).find(u => u.id === 0);
    expect(admin.nombre).toBe("Administrador Actualizado");
    expect(screen.getByText("Los datos del perfil fueron actualizados correctamente.")).toBeTruthy();
  });

  it("31. Impide asignar al administrador un correo que ya pertenece a otro usuario", () => {
    render(<PerfilAdmin />);
    fireEvent.click(screen.getByRole("button", { name: /Editar perfil/i }));
    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "juan@gmail.com" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(screen.getByText("Este correo ya está registrado.")).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("usuarios")).find(u => u.id === 0).correo)
      .toBe("admin@gmail.com");
  });

  it("32. Cancela edición sin modificar los datos del administrador", () => {
    render(<PerfilAdmin />);
    fireEvent.click(screen.getByRole("button", { name: /Editar perfil/i }));
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Administrador Temporal" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(JSON.parse(localStorage.getItem("usuarios")).find(u => u.id === 0).nombre)
      .toBe("Administrador");
    expect(screen.getByRole("button", { name: /Editar perfil/i })).toBeTruthy();
  });

  it("33. Informa cuando el usuario administrador no existe", () => {
    localStorage.setItem("usuarios", JSON.stringify(usuariosPrueba.filter(u => u.id !== 0)));
    render(<PerfilAdmin />);
    expect(screen.getByText("No se encontró el usuario administrador.")).toBeTruthy();
  });
});
