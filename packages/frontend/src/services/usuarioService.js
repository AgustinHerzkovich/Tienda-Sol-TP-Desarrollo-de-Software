import axios from 'axios';

const usuariosEndpoint = `${process.env.REACT_APP_API_URL}/usuarios`;

// Obtener usuario por email
export const getUsuarioByEmail = async (email) => {
  const response = await axios.get(`${usuariosEndpoint}`, {
    params: { email },
  });
  return response.data;
};

export const validarPassword = async (email, password) => {
  const response = await axios.get(`${usuariosEndpoint}`, {
    params: { email, password },
  });
  return response.data;
};

// Crear un nuevo usuario
export const crearUsuario = async (userData) => {
  const response = await axios.post(usuariosEndpoint, userData);
  return response.data;
};

// Actualizar contraseña de usuario
export const actualizarPassword = async (usuarioId, newPassword) => {
  const response = await axios.patch(`${usuariosEndpoint}/${usuarioId}`, {
    password: newPassword,
  });
  return response.data;
};
