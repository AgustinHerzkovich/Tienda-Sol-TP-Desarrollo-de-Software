import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';

const usuarioPath = '/usuarios';

export default function usuarioRoutes(getController) {
  const router = express.Router();
  const usuarioController = getController(UsuarioController);

  router.get(usuarioPath + '/:id/pedidos', async (req, res) => {
    // Compradores
    await usuarioController.pedidos(req, res);
  });

  router.get(usuarioPath + '/:id/productos', async (req, res) => {
    // Vendedores
    await usuarioController.productos(req, res);
  });

  router.get(usuarioPath + '/:id/notificaciones', async (req, res) => {
    await usuarioController.notificaciones(req, res);
  });

  router.post(usuarioPath, async (req, res) => {
    await usuarioController.crear(req, res);
  });

  return router;
}
