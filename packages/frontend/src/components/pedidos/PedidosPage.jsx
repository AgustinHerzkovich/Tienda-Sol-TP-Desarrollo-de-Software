import './PedidosPage.css';
import { useEffect, useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { getPedidos, actualizarEstadoPedido } from '../../services/pedidoService';
import { useCurrency } from '../../context/CurrencyContext';
import { useNavigate } from 'react-router';
import { FaClipboardList, FaBox } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import PageHeader from '../common/PageHeader';
import { useToast } from '../common/Toast';
import PedidosList from './PedidosList';

export default function PedidosPage() {
  const navigate = useNavigate();
  const { user } = useSession();
  const { showToast } = useToast();
  const { obtenerSimboloMoneda } = useCurrency();

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    let isMounted = true;

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const data = await getPedidos(user.id);
        if (isMounted) setPedidos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching pedidos:', error);
        if (isMounted) setPedidos([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPedidos();

    return () => (isMounted = false);
  }, [user, navigate]);

  const handleCambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(pedidoId, nuevoEstado);
      setPedidos(prev =>
        prev.map(p => (p.id === pedidoId ? { ...p, estado: nuevoEstado } : p))
      );
      showToast(`Estado actualizado a: ${nuevoEstado}`, 'success');
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      showToast(`Error al cambiar estado: ${msg}`, 'error');
    }
  };

  if (loading) return <LoadingSpinner message="Cargando pedidos" />;
  if (pedidos.length === 0)
    return (
      <EmptyState
        icon={FaBox}
        title="No tenés pedidos todavía"
        message="Tus compras aparecerán aquí"
      />
    );

  return (
    <div className="pedidos-page">
      <PageHeader
        icon={FaClipboardList}
        title="Mis Pedidos"
        badge={`${pedidos.length} ${pedidos.length === 1 ? 'pedido' : 'pedidos'}`}
      />

      <PedidosList
        pedidos={pedidos}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={2}
        onCambiarEstado={handleCambiarEstado}
        obtenerSimboloMoneda={obtenerSimboloMoneda}
        user={user}
      />
    </div>
  );
}
