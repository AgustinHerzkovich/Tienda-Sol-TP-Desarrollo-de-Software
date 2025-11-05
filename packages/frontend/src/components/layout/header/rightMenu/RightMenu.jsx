import './RightMenu.css';
import Login from './login/Login';
import Perfil from './perfil/Perfil';
import Cart from './cart/Cart';
import NewProduct from './newProduct/NewProduct';
import { useSession } from '../../../../context/SessionContext';
import Notificaciones from '../../../notificaciones/Notificaciones';
export default function RightMenu() {
  const { isLoggedIn, user } = useSession();

  return (
    <div className="rightmenu-container">
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
