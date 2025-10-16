import React, { useState } from 'react';
import { FaTrash, FaShoppingCart, FaCreditCard, FaTimes } from 'react-icons/fa';
import './CartPage.css';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import axios from 'axios';

export default function CartPage() {
  const { cartItems, removeItem, updateQuantity, clearCart } = useCart();
  const { obtenerSimboloMoneda, calcularTotal, formatearPrecio } =
    useCurrency();
  const backendPort = process.env.REACT_APP_BACKEND_PORT || '8000';
  const pedidosEndpoint = `http://localhost:${backendPort}/pedidos`;

  // Calcular total con conversión automática
  const {
    total,
    moneda: monedaPredominante,
    desglosePorMoneda,
  } = calcularTotal(cartItems);

  // Estado para el modal de dirección
  const [showModal, setShowModal] = useState(false);
  const [direccionEntrega, setDireccionEntrega] = useState({
    calle: '',
    altura: '',
    piso: '',
    departamento: '',
    codigoPostal: '',
    ciudad: '',
    provincia: '',
    pais: 'Argentina',
    lat: '',
    lon: '',
  });

  // Función para manejar cambios en el formulario de dirección
  const handleDireccionChange = (e) => {
    const { name, value } = e.target;
    setDireccionEntrega((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Abrir modal de dirección
  const handleProcederAlPago = () => {
    if (cartItems.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    setShowModal(true);
  };

  // Confirmar compra con dirección
  const handleConfirmarCompra = async (e) => {
    e.preventDefault();

    // TODO: obtener el ID del usuario logueado desde el contexto de sesión
    const compradorId = '68ddba1db7f97f2b83438913'; // TEMPORAL - Cambiar por ID real del usuario logueado

    // Convertir los items del carrito al formato que espera el backend
    const items = cartItems.map((item) => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
    }));

    // Usar la moneda predominante calculada automáticamente
    const moneda = monedaPredominante;

    const pedidoData = {
      compradorId,
      items,
      moneda,
      direccionEntrega,
    };

    console.log('💰 Moneda predominante:', moneda);
    console.log('📊 Desglose por moneda:', desglosePorMoneda);
    console.log('💵 Total convertido:', total);

    try {
      const response = await axios.post(pedidosEndpoint, pedidoData);

      alert('Compra realizada con éxito. ¡Gracias por tu compra!');
      setShowModal(false);
      clearCart();
      // Resetear formulario
      setDireccionEntrega({
        calle: '',
        altura: '',
        piso: '',
        departamento: '',
        codigoPostal: '',
        ciudad: '',
        provincia: '',
        pais: 'Argentina',
        lat: '',
        lon: '',
      });
    } catch (error) {
      alert(
        `Hubo un error al procesar tu compra: ${error.response?.data?.message || error.message}`
      );
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <h1>
            <FaShoppingCart /> Mi Carrito
          </h1>
        </div>
        <div className="empty-cart">
          <FaShoppingCart className="empty-icon" />
          <h2>Tu carrito está vacío</h2>
          <p>¡Explora nuestros productos y encuentra algo que te guste!</p>
          <button
            className="continue-shopping"
            onClick={() => window.history.back()}
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>
          <FaShoppingCart /> Mi Carrito
        </h1>
        <span className="item-count">
          {cartItems.length} producto{cartItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.producto.id} className="cart-item">
              <div className="item-image">
                <img src={item.producto.fotos[0]} alt={item.producto.titulo} />
              </div>

              <div className="item-details">
                <h3>{item.producto.titulo}</h3>
                <p className="item-price">
                  {obtenerSimboloMoneda(item.producto.moneda)}
                  {item.producto.precio.toLocaleString()}
                </p>
              </div>

              <div className="quantity-controls">
                <button
                  onClick={() =>
                    updateQuantity(item.producto.id, item.cantidad - 1)
                  }
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity">{item.cantidad}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.producto.id, item.cantidad + 1)
                  }
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <div className="item-total">
                <span>
                  {obtenerSimboloMoneda(item.producto.moneda)}
                  {(item.precioUnitario * item.cantidad).toLocaleString()}
                </span>
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

            {/* Mostrar desglose si hay múltiples monedas */}
            {Object.keys(desglosePorMoneda).length > 1 && (
              <div className="currency-breakdown">
                <p className="breakdown-title">Desglose por moneda:</p>
                {Object.entries(desglosePorMoneda).map(([moneda, monto]) => (
                  <div key={moneda} className="breakdown-row">
                    <span>{moneda}:</span>
                    <span>{formatearPrecio(monto, moneda)}</span>
                  </div>
                ))}
                <div className="breakdown-note">
                  * Convertido a {monedaPredominante}
                </div>
              </div>
            )}

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatearPrecio(total, monedaPredominante)}</span>
            </div>

            <div className="summary-row">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>

            <div className="summary-row total">
              <span>Total:</span>
              <span>{formatearPrecio(total, monedaPredominante)}</span>
            </div>

            <button onClick={handleProcederAlPago} className="purchase-btn">
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

      {/* Modal de dirección de entrega */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Dirección de Entrega</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleConfirmarCompra} className="direccion-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="calle">Calle *</label>
                  <input
                    type="text"
                    id="calle"
                    name="calle"
                    value={direccionEntrega.calle}
                    onChange={handleDireccionChange}
                    required
                    placeholder="Ej: Av. Libertador"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="altura">Altura *</label>
                  <input
                    type="text"
                    id="altura"
                    name="altura"
                    value={direccionEntrega.altura}
                    onChange={handleDireccionChange}
                    required
                    placeholder="Ej: 1234"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="piso">Piso *</label>
                  <input
                    type="text"
                    id="piso"
                    name="piso"
                    value={direccionEntrega.piso}
                    onChange={handleDireccionChange}
                    required
                    placeholder="Ej: 3"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="departamento">Departamento</label>
                  <input
                    type="text"
                    id="departamento"
                    name="departamento"
                    value={direccionEntrega.departamento}
                    onChange={handleDireccionChange}
                    placeholder="Ej: A"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="codigoPostal">Código Postal *</label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={direccionEntrega.codigoPostal}
                    onChange={handleDireccionChange}
                    required
                    placeholder="Ej: 5000"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ciudad">Ciudad *</label>
                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={direccionEntrega.ciudad}
                    onChange={handleDireccionChange}
                    required
                    placeholder="Ej: Córdoba"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="provincia">Provincia *</label>
                  <input
                    type="text"
                    id="provincia"
                    name="provincia"
                    value={direccionEntrega.provincia}
                    onChange={handleDireccionChange}
                    required
                    placeholder="Ej: Córdoba"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pais">País *</label>
                  <input
                    type="text"
                    id="pais"
                    name="pais"
                    value={direccionEntrega.pais}
                    onChange={handleDireccionChange}
                    required
                    placeholder="Ej: Argentina"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lat">Latitud *</label>
                  <input
                    type="text"
                    id="lat"
                    name="lat"
                    value={direccionEntrega.lat}
                    onChange={handleDireccionChange}
                    required
                    placeholder="Ej: -31.4201"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lon">Longitud *</label>
                  <input
                    type="text"
                    id="lon"
                    name="lon"
                    value={direccionEntrega.lon}
                    onChange={handleDireccionChange}
                    required
                    placeholder="Ej: -64.1888"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-cancelar"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-confirmar">
                  <FaCreditCard />
                  Confirmar Compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
