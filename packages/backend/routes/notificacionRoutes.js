import express from 'express';
import NotificacionController from '../controllers/notificacionController.js';

const pathNotificacion = '/notificaciones';

export default function notitificacionRoutes(getController) {
  const notificacionController = getController(NotificacionController);
  const router = express.Router();

  // Marcar la notificación como leída

  /**
   * @swagger
   * /notificaciones/{id}:
   *   patch:
   *     summary: Marcar notificación como leída
   *     tags: [Notificaciones]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Notificación leída
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Notificacion'
   */
  router.patch(pathNotificacion + '/:id', async (req, res) => {
    await notificacionController.modificar(req, res);
  });

  return router;
}
