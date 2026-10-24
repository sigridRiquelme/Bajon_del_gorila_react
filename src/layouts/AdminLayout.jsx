import {
    Navigate,
    Outlet
} from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar.jsx";

import {
    obtenerUsuarioPorId
} from "../data/usuarios.js";

import "../styles/admin.css";


function AdminLayout() {

    const usuarioActualId =
        localStorage.getItem(
            "usuarioActualId"
        );


    const usuarioActual =
        usuarioActualId !== null
            ? obtenerUsuarioPorId(
                Number(usuarioActualId)
            )
            : null;


    // SOLO EL ADMINISTRADOR PUEDE ENTRAR AL PANEL

    if (
        !usuarioActual ||
        usuarioActual.rol !==
        "Administrador"
    ) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    return (

        <div className="admin-layout">

            <AdminSidebar />


            <div className="admin-contenido">

                <div className="admin-pagina">

                    <Outlet />

                </div>

            </div>

        </div>
    );
}


export default AdminLayout;