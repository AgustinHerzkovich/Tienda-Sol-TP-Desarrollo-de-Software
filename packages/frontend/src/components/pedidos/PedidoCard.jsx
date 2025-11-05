import PedidoItemsList from './PedidoItemsList.jsx';
import PedidoDireccion from './PedidoDireccion.jsx';
import PedidoAcciones from './PedidoAcciones.jsx';
import './PedidosPage.css';


export const getEstadoClass = (estado) => {
  const e = estado?.toLowerCase() || '';
  if (e.includes('pendiente')) return 'estado-pendiente';
  if (e.includes('confirmado')) return 'estado-confirmado';
  if (e.includes('enviado') || e.includes('en camino')) return 'estado-enviado';
  if (e.includes('entregado')) return 'estado-entregado';
  if (e.includes('cancelado')) return 'estado-cancelado';
  return 'estado-default';
};

export const formatearFecha = (fecha) => {
  if (!fecha) return 'Fecha no disponible';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};  

export default function PedidoCard({ 
  pedido, 
  user, 
  onCambiarEstado, 
  obtenerSimboloMoneda }) {
  return (
    <div className="pedido-card">
      <div className="pedido-card-header">
        <div className="pedido-info">
          <span className="pedido-fecha">{formatearFecha(pedido.fechaCreacion)}</span>
          <div className="estado-container">
            <span className={`pedido-estado ${getEstadoClass(pedido.estado)}`}>
              {pedido.estado || 'Pendiente'}
            </span>
            <PedidoAcciones pedido={pedido} user={user} onCambiarEstado={onCambiarEstado} />
          </div>
        </div>
        <div className="pedido-total">
          <span className="total-label">Total:</span>
          <span className="total-monto">
            {obtenerSimboloMoneda(pedido.moneda)}{pedido.total?.toFixed(2)}
          </span>
        </div>
      </div>

      <PedidoItemsList items={pedido.items} obtenerSimboloMoneda={obtenerSimboloMoneda} />
      {pedido.direccionEntrega && <PedidoDireccion direccion={pedido.direccionEntrega} />}
    </div>
  );
}