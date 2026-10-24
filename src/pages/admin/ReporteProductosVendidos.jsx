import { useState } from "react";
import "../../styles/reportes.css";

import { obtenerPedidos } from "../../data/pedidos.js";
import { obtenerProductos } from "../../data/productos.js";


function ReporteProductosVendidos() {

    const pedidos = obtenerPedidos();
    const productos = obtenerProductos();

    const [tipoFiltro, setTipoFiltro] = useState("todo");
    const [fechaFiltro, setFechaFiltro] = useState("");


    const pedidosFiltrados = pedidos.filter((pedido) => {

        if (tipoFiltro === "todo") {
            return true;
        }

        if (fechaFiltro === "") {
            return false;
        }

        if (tipoFiltro === "dia") {
            return pedido.fecha === fechaFiltro;
        }

        if (tipoFiltro === "mes") {
            return pedido.fecha.startsWith(fechaFiltro);
        }

        if (tipoFiltro === "anio") {

            if (!/^\d{4}$/.test(fechaFiltro)) {
                return false;
            }

            return pedido.fecha.startsWith(fechaFiltro);
        }

        return true;
    });


    const productosVendidos = {};
    const categoriasVendidas = {};


    pedidosFiltrados.forEach((pedido) => {

        pedido.productos.forEach((productoPedido) => {

            const productoBase = productos.find(
                (producto) =>
                    producto.codigo === productoPedido.codigoProducto
            );

            const categoria =
                productoBase?.categoria || "Sin categoría";


            if (!productosVendidos[productoPedido.codigoProducto]) {

                productosVendidos[productoPedido.codigoProducto] = {
                    codigo: productoPedido.codigoProducto,
                    nombre: productoPedido.nombre,
                    cantidad: 0,
                    ingresos: 0
                };
            }


            productosVendidos[
                productoPedido.codigoProducto
            ].cantidad += productoPedido.cantidad;


            productosVendidos[
                productoPedido.codigoProducto
            ].ingresos +=
                productoPedido.precio *
                productoPedido.cantidad;


            if (!categoriasVendidas[categoria]) {

                categoriasVendidas[categoria] = {
                    nombre: categoria,
                    cantidad: 0,
                    ingresos: 0
                };
            }


            categoriasVendidas[categoria].cantidad +=
                productoPedido.cantidad;


            categoriasVendidas[categoria].ingresos +=
                productoPedido.precio *
                productoPedido.cantidad;
        });
    });


    const listaProductos = Object.values(
        productosVendidos
    ).sort(
        (a, b) => b.cantidad - a.cantidad
    );


    const listaCategorias = Object.values(
        categoriasVendidas
    ).sort(
        (a, b) => b.cantidad - a.cantidad
    );


    const totalUnidades = listaProductos.reduce(
        (total, producto) =>
            total + producto.cantidad,
        0
    );


    const totalIngresos = listaProductos.reduce(
        (total, producto) =>
            total + producto.ingresos,
        0
    );


    const productoMasVendido =
        listaProductos.length > 0
            ? listaProductos[0]
            : null;


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
                        Reporte de productos vendidos
                    </h1>

                    <p className="text-secondary mb-0">
                        Resumen de artículos y categorías vendidas
                    </p>

                </div>

            </div>


            <section className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <h2 className="h5 mb-3">
                        Filtrar productos vendidos
                    </h2>


                    <div className="row g-3">

                        <div className="col-12 col-md-4">

                            <label
                                htmlFor="tipoFiltroProductos"
                                className="form-label"
                            >
                                Mostrar por
                            </label>

                            <select
                                id="tipoFiltroProductos"
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

                                <label className="form-label">
                                    Seleccionar día
                                </label>

                                <input
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

                                <label className="form-label">
                                    Seleccionar mes
                                </label>

                                <input
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

                                <label className="form-label">
                                    Seleccionar año
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Ej: 2026"
                                    maxLength="4"
                                    value={fechaFiltro}
                                    onChange={(e) => {

                                        const soloNumeros =
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 4);

                                        setFechaFiltro(soloNumeros);
                                    }}
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
                                <i className="bi bi-trophy"></i>
                            </div>

                            <p className="card-text text-secondary">
                                Producto más vendido
                            </p>

                            <h3 className="fw-bold mb-0 fs-5">
                                {productoMasVendido
                                    ? productoMasVendido.nombre
                                    : "Sin ventas"
                                }
                            </h3>

                        </div>

                    </div>

                </div>


                <div className="col-12 col-md-4">

                    <div className="card reporte-card-bootstrap h-100">

                        <div className="card-body">

                            <div className="reporte-icono">
                                <i className="bi bi-box-seam"></i>
                            </div>

                            <p className="card-text text-secondary">
                                Unidades vendidas
                            </p>

                            <h3 className="fw-bold mb-0">
                                {totalUnidades}
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
                                Ingresos generados
                            </p>

                            <h3 className="fw-bold mb-0">

                                $
                                {totalIngresos.toLocaleString(
                                    "es-CL"
                                )}

                            </h3>

                        </div>

                    </div>

                </div>

            </div>


            <section className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <h2 className="h5 mb-3">
                        Artículos vendidos
                    </h2>


                    <div className="table-responsive">

                        <table className="table table-striped table-hover align-middle">

                            <thead className="table-dark">

                                <tr>
                                    <th>PRODUCTO</th>
                                    <th>CANTIDAD VENDIDA</th>
                                    <th>INGRESOS GENERADOS</th>
                                </tr>

                            </thead>


                            <tbody>

                                {listaProductos.length > 0 ? (

                                    listaProductos.map((producto) => (

                                        <tr key={producto.codigo}>

                                            <td className="fw-semibold">
                                                {producto.nombre}
                                            </td>

                                            <td>
                                                {producto.cantidad}
                                            </td>

                                            <td className="fw-semibold">

                                                $
                                                {producto.ingresos.toLocaleString(
                                                    "es-CL"
                                                )}

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="3"
                                            className="text-center text-secondary py-4"
                                        >
                                            No hay productos vendidos para el filtro seleccionado.
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
                        Ventas por categoría
                    </h2>


                    <div className="table-responsive">

                        <table className="table table-striped table-hover align-middle">

                            <thead className="table-dark">

                                <tr>
                                    <th>CATEGORÍA</th>
                                    <th>CANTIDAD VENDIDA</th>
                                    <th>INGRESOS GENERADOS</th>
                                </tr>

                            </thead>


                            <tbody>

                                {listaCategorias.length > 0 ? (

                                    listaCategorias.map((categoria) => (

                                        <tr key={categoria.nombre}>

                                            <td className="fw-semibold">
                                                {categoria.nombre}
                                            </td>

                                            <td>
                                                {categoria.cantidad}
                                            </td>

                                            <td className="fw-semibold">

                                                $
                                                {categoria.ingresos.toLocaleString(
                                                    "es-CL"
                                                )}

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="3"
                                            className="text-center text-secondary py-4"
                                        >
                                            No hay categorías con ventas para el filtro seleccionado.
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


export default ReporteProductosVendidos;