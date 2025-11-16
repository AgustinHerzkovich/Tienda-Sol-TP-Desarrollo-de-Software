import { useState, useRef, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { LuUserRound } from 'react-icons/lu';
import './Perfil.css';
import { useSession } from '../../../../../context/SessionContext';
import { useToast } from '../../../../../context/ToastContext';
import { FiPackage } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout, user } = useSession();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handlePerfilClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCerrarSesion = () => {
    console.log('Cerrar sesión');
    setIsMenuOpen(false);
    logout(); // Limpia la sesión del contexto
    showToast('Sesión cerrada exitosamente', 'success'); // Muestra el toast ANTES de navegar
    navigate('/'); // Redirige a la página principal
  };

  const handlePedidos = () => {
    navigate('/pedidos');
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="perfil-container" ref={menuRef}>
      <button
        className="perfil-button"
        title="Perfil de Usuario"
        onClick={handlePerfilClick}
        aria-expanded={isMenuOpen}
      >
        <LuUserRound />
      </button>

      {isMenuOpen && (
        <div className="perfil-dropdown">
          <span className="perfil-name">{user?.nombre}</span>
          <button className="dropdown-item" onClick={handlePedidos}>
            <FiPackage />
            <span>Mis Pedidos</span>
          </button>
          <button className="dropdown-item" onClick={handleCerrarSesion}>
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}
