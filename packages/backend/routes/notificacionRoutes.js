import express from 'express';
import NotificacionController from '../controllers/notificacionController.js';

const pathNotificacion = '/notificaciones';

export default function notitificacionRoutes(getController) {
  const notificacionController = getController(NotificacionController);
  const router = express.Router();

  // Marcar la notificación como leída
  router.patch(pathNotificacion + '/:id', async (req, res, next) => {
    await notificacionController.modificar(req, res, next);
  });

  return router;
}
