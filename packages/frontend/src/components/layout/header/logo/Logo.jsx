import { useNavigate } from 'react-router-dom';
import './Logo.css';

export default function Logo() {
    const navigate = useNavigate();
    
    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div className="logo-container" onClick={handleLogoClick}>
            <div className="logo-content">
                <img src="/favicon.ico" alt="Logo Tienda Sol" className="logo-icon" />
                <div className="logo-text">
                    <div className="logo-title">
                        <span className="first-letter">T</span>ienda <span className="first-letter">S</span>ol
                    </div>
                    <div className="logo-subtitle">ONLINE STORES</div>
                </div>
            </div>
        </div>
    );
}