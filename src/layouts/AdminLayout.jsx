import {
    Navigate,
    Outlet
} from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar.jsx";

import "../styles/admin.css";


function AdminLayout() {

    const token =
        localStorage.getItem(
            "token"
        );


    const rol =
        localStorage.getItem(
            "usuarioRol"
        );


    const puedeEntrar =
        token &&
        (
            rol ===
            "ADMINISTRADOR"
            ||
            rol ===
            "VENDEDOR"
        );


    if (
        !puedeEntrar
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