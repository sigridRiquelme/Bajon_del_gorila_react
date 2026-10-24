import { Link } from "react-router-dom";
import ProductoCard from "../components/ProductoCard.jsx";
import { productosDestacados } from "../data/catalogoPublico.js";
import "../styles/Componentes.css";
import "../styles/Inicio.css";
import "../styles/Responsive.css";

function Inicio() {
    const categorias = [
        "🍔 Hamburguesas",
        "🌭 Completos",
        "🥩 Churrascos",
        "🍟 Papas",
        "🔥 Combos",
        "🥤 Bebidas"
    ];

    return (
        <>
            <section className="portada">
                <div className="imagen-portada" aria-hidden="true"></div>

                <div className="contenedor contenido-portada">
                    <div className="texto-portada">
                        <div className="antetitulo-portada">
                            <div className="circulo-gorila">
                                <img
                                    src="/img/logo-bajon.png"
                                    alt="Logo del gorila"
                                />
                            </div>

                            <span className="texto-antetitulo">
                                STREET FOOD • SANTIAGO CHILE
                            </span>
                        </div>

                        <h1>
                            ¿TE PEGÓ
                            <br />
                            EL BAJÓN?
                        </h1>

                        <p className="descripcion-portada">
                            Nosotros nos encargamos del resto.
                            <br />
                            <strong>
                                Hamburguesas, completos, churrascos
                            </strong>{" "}
                            y más.
                        </p>

                        <div className="botones-portada">
                            <Link
                                className="boton boton-principal"
                                to="/menu"
                            >
                                VER EL MENÚ
                            </Link>

                            <Link
                                className="boton boton-borde boton-borde-amarillo"
                                to="/menu"
                            >
                                PEDIR AHORA →
                            </Link>
                        </div>

                        <div className="estadisticas-portada">
                            <div>
                                <div className="numero-estadistica">
                                    5.000+
                                </div>
                                <div className="etiqueta-estadistica">
                                    Clientes felices
                                </div>
                            </div>

                            <div>
                                <div className="numero-estadistica">
                                    4.9★
                                </div>
                                <div className="etiqueta-estadistica">
                                    Valoración
                                </div>
                            </div>

                            <div>
                                <div className="numero-estadistica">
                                    30 min
                                </div>
                                <div className="etiqueta-estadistica">
                                    Delivery promedio
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="franja-categorias"
                aria-label="Categorías del menú"
            >
                <div className="contenedor lista-categorias">
                    {categorias.map((categoria) => (
                        <Link
                            key={categoria}
                            className="opcion-categoria"
                            to="/menu"
                        >
                            {categoria}
                        </Link>
                    ))}
                </div>
            </section>

            <section className="seccion-clara">
                <div className="contenedor">

                    <div className="fila-encabezado-seccion">
                        <div>
                            <p className="antetitulo">
                                🦍 SELECCIÓN DEL GORILA
                            </p>

                            <h2 className="titulo-seccion">
                                LOS FAVORITOS
                                <br />
                                DEL GORILA
                            </h2>
                        </div>

                        <Link className="boton boton-borde" to="/menu">
                            VER MENÚ COMPLETO →
                        </Link>
                    </div>

                    <div className="grilla-productos">
                        {productosDestacados.map((producto) => (
                            <ProductoCard
                                key={producto.id}
                                producto={producto}
                            />
                        ))}
                    </div>

                </div>
            </section>


            <section className="promocion-semanal">
                <div className="contenedor grilla-promocion-semanal">

                    <div>
                        <span className="etiqueta etiqueta-naranja">
                            🔥 OFERTA DE LA SEMANA
                        </span>

                        <h2 className="titulo-seccion">
                            EL BAJÓN
                            <br />
                            DE LA SEMANA
                        </h2>

                        <p className="texto-principal-promocion">
                            King Kong Burger + Papas Gorila + Bebida Grande
                        </p>

                        <p className="texto-secundario-promocion">
                            El combo más brutal del menú, a un precio que no puedes ignorar.
                        </p>

                        <div className="fila-precio">
                            <span className="precio-grande">
                                $12.990
                            </span>

                            <span className="precio-anterior">
                                $20.970
                            </span>

                            <span className="etiqueta etiqueta-verde">
                                -38%
                            </span>
                        </div>

                        <Link className="boton boton-amarillo" to="/menu">
                            QUIERO ESTE COMBO 🔥
                        </Link>
                    </div>

                    <div className="contenedor-imagen-promocion-semanal">
                        <img
                            className="imagen-promocion-semanal"
                            src="/img/combo kinkon.jpeg"
                            alt="Combo King Kong"
                        />

                        <div className="caja-ahorro">
                            <small>AHORRA</small>
                            <strong>$7.980</strong>
                        </div>
                    </div>

                </div>
            </section>

            <section className="seccion-clara">
                <div className="contenedor">

                    <div className="encabezado-razones">
                        <p className="antetitulo">
                            NUESTRO COMPROMISO
                        </p>

                        <h2 className="titulo-seccion">
                            ¿POR QUÉ ELEGIRNOS?
                        </h2>
                    </div>

                    <div className="grilla-razones">

                        <article className="tarjeta-razon">
                            <div className="icono-razon">🔥</div>
                            <h3>Preparado al momento</h3>
                            <p>
                                Cada pedido sale fresco desde la parrilla,
                                sin excepciones.
                            </p>
                        </article>

                        <article className="tarjeta-razon">
                            <div className="icono-razon">🍔</div>
                            <h3>Ingredientes seleccionados</h3>
                            <p>
                                Solo usamos insumos de calidad para que
                                el bajón valga la pena.
                            </p>
                        </article>

                        <article className="tarjeta-razon">
                            <div className="icono-razon">🛵</div>
                            <h3>Delivery rápido</h3>
                            <p>
                                Tu pedido llega en menos de 40 minutos
                                o te damos un descuento.
                            </p>
                        </article>

                        <article className="tarjeta-razon">
                            <div className="icono-razon">💳</div>
                            <h3>Pago fácil</h3>
                            <p>
                                Webpay, tarjetas y efectivo.
                                Como a ti te acomode.
                            </p>
                        </article>

                    </div>
                </div>
            </section>

            <section className="banner-accion">
                <div className="contenedor">

                    <h2 className="titulo-seccion">
                        EL BAJÓN NO ESPERA
                    </h2>

                    <p>
                        Pide ahora y recíbelo en menos de 40 minutos.
                    </p>

                    <Link className="boton boton-amarillo" to="/menu">
                        PEDIR AHORA 🍔
                    </Link>

                </div>
            </section>



        </>
    );
}

export default Inicio;
