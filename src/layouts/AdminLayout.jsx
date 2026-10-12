import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";

function AdminLayout() {
    return (
        <div className="admin-layout">
            <AdminSidebar />

            <div className="admin-contenido">
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;