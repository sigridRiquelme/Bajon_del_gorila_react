import { useState } from "react";
import "../../styles/reportes.css";

import {
    obtenerPedidos
} from "../../data/pedidos.js";


function ReporteVentas() {

    const pedidos = obtenerPedidos();

    const [tipoFiltro, setTipoFiltro] = useState("todo");
    const [fechaFiltro, setFechaFiltro] = useState("");


    const pedidosFiltrados = pedidos.filter((pedido) => {

        if (tipoFiltro === "todo") {
            return true;
        }

        if (tipoFiltro === "dia") {
            return pedido.fecha === fechaFiltro;
        }

        if (tipoFiltro === "mes") {
            return pedido.fecha.startsWith(fechaFiltro);
        }

        if (tipoFiltro === "anio") {
            return pedido.fecha.startsWith(fechaFiltro);
        }

        return true;
    });


    const cantidadVentas = pedidosFiltrados.length;


    const totalVendido = pedidosFiltrados.reduce(
        (total, pedido) =>
            total + pedido.total,
        0
    );


    const promedioVenta =
        cantidadVentas > 0
            ? totalVendido / cantidadVentas
            : 0;


    const ventasPorFecha = pedidosFiltrados.reduce(
        (fechas, pedido) => {

            if (!fechas[pedido.fecha]) {

                fechas[pedido.fecha] = {
                    cantidad: 0,
                    total: 0
                };

            }

            fechas[pedido.fecha].cantidad++;

            fechas[pedido.fecha].total += pedido.total;

            return fechas;

        },
        {}
    );


    const cambiarTipoFiltro = (e) => {

        setTipoFiltro(e.target.value);
        setFechaFiltro("");

    };


    return (

        <main className="reporte-admin">

            <div
                className="
                    d-flex
                    justify-content-between
                    flex-wrap
                    flex-md-nowrap
                    align-items-center
                    pb-2
                    mb-4
                    border-bottom
                "
            >

                <div>

                    <h1 className="h2">
                        Reporte de ventas
                    </h1>

                    <p className="text-secondary mb-0">
                        Resumen general de las ventas realizadas
                    </p>

                </div>

            </div>


            <section className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <h2 className="h5 mb-3">
                        Filtrar ventas
                    </h2>


                    <div className="row g-3">

                        <div className="col-12 col-md-4">

                            <label
                                htmlFor="tipoFiltro"
                                className="form-label"
                            >
                                Mostrar por
                            </label>

                            <select
                                id="tipoFiltro"
                                className="form-select"
                                value={tipoFiltro}
                                onChange={cambiarTipoFiltro}
                            >

                                <option value="todo">
                                    Todas las ventas
                                </option>

                                <option value="dia">
                                    Día
                                </option>

                                <option value="mes">
                                    Mes
                                </option>

                                <option value="anio">
                                    Año
                                </option>

                            </select>

                        </div>


                        {tipoFiltro === "dia" && (

                            <div className="col-12 col-md-4">

                                <label
                                    htmlFor="fechaDia"
                                    className="form-label"
                                >
                                    Seleccionar día
                                </label>

                                <input
                                    id="fechaDia"
                                    type="date"
                                    className="form-control"
                                    value={fechaFiltro}
                                    onChange={(e) =>
                                        setFechaFiltro(e.target.value)
                                    }
                                />

                            </div>

                        )}


                        {tipoFiltro === "mes" && (

                            <div className="col-12 col-md-4">

                                <label
                                    htmlFor="fechaMes"
                                    className="form-label"
                                >
                                    Seleccionar mes
                                </label>

                                <input
                                    id="fechaMes"
                                    type="month"
                                    className="form-control"
                                    value={fechaFiltro}
                                    onChange={(e) =>
                                        setFechaFiltro(e.target.value)
                                    }
                                />

                            </div>

                        )}


                        {tipoFiltro === "anio" && (

                            <div className="col-12 col-md-4">

                                <label
                                    htmlFor="fechaAnio"
                                    className="form-label"
                                >
                                    Seleccionar año
                                </label>

                                <input
                                    id="fechaAnio"
                                    type="number"
                                    className="form-control"
                                    placeholder="Ej: 2026"
                                    min="2000"
                                    max="2100"
                                    value={fechaFiltro}
                                    onChange={(e) =>
                                        setFechaFiltro(e.target.value)
                                    }
                                />

                            </div>

                        )}

                    </div>

                </div>

            </section>


            <div className="row g-3 mb-4">


                <div className="col-12 col-md-4">

                    <div className="card reporte-card-bootstrap h-100">

                        <div className="card-body">

                            <div className="reporte-icono">
                                <i className="bi bi-receipt"></i>
                            </div>

                            <p className="card-text text-secondary">
                                Ventas realizadas
                            </p>

                            <h3 className="fw-bold mb-0">
                                {cantidadVentas}
                            </h3>

                        </div>

                    </div>

                </div>


                <div className="col-12 col-md-4">

                    <div className="card reporte-card-bootstrap h-100">

                        <div className="card-body">

                            <div className="reporte-icono">
                                <i className="bi bi-cash-stack"></i>
                            </div>

                            <p className="card-text text-secondary">
                                Total vendido
                            </p>

                            <h3 className="fw-bold mb-0">

                                $
                                {totalVendido.toLocaleString(
                                    "es-CL"
                                )}

                            </h3>

                        </div>

                    </div>

                </div>


                <div className="col-12 col-md-4">

                    <div className="card reporte-card-bootstrap h-100">

                        <div className="card-body">

                            <div className="reporte-icono">
                                <i className="bi bi-calculator"></i>
                            </div>

                            <p className="card-text text-secondary">
                                Promedio por venta
                            </p>

                            <h3 className="fw-bold mb-0">

                                $
                                {promedioVenta.toLocaleString(
                                    "es-CL",
                                    {
                                        maximumFractionDigits: 0
                                    }
                                )}

                            </h3>

                        </div>

                    </div>

                </div>


            </div>


            <section className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <h2 className="h5 mb-3">
                        Ventas por fecha
                    </h2>


                    <div className="table-responsive">

                        <table className="table table-striped table-hover align-middle">

                            <thead className="table-dark">

                                <tr>
                                    <th>FECHA</th>
                                    <th>CANTIDAD DE VENTAS</th>
                                    <th>TOTAL VENDIDO</th>
                                </tr>

                            </thead>


                            <tbody>

                                {Object.entries(
                                    ventasPorFecha
                                ).length > 0 ? (

                                    Object.entries(
                                        ventasPorFecha
                                    ).map(
                                        ([fecha, datos]) => (

                                            <tr key={fecha}>

                                                <td>
                                                    {fecha}
                                                </td>

                                                <td>
                                                    {datos.cantidad}
                                                </td>

                                                <td className="fw-semibold">

                                                    $
                                                    {datos.total.toLocaleString(
                                                        "es-CL"
                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="3"
                                            className="text-center text-secondary py-4"
                                        >
                                            No hay ventas para el filtro seleccionado.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </section>


            <section className="card border-0 shadow-sm">

                <div className="card-body">

                    <h2 className="h5 mb-3">
                        Detalle de ventas
                    </h2>


                    <div className="table-responsive">

                        <table className="table table-striped table-hover align-middle">

                            <thead className="table-dark">

                                <tr>
                                    <th>BOLETA</th>
                                    <th>CLIENTE</th>
                                    <th>FECHA</th>
                                    <th>PRODUCTOS</th>
                                    <th>TOTAL</th>
                                </tr>

                            </thead>


                            <tbody>

                                {pedidosFiltrados.length > 0 ? (

                                    pedidosFiltrados.map(
                                        (pedido) => (

                                            <tr key={pedido.codigo}>

                                                <td>
                                                    #{pedido.codigo}
                                                </td>

                                                <td>
                                                    {pedido.cliente}
                                                </td>

                                                <td>
                                                    {pedido.fecha}
                                                </td>

                                                <td>

                                                    {pedido.productos.reduce(
                                                        (total, producto) =>
                                                            total + producto.cantidad,
                                                        0
                                                    )}

                                                </td>

                                                <td className="fw-semibold">

                                                    $
                                                    {pedido.total.toLocaleString(
                                                        "es-CL"
                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center text-secondary py-4"
                                        >
                                            No hay ventas para el filtro seleccionado.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </section>

        </main>
    );
}


export default ReporteVentas;