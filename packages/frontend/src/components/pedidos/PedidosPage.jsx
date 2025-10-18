import './PedidosPage.css';
import { useEffect, useState } from 'react';
import { useSession } from '../../context/SessionContext';
import axios from 'axios';
import { useCurrency } from '../../context/CurrencyContext';
import { FaBox, FaClipboardList, FaArrowRight, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import PageHeader from '../common/PageHeader';
import { useToast } from '../common/Toast';

export default function PedidosPage() {
  const navigate = useNavigate()
  const { user } = useSession();
  const { showToast } = useToast();
  
  useEffect(() => {
    const shouldRedirect = user==null;
    if (shouldRedirect) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pedidosEndpoint = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/usuarios/${(user?.id)}/pedidos`
  const backendPort = process.env.REACT_APP_BACKEND_PORT || '8000';
  const limit = 10;
  const { obtenerSimboloMoneda } = useCurrency();

  // Flujo de estados para vendedor
  const estadosVendedor = {
    'PENDIENTE': 'CONFIRMADO',
    'CONFIRMADO': 'EN_PREPARACION',
    'EN_PREPARACION': 'ENVIADO',
    'ENVIADO': 'ENTREGADO',
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(pedidosEndpoint);
        setPedidos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching pedidos:', error);
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchPedidos();
    }
  }, [pedidosEndpoint, user]);

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(pedidos.length / limit);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando pedidos" />;
  }

  if (pedidos.length === 0) {
    return (
      <EmptyState
        icon={FaBox}
        title="No tenés pedidos todavía"
        message="Tus compras aparecerán aquí"
      />
    );
  }

  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const pedidosAMostrar = pedidos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(pedidos.length / limit);

  const getEstadoClass = (estado) => {
    const estadoLower = estado?.toLowerCase() || '';
    if (estadoLower.includes('pendiente')) return 'estado-pendiente';
    if (estadoLower.includes('confirmado')) return 'estado-confirmado';
    if (estadoLower.includes('enviado') || estadoLower.includes('en camino')) return 'estado-enviado';
    if (estadoLower.includes('entregado')) return 'estado-entregado';
    if (estadoLower.includes('cancelado')) return 'estado-cancelado';
    return 'estado-default';
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      await axios.patch(
        `http://localhost:${backendPort}/pedidos/${pedidoId}`,
        { estado: nuevoEstado }
      );

      // Actualizar el pedido en el estado local
      setPedidos(prevPedidos =>
        prevPedidos.map(p =>
          p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
        )
      );

      showToast(`Estado actualizado a: ${nuevoEstado}`, 'success');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      showToast(`Error al cambiar estado: ${errorMsg}`, 'error');
      console.error('Error cambiando estado:', error);
    }
  };

  const puedeAvanzarEstado = (estadoActual) => {
    return user.tipo === 'VENDEDOR' && estadosVendedor[estadoActual];
  };

  const puedeCancelar = (estadoActual) => {
    return user.tipo === 'COMPRADOR' && 
           estadoActual !== 'ENVIADO' && 
           estadoActual !== 'ENTREGADO' &&
           estadoActual !== 'CANCELADO';
  };

  return (
    <div className="pedidos-page">
      <PageHeader
        icon={FaClipboardList}
        title="Mis Pedidos"
        badge={`${pedidos.length} ${pedidos.length === 1 ? 'pedido' : 'pedidos'}`}
      />

      <div className="pedidos-list">
        {pedidosAMostrar.map((pedido) => (
          <div key={pedido.id} className="pedido-card">
            <div className="pedido-card-header">
              <div className="pedido-info">
                <span className="pedido-fecha">{formatearFecha(pedido.fechaCreacion)}</span>
                <div className="estado-container">
                  <span className={`pedido-estado ${getEstadoClass(pedido.estado)}`}>
                    {pedido.estado || 'Pendiente'}
                  </span>
                  
                  {/* Botones de acción según tipo de usuario */}
                  <div className="estado-actions">
                    {puedeAvanzarEstado(pedido.estado) && (
                      <button
                        className="btn-avanzar-estado"
                        onClick={() => handleCambiarEstado(pedido.id, estadosVendedor[pedido.estado])}
                        title={`Cambiar a ${estadosVendedor[pedido.estado]}`}
                      >
                        <FaArrowRight /> {estadosVendedor[pedido.estado]}
                      </button>
                    )}
                    
                    {puedeCancelar(pedido.estado) && (
                      <button
                        className="btn-cancelar-pedido"
                        onClick={() => handleCambiarEstado(pedido.id, 'CANCELADO')}
                        title="Cancelar pedido"
                      >
                        <FaTimes /> Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="pedido-total">
                <span className="total-label">Total:</span>
                <span className="total-monto">
                  {obtenerSimboloMoneda(pedido.moneda)}{pedido.total?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>

            <div className="pedido-items">
              <h3>Productos ({Array.isArray(pedido.items) ? pedido.items.length : 0})</h3>
              <ul>
                {Array.isArray(pedido.items) && pedido.items.map((item, index) => (
                  <li key={index} className="pedido-item">
                    <div className="item-info">
                      <span className="item-cantidad">{item.cantidad}x</span>
                      <span className="item-titulo">{item.producto?.titulo || 'Producto'}</span>
                    </div>
                    <span className="item-precio">
                      {obtenerSimboloMoneda(pedido.moneda)}
                      {(item.precioUnitario * item.cantidad)?.toFixed(2) || '0.00'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {pedido.direccionEntrega && (
              <div className="pedido-direccion">
                <h4>Dirección de entrega</h4>
                <p>
                  {pedido.direccionEntrega.calle} {pedido.direccionEntrega.altura}
                  {pedido.direccionEntrega.piso && `, Piso ${pedido.direccionEntrega.piso}`}
                  {pedido.direccionEntrega.departamento && `, Depto ${pedido.direccionEntrega.departamento}`}
                  <br />
                  {pedido.direccionEntrega.ciudad}, {pedido.direccionEntrega.provincia}
                  {pedido.direccionEntrega.codigoPostal && ` (${pedido.direccionEntrega.codigoPostal})`}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            ◀ Anterior
          </button>
          <span className="pagination-info">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Siguiente ▶
          </button>
        </div>
      )}
    </div>
  );
}
