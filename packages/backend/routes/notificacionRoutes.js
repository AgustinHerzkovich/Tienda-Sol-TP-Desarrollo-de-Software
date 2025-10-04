import express from 'express';
import NotificacionController from '../controllers/notificacionController.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { notificacionPatchSchema } from '../schemas/zodSchemas/notificacionSchema.js';

const pathNotificacion = '/notificaciones';

export default function notitificacionRoutes(getController) {
  const notificacionController = getController(NotificacionController);
  const router = express.Router();

  // Marcar la notificación como leída
  router.patch(
    pathNotificacion + '/:id',
    validateSchema(notificacionPatchSchema, 'body'),
    async (req, res, next) => {
      await notificacionController.modificar(req, res, next);
    }
  );

  return router;
}
