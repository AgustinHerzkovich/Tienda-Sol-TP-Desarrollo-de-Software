import './RightMenu.css';
import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Login from './login/Login';
import Perfil from './perfil/Perfil';
import Cart from './cart/Cart';
import NewProduct from './newProduct/NewProduct';
import { useSession } from '../../../../context/SessionContext';
import Notificaciones from '../../../notificaciones/Notificaciones';
import Searchbar from '../searchbar/Searchbar';
export default function RightMenu() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { isLoggedIn, user } = useSession();

  return (
    <div className="rightmenu-container">
      <button
        className="search-toggle"
        aria-label="Buscar"
        onClick={() => setShowMobileSearch(true)}
      >
        <FaSearch />
      </button>

      {showMobileSearch && (
        <div
          className="mobile-search-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Buscar productos"
        >
          <div className="mobile-search-content">
            <button
              className="mobile-search-close"
              aria-label="Cerrar búsqueda"
              onClick={() => setShowMobileSearch(false)}
            >
              <FaTimes />
            </button>
            <Searchbar onSearch={() => setShowMobileSearch(false)} />
          </div>
        </div>
      )}
      {isLoggedIn() ? (
        <>
          {user?.tipo === 'VENDEDOR' && <NewProduct />}

          <Cart />
          <Notificaciones />
          <Perfil />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}
