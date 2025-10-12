import './Cart.css'
import { FiShoppingCart } from "react-icons/fi";

export default function Cart() {
    return (
        <div className="cart-container">
            <button className="cart-button" title="Carrito">
                <FiShoppingCart />
            </button>
        </div>
    )
}