import axios from 'axios';

const productosEndpoint = process.env.REACT_APP_API_URL + '/productos';

// Obtener todos los productos con filtros y paginación
export const getProductos = async (params = {}) => {
  const response = await axios.get(productosEndpoint, { params });
  return response.data;
};

// Obtener un producto por ID
export const getProductoById = async (productoId) => {
  const response = await axios.get(`${productosEndpoint}/${productoId}`);
  return response.data;
};

// Crear un nuevo producto
export const crearProducto = async (productoData) => {
  const response = await axios.post(productosEndpoint, productoData);
  return response.data;
};

// Actualizar un producto
export const actualizarProducto = async (productoId, productoData) => {
  const response = await axios.put(
    `${productosEndpoint}/${productoId}`,
    productoData
  );
  return response.data;
};

// Eliminar un producto
export const eliminarProducto = async (productoId) => {
  const response = await axios.delete(`${productosEndpoint}/${productoId}`);
  return response.data;
};
