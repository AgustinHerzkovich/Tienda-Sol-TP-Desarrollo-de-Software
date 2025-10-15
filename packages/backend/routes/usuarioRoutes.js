import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { usuarioPostSchema } from '../schemas/zodSchemas/usuarioSchema.js';
import { notificacionPatchSchema } from '../schemas/zodSchemas/notificacionSchema.js';

const usuarioPath = '/usuarios';

export default function usuarioRoutes(getController) {
  const router = express.Router();
  const usuarioController = getController(UsuarioController);

  router.get(usuarioPath + '/:id/pedidos', async (req, res, next) => {
    // Compradores
    await usuarioController.pedidos(req, res, next);
  });

  router.get(
    usuarioPath + '/:id/notificaciones',
    validateSchema(notificacionPatchSchema, 'query'),
    async (req, res, next) => {
      await usuarioController.notificaciones(req, res, next);
    }
  );

  router.post(
    usuarioPath,
    validateSchema(usuarioPostSchema, 'body'),
    async (req, res, next) => {
      await usuarioController.crear(req, res, next);
    }
  );

  return router;
}
