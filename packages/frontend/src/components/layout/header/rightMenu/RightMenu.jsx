import './RightMenu.css';
import Login from './login/Login';
import Perfil from './perfil/Perfil';
import Cart from './cart/Cart';
import NewProduct from './newProduct/NewProduct';
import { useSession } from '../../../../context/SessionContext';

export default function RightMenu() {
  const { isLoggedIn, isSeller } = useSession();

  return (
    <div className="rightmenu-container">
      <Cart />
      {isLoggedIn() ? (
        <>
          {isSeller() && <NewProduct />}
          <Perfil />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}
