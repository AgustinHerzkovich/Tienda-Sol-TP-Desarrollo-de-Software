import { FaArrowRight, FaTimes } from 'react-icons/fa';
import './PedidosPage.css';

export default function PedidoAcciones({ pedido, user, onCambiarEstado }) {
  const estadosVendedor = {
    PENDIENTE: 'CONFIRMADO',
    CONFIRMADO: 'EN_PREPARACION',
    EN_PREPARACION: 'ENVIADO',
    ENVIADO: 'ENTREGADO',
  };

  const puedeAvanzarEstado =
    user.tipo === 'VENDEDOR' && estadosVendedor[pedido.estado];
  const puedeCancelar =
    user.tipo === 'COMPRADOR' &&
    !['ENVIADO', 'ENTREGADO', 'CANCELADO'].includes(pedido.estado);

  return (
    <div className="estado-actions">
      {puedeAvanzarEstado && (
        <button
          className="btn-avanzar-estado"
          onClick={() =>
            onCambiarEstado(pedido.id, estadosVendedor[pedido.estado])
          }
        >
          <FaArrowRight /> {estadosVendedor[pedido.estado]}
        </button>
      )}
      {puedeCancelar && (
        <button
          className="btn-cancelar-pedido"
          onClick={() => onCambiarEstado(pedido.id, 'CANCELADO')}
        >
          <FaTimes /> Cancelar
        </button>
      )}
    </div>
  );
}
