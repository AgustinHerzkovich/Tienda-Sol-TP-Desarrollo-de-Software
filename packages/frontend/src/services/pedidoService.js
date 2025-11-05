import axios from 'axios';

const pedidosDeUsuarioEndpoint = (id) =>
  process.env.REACT_APP_API_URL + '/usuarios/' + id + '/pedidos';
const pedidosEndpoint = process.env.REACT_APP_API_URL + '/pedidos';

// Obtener todos los pedidos del usuario autenticado
export const getPedidos = async (id) => {
  const response = await axios.get(pedidosDeUsuarioEndpoint(id));
  return response.data;
};

// Crear un nuevo pedido
export const crearPedido = async (pedidoData) => {
  const response = await axios.post(pedidosEndpoint, pedidoData);
  return response.data;
};

// Actualizar el estado de un pedido
export const actualizarEstadoPedido = async (pedidoId, estado) => {
  const response = await axios.patch(`${pedidosEndpoint}/${pedidoId}`, {
    estado,
  });
  return response.data;
};
