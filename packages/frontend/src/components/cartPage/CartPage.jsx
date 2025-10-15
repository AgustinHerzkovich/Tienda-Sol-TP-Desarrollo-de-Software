import React from 'react';
import { FaTrash, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import './CartPage.css';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
    const { cartItems, removeItem, updateQuantity, getTotalPrice } = useCart();

    const handlePurchase = () => {
        if (cartItems.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        alert(`Procesando compra por $${getTotalPrice().toLocaleString()}`);
        // Aquí irían las llamadas al backend para procesar la compra
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-header">
                    <h1><FaShoppingCart /> Mi Carrito</h1>
                </div>
                <div className="empty-cart">
                    <FaShoppingCart className="empty-icon" />
                    <h2>Tu carrito está vacío</h2>
                    <p>¡Explora nuestros productos y encuentra algo que te guste!</p>
                    <button className="continue-shopping" onClick={() => window.history.back()}>
                        Continuar Comprando
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1><FaShoppingCart /> Mi Carrito</h1>
                <span className="item-count">{cartItems.length} producto{cartItems.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.producto.id} className="cart-item">
                            <div className="item-image">
                                <img src={item.producto.fotos[0]} alt={item.producto.titulo} />
                            </div>
                            
                            <div className="item-details">
                                <h3>{item.producto.titulo}</h3>
                                <p className="item-price">${item.producto.precio.toLocaleString()}</p>
                            </div>

                            <div className="quantity-controls">
                                <button 
                                    onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                                    className="quantity-btn"
                                >
                                    -
                                </button>
                                <span className="quantity">{item.cantidad}</span>
                                <button 
                                    onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                                    className="quantity-btn"
                                >
                                    +
                                </button>
                            </div>

                            <div className="item-total">
                                <span>${(item.precioUnitario * item.cantidad).toLocaleString()}</span>
                            </div>

                            <button 
                                onClick={() => removeItem(item.producto.id)}
                                className="remove-btn"
                                title="Eliminar producto"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <div className="summary-card">
                        <h3>Resumen de Compra</h3>
                        
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${getTotalPrice().toLocaleString()}</span>
                        </div>
                        
                        <div className="summary-row">
                            <span>Envío:</span>
                            <span>Gratis</span>
                        </div>
                        
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span>${getTotalPrice().toLocaleString()}</span>
                        </div>

                        <button 
                            onClick={handlePurchase}
                            className="purchase-btn"
                        >
                            <FaCreditCard />
                            Proceder al Pago
                        </button>

                        <button 
                            onClick={() => window.history.back()}
                            className="continue-shopping-btn"
                        >
                            Continuar Comprando
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}