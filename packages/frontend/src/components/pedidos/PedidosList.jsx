import PedidoCard from './PedidoCard';
import Pagination from '../common/Pagination';
import './PedidosPage.css';

export default function PedidosList({
  pedidos,
  currentPage,
  setCurrentPage,
  limit,
  onCambiarEstado,
  obtenerSimboloMoneda,
  user,
}) {
  const totalPages = Math.ceil(pedidos.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const pedidosAMostrar = pedidos.slice(startIndex, endIndex);

  return (
    <>
      <div className="pedidos-list">
        {pedidosAMostrar.map((pedido) => (
          <PedidoCard
            key={pedido.id}
            pedido={pedido}
            onCambiarEstado={onCambiarEstado}
            obtenerSimboloMoneda={obtenerSimboloMoneda}
            user={user}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={pedidos.length}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
