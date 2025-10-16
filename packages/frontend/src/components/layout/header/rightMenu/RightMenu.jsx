import './RightMenu.css';
import Login from './login/Login';
import Perfil from './perfil/Perfil';
import Cart from './cart/Cart';
import { useSession } from '../../../../context/SessionContext';

export default function RightMenu() {
  const { isLoggedIn } = useSession();

  return (
    <div className="rightmenu-container">
      <Cart />
      {isLoggedIn() ? <Perfil /> : <Login />}
    </div>
  );
}
