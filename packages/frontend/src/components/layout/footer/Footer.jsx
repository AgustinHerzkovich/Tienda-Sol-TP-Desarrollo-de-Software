import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    {/* Logo y descripción */}
                    <div className="footer-section footer-brand">
                        <div className="footer-logo">
                            <img src="/favicon.ico" alt="Logo Tienda Sol" className="footer-logo-icon" />
                            <div className="footer-logo-text">
                                <div className="footer-logo-title">
                                    <span className="first-letter">T</span>ienda <span className="first-letter">S</span>ol
                                </div>
                                <div className="footer-logo-subtitle">ONLINE STORES</div>
                            </div>
                        </div>
                        <p className="footer-description">
                            Tu tienda online de confianza. Encuentra los mejores productos 
                            con la calidad y el servicio que mereces.
                        </p>
                        <div className="footer-social">
                            <button className="social-link" aria-label="Facebook">📘</button>
                            <button className="social-link" aria-label="Instagram">📷</button>
                            <button className="social-link" aria-label="Twitter">🐦</button>
                            <button className="social-link" aria-label="YouTube">📺</button>
                        </div>
                    </div>

                    {/* Información de contacto */}
                    <div className="footer-section">
                        <h3 className="footer-title">Contacto</h3>
                        <div className="footer-contact">
                            <div className="contact-item">
                                <span className="contact-icon">📞</span>
                                <span>+54 11 4567-8900</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-icon">📱</span>
                                <span>+54 9 11 2345-6789</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-icon">📧</span>
                                <span>info@tiendasol.com.ar</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-icon">💬</span>
                                <span>Atención: Lun a Vie 9-18hs</span>
                            </div>
                        </div>
                    </div>

                    {/* Ubicación */}
                    <div className="footer-section">
                        <h3 className="footer-title">Ubicación</h3>
                        <div className="footer-location">
                            <div className="location-item">
                                <span className="location-icon">🏢</span>
                                <div>
                                    <strong>Oficina Central</strong>
                                    <p>Av. Juan Domingo Perón 1234<br />C1043 CABA, Argentina</p>
                                </div>
                            </div>
                            <div className="location-item">
                                <span className="location-icon">🏪</span>
                                <div>
                                    <strong>Showroom</strong>
                                    <p>Av. Evita Perón 5678<br />C1425 CABA, Argentina</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enlaces útiles */}
                    <div className="footer-section">
                        <h3 className="footer-title">Enlaces Útiles</h3>
                        <ul className="footer-links">
                            <li><button className="footer-link">Sobre Nosotros</button></li>
                            <li><button className="footer-link">Términos y Condiciones</button></li>
                            <li><button className="footer-link">Política de Privacidad</button></li>
                            <li><button className="footer-link">Política de Devoluciones</button></li>
                            <li><button className="footer-link">Preguntas Frecuentes</button></li>
                            <li><button className="footer-link">Centro de Ayuda</button></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-bottom">
                    <div className="footer-copyright">
                        <p>&copy; 2025 Tienda Sol. Todos los derechos reservados.</p>
                    </div>
                    <div className="footer-payment">
                        <span>Métodos de pago:</span>
                        <div className="payment-icons">
                            <span className="payment-icon">💳</span>
                            <span className="payment-icon">🏧</span>
                            <span className="payment-icon">💰</span>
                            <span className="payment-icon">📱</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}