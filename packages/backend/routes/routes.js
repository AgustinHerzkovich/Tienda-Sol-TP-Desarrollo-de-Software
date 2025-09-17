import healthCheckRoutes from './healthCheckRoutes.js';
import notitificacionRoutes from './notificacionRoutes.js';
import pedidoRoutes from './pedidoRoutes.js';
import productoRoutes from './productoRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';

// Acá ponemos todos los archivos routes que tengamos
const routes = [
  healthCheckRoutes,
  pedidoRoutes,
  usuarioRoutes,
  productoRoutes,
  notitificacionRoutes
];

export default routes;
