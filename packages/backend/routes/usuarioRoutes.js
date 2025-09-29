import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';

const usuarioPath = '/usuarios';

export default function usuarioRoutes(getController) {
  const router = express.Router();
  const usuarioController = getController(UsuarioController);

  router.get(usuarioPath + '/:id/pedidos', async (req, res, next) => {
    // Compradores
    await usuarioController.pedidos(req, res, next);
  });

  router.get(usuarioPath + '/:id/productos', async (req, res, next) => {
    // Vendedores
    await usuarioController.productos(req, res, next);
  });

  router.get(usuarioPath + '/:id/notificaciones', async (req, res, next) => {
    await usuarioController.notificaciones(req, res, next);
  });

  router.post(usuarioPath, async (req, res, next) => {
    await usuarioController.crear(req, res, next);
  });

  return router;
}
