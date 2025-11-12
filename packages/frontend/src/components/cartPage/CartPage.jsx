import { useState, useEffect } from 'react';
import {
  FaTrash,
  FaShoppingCart,
  FaCreditCard,
  FaTimes,
  FaSave,
} from 'react-icons/fa';
import './CartPage.css';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { crearPedido } from '../../services/pedidoService';
import { useSession } from '../../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../common/EmptyState';
import PageHeader from '../common/PageHeader';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

export default function CartPage() {
  const { cartItems, removeItem, updateQuantity, clearCart } = useCart();
  const { obtenerSimboloMoneda, calcularTotal, formatearPrecio } =
    useCurrency();
  const { user } = useSession();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [direccionesUsuario, setDireccionesUsuario] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    
    const direccionesEndpoint = `${process.env.REACT_APP_API_URL}/usuarios/${user.id}/direcciones`;
    
    axios
      .get(direccionesEndpoint)
      .then((res) => {
        setDireccionesUsuario(res.data);
      })
      .catch((err) => {
        console.error('Error al cargar direcciones:', err);
        showToast('Error al cargar direcciones guardadas', 'error');
      });
  }, [user?.id, showToast]);

  const handleGuardarDireccion = async () => {
    if (!user?.id) return;
    
    const direccionesEndpoint = `${process.env.REACT_APP_API_URL}/usuarios/${user.id}/direcciones`;
    
    try {
      await setearLatitudYLongitud(direccionEntrega);
      const res = await axios.post(direccionesEndpoint, direccionEntrega);
      setDireccionesUsuario((prev) => [...prev, res.data]);
      showToast('Dirección guardada', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al guardar la dirección', 'error');
    }
  };

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
      showToast('Tu carrito está vacío', 'error');
      return;
    }
    setShowModal(true);
  };

  const handleContinuarCompra = () => {
    navigate('/productos');
  };

  const setearLatitudYLongitud = async (direccion) => {
    // Construir query de búsqueda con los datos de la dirección
    const query = `${direccion.calle} ${direccion.altura}, ${direccion.ciudad}, ${direccion.provincia}, ${direccion.pais}`;
    
    try {
      // Nominatim API (OpenStreetMap) - gratuita, sin API key
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: 1,
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'TiendaSol-App/1.0' // Nominatim requiere User-Agent
        }
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        direccion.lat = lat;
        direccion.lon = lon;
        console.log(`Coordenadas encontradas: lat=${lat}, lon=${lon}`);
      } else {
        console.warn('No se encontraron coordenadas para la dirección proporcionada');
        // Dejar lat/lon vacíos o usar valores por defecto (ej. centro de la ciudad)
        showToast('No se pudo geocodificar la dirección. Verifica los datos.', 'warning');
      }
    } catch (error) {
      console.error('Error al obtener coordenadas:', error);
      showToast('Error al obtener coordenadas de la dirección', 'error');
      // No bloquear el flujo, seguir adelante con lat/lon vacíos o que el backend maneje
    }
  };

  // Confirmar compra con dirección
  const handleConfirmarCompra = async (e) => {
    e.preventDefault();

    const compradorId = user.id;

    // Convertir los items del carrito al formato que espera el backend
    const items = cartItems.map((item) => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
    }));

    // Usar la moneda predominante calculada automáticamente
    const moneda = monedaPredominante;
    
    // Obtener coordenadas antes de enviar el pedido (await para esperar)
    await setearLatitudYLongitud(direccionEntrega);

    const pedidoData = {
      compradorId,
      items,
      moneda,
      direccionEntrega,
      desglosePorMoneda,
    };

    try {
      await crearPedido(pedidoData);

      showToast(
        '¡Compra realizada con éxito! Gracias por tu compra',
        'success'
      );
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

      // Redirigir a pedidos después de 1 segundo
      setTimeout(() => navigate('/pedidos'), 1000);
    } catch (error) {
      showToast(
        `Error al procesar tu compra: ${error.response?.data?.message || error.message}`,
        'error'
      );
    }
  };

  if (cartItems.length === 0) {
    return (
      <EmptyState
        icon={FaShoppingCart}
        title="Tu carrito está vacío"
        message="¡Explora nuestros productos y encuentra algo que te guste!"
        actionButton={
          <Button variant="primary" onClick={handleContinuarCompra}>
            Continuar Comprando
          </Button>
        }
      />
    );
  }

  return (
    <div className="cart-page">
      <PageHeader
        icon={FaShoppingCart}
        title="Mi Carrito"
        badge={`${cartItems.length} producto${cartItems.length !== 1 ? 's' : ''}`}
      />

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.producto.id} className="cart-item">
              <div className="item-image">
                <img src={item.producto.fotos[0]} alt="" />
              </div>

              <div className="item-details">
                <h2>{item.producto.titulo}</h2>
                <h3 className="item-price">
                  {obtenerSimboloMoneda(item.producto.moneda)}
                  {item.producto.precio.toLocaleString()}
                </h3>
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
              onClick={handleContinuarCompra}
              className="continue-shopping-btn"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>

      {/* Modal de dirección de entrega */}
      {showModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title-direccion"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="modal-title-direccion">Dirección de Entrega</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Cerrar modal"
              >
                <FaTimes />
              </button>
            </div>
            {/* Lista de direcciones existentes */}
            <div className="form-group">
              <h3 className="form-section-title">Direcciones guardadas</h3>

              {direccionesUsuario.length === 0 ? (
                <p>No hay direcciones guardadas</p>
              ) : (
                <ul className="lista-direcciones">
                  {direccionesUsuario.map((d) => (
                    <li key={d._id} className="direccion-item">
                      <button
                        type="button"
                        className="direccion-boton"
                        onClick={() => setDireccionEntrega(d)} // selecciona dirección
                      >
                        {`${d.calle} ${d.altura}, ${d.ciudad}`}
                      </button>

                      {/* Botón de eliminar*/}
                      <button
                        type="button"
                        className="btn-eliminar"
                        onClick={async () => {
                          if (!user?.id) return;
                          
                          const direccionesEndpoint = `${process.env.REACT_APP_API_URL}/usuarios/${user.id}/direcciones`;
                          
                          try {
                            await axios.delete(
                              `${direccionesEndpoint}/${d._id}`
                            );
                            setDireccionesUsuario((prev) =>
                              prev.filter((dir) => dir._id !== d._id)
                            );
                            showToast('Dirección eliminada', 'success');
                          } catch (err) {
                            console.error(err);
                            showToast(
                              'Error al eliminar la dirección',
                              'error'
                            );
                          }
                        }}
                        title="Eliminar dirección"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
                <button
                  type="button"
                  onClick={handleGuardarDireccion} // Hace un post de la direccion y agrega a la lista
                  className="btn-cancelar"
                >
                  <FaSave /> Guardar Dirección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
