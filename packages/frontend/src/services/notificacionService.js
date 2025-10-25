import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Obtener notificaciones de un usuario (leídas o no leídas)
export const getNotificacionesByUsuario = async (usuarioId, read) => {
  const response = await axios.get(
    `${API_URL}/usuarios/${usuarioId}/notificaciones`,
    { params: { read } }
  );
  return response.data;
};

// Marcar una notificación como leída
export const marcarNotificacionComoLeida = async (notificacionId) => {
  const response = await axios.patch(
    `${API_URL}/notificaciones/${notificacionId}`,
    { read: true }
  );
  return response.data;
};
