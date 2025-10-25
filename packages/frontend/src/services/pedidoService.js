import axios from 'axios';

const pedidosEndpoint = process.env.REACT_APP_API_URL + '/pedidos';

// Obtener todos los pedidos del usuario autenticado
export const getPedidos = async () => {
  const response = await axios.get(pedidosEndpoint);
  return response.data;
};

// Obtener un pedido por ID
export const getPedidoById = async (pedidoId) => {
  const response = await axios.get(`${pedidosEndpoint}/${pedidoId}`);
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
