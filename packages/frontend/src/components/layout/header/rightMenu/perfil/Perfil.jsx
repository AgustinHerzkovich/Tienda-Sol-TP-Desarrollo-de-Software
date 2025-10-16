import { useState, useRef, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { LuUserRound } from 'react-icons/lu';
import './Perfil.css';
import { useSession } from '../../../../../context/SessionContext';

export default function Perfil() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useSession();

  const handlePerfilClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCerrarSesion = () => {
    console.log('Cerrar sesión');
    setIsMenuOpen(false);
    logout(); // Usa la función del SessionContext
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
          <button className="dropdown-item" onClick={handleCerrarSesion}>
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}
