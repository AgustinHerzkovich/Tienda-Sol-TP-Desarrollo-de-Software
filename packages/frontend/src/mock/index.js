// Re-exportar todos los mocks para facilitar el uso
export { mockUsuarios, getUsuarioById, getUsuariosByTipo } from './usuarios.js';
export {
  mockProductos,
  getProductoById,
  getProductosByCategoria,
  getProductosByVendedor,
  getProductosActivos,
  formatPrice,
} from './productos.js';
export {
  mockCategorias,
  getCategoriaById,
  getAllCategorias,
} from './categorias.js';
export {
  mockPedidos,
  getPedidoById,
  getPedidosByComprador,
  getPedidosByEstado,
  getEstadosPedido,
} from './pedidos.js';

// Función helper para simular delay de API
export const simulateApiDelay = (ms = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Función para generar IDs únicos
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Función para paginar resultados
export const paginate = (array, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const paginatedItems = array.slice(offset, offset + limit);

  return {
    data: paginatedItems,
    pagination: {
      page,
      limit,
      total: array.length,
      pages: Math.ceil(array.length / limit),
      hasNext: offset + limit < array.length,
      hasPrev: page > 1,
    },
  };
};
