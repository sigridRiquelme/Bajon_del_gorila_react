import {
    useEffect,
    useState
} from "react";

import "../../styles/reportes.css";

import {
    obtenerUsuariosApi
} from "../../api/usuarios.js";

import {
    obtenerPedidosConDetallesApi
} from "../../api/pedidos.js";


function ReporteUsuarios() {

    const [
        usuarios,
        setUsuarios
    ] = useState([]);


    const [
        pedidos,
        setPedidos
    ] = useState([]);


    const [
        cargando,
        setCargando
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    useEffect(() => {

        const cargarReporte = async () => {

            try {

                const [
                    usuariosApi,
                    pedidosApi
                ] =
                    await Promise.all([

                        obtenerUsuariosApi(),
                        obtenerPedidosConDetallesApi()
                    ]);


                setUsuarios(
                    usuariosApi
                );


                setPedidos(
                    pedidosApi
                );


                setError(
                    ""
                );

            } catch (
                error
            ) {

                console.error(
                    error
                );


                setError(
                    "No fue posible cargar el reporte de usuarios."
                );

            } finally {

                setCargando(
                    false
                );
            }
        };


        cargarReporte();

    }, []);


    const clientes =
        usuarios.filter(
            (
                usuario
            ) =>
                usuario.rol ===
                "Cliente"
        );


    const administradores =
        usuarios.filter(
            (
                usuario
            ) =>
                usuario.rol ===
                "Administrador"
        );


    const vendedores =
        usuarios.filter(
            (
                usuario
            ) =>
                usuario.rol ===
                "Vendedor"
        );


    const obtenerComprasUsuario = (
        usuario
    ) => {

        return pedidos.filter(
            (
                pedido
            ) =>
                pedido.usuarioId ===
                usuario.id
        );
    };


    const clientesConCompras =
        clientes.filter(
            (
                usuario
            ) =>
                obtenerComprasUsuario(
                    usuario
                ).length >
                0
        );


    const clientesSinCompras =
        clientes.length -
        clientesConCompras.length;


    const obtenerTotalGastado = (
        usuario
    ) => {

        return obtenerComprasUsuario(
            usuario
        ).reduce(
            (
                total,
                pedido
            ) =>
                total +
                pedido.total,
            0
        );
    };


    return (

        <main className="reporte-admin">


            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">

                <div>

                    <h1 className="h2">
                        Reporte de usuarios
                    </h1>

                    <p className="text-secondary mb-0">
                        Resumen de usuarios y su actividad de compra
                    </p>

                </div>

            </div>


            {error && (

                <div className="alert alert-danger">

                    {error}

                </div>

            )}


            {cargando ? (

                <p>
                    Cargando reporte...
                </p>

            ) : (

                <>

                    <div className="row g-3 mb-4">


                        <div className="col-12 col-sm-6 col-xl-3">

                            <div className="card reporte-card-bootstrap h-100">

                                <div className="card-body">

                                    <div className="reporte-icono">
                                        <i className="bi bi-people"></i>
                                    </div>

                                    <p className="card-text text-secondary">
                                        Clientes registrados
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {clientes.length}
                                    </h3>

                                </div>

                            </div>

                        </div>


                        <div className="col-12 col-sm-6 col-xl-3">

                            <div className="card reporte-card-bootstrap h-100">

                                <div className="card-body">

                                    <div className="reporte-icono">
                                        <i className="bi bi-cart-check"></i>
                                    </div>

                                    <p className="card-text text-secondary">
                                        Clientes con compras
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {clientesConCompras.length}
                                    </h3>

                                </div>

                            </div>

                        </div>


                        <div className="col-12 col-sm-6 col-xl-3">

                            <div className="card reporte-card-bootstrap h-100">

                                <div className="card-body">

                                    <div className="reporte-icono">
                                        <i className="bi bi-cart-x"></i>
                                    </div>

                                    <p className="card-text text-secondary">
                                        Clientes sin compras
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {clientesSinCompras}
                                    </h3>

                                </div>

                            </div>

                        </div>


                        <div className="col-12 col-sm-6 col-xl-3">

                            <div className="card reporte-card-bootstrap h-100">

                                <div className="card-body">

                                    <div className="reporte-icono">
                                        <i className="bi bi-shield-lock"></i>
                                    </div>

                                    <p className="card-text text-secondary">
                                        Personal administrativo
                                    </p>

                                    <h3 className="fw-bold mb-0">

                                        {
                                            administradores.length +
                                            vendedores.length
                                        }

                                    </h3>

                                </div>

                            </div>

                        </div>

                    </div>


                    <section className="card border-0 shadow-sm">

                        <div className="card-body">

                            <h2 className="h5 mb-3">
                                Detalle de usuarios
                            </h2>


                            <div className="table-responsive">

                                <table className="table table-striped table-hover align-middle">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>USUARIO</th>
                                            <th>CORREO</th>
                                            <th>TELÉFONO</th>
                                            <th>DIRECCIÓN</th>
                                            <th>ROL</th>
                                            <th>COMPRAS</th>
                                            <th>TOTAL GASTADO</th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {usuarios.map(
                                            (
                                                usuario
                                            ) => {

                                                const compras =
                                                    obtenerComprasUsuario(
                                                        usuario
                                                    );


                                                const totalGastado =
                                                    obtenerTotalGastado(
                                                        usuario
                                                    );


                                                return (

                                                    <tr
                                                        key={
                                                            usuario.id
                                                        }
                                                    >

                                                        <td>

                                                            #{usuario.id}{" "}

                                                            {
                                                                usuario.nombre
                                                            }

                                                        </td>


                                                        <td>
                                                            {
                                                                usuario.correo
                                                            }
                                                        </td>


                                                        <td>

                                                            {
                                                                usuario.telefono ||
                                                                "Sin teléfono"
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                usuario.direccion ||
                                                                "Sin dirección"
                                                            }

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    usuario.rol ===
                                                                    "Administrador"
                                                                        ? "badge text-bg-dark"
                                                                        : "badge text-bg-secondary"
                                                                }
                                                            >

                                                                {
                                                                    usuario.rol
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>
                                                            {
                                                                compras.length
                                                            }
                                                        </td>


                                                        <td className="fw-semibold">

                                                            $
                                                            {
                                                                totalGastado.toLocaleString(
                                                                    "es-CL"
                                                                )
                                                            }

                                                        </td>

                                                    </tr>

                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </section>

                </>

            )}

        </main>
    );
}


export default ReporteUsuarios;