import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
    return (
        <footer className="footer-checkout">

            <div className="footer-columnas">

                <div className="footer-marca">

                    <img
                        src="/img/logo-bajon-2.png"
                        alt="El Bajón del Gorila"
                    />

                    <p>
                        El local de fast food más bestial de Santiago.
                        Hecho con pasión, ingredientes de verdad y el
                        hambre de un gorila.
                    </p>

                    <div className="redes-footer">
                        <a href="#">Instagram</a>
                        <a href="#">TikTok</a>
                        <a href="#">WhatsApp</a>
                    </div>

                </div>

                <div>
                    <h3>MENÚ</h3>

                    <Link to="/menu">Hamburguesas</Link>
                    <Link to="/menu">Completos</Link>
                    <Link to="/menu">Churrascos</Link>
                    <Link to="/menu">Papas Fritas</Link>
                    <Link to="/menu">Combos</Link>
                    <Link to="/promociones">Bebidas</Link>
                </div>

                <div>
                    <h3>LINKS</h3>

                    <Link to="/">Inicio</Link>
                    <Link to="/menu">Menú</Link>
                    <Link to="/promociones">Promociones</Link>
                    <Link to="/nosotros">Quiénes Somos</Link>
                    <Link to="/contacto">Contacto</Link>
                    <Link to="/login">Mi Cuenta</Link>
                </div>

                <div>
                    <h3>CONTACTO</h3>

                    <p>Av. Providencia 1234, Santiago</p>
                    <p>+56 9 8765 4321</p>
                    <p>hola@elbajondelgorila.cl</p>

                    <div className="horario-footer">

                        <strong>Horario</strong>

                        <p>Lun–Jue: 12:00 – 23:00</p>
                        <p>Vie–Sáb: 12:00 – 01:00</p>
                        <p>Dom: 13:00 – 22:00</p>

                    </div>

                </div>

            </div>

            <div className="footer-inferior">

                <span>
                    © 2026 El Bajón del Gorila. Todos los derechos reservados.
                </span>

                <span>
                    Hecho con amor en Santiago, Chile
                </span>

            </div>

        </footer>
    );
}

export default Footer;