import './Cart.css';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../../../../context/SessionContext';
import { useCart } from '../../../../../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { isLoggedIn } = useSession();
  const { getTotalItems } = useCart();

  const handleCartClick = () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  const itemCount = getTotalItems();
  const displayCount = itemCount > 99 ? '99+' : itemCount;

  return (
    <div className="cart-container">
      <button className="cart-button" title="Carrito" onClick={handleCartClick}>
        <FiShoppingCart />
        {itemCount > 0 && <span className="cart-badge">{displayCount}</span>}
      </button>
    </div>
  );
}
