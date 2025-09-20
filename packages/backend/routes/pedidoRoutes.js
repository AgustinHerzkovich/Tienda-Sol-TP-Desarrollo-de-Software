import express from 'express';
import PedidoController from '../controllers/pedidoController.js';

const pedidoPath = '/pedidos';

export default function pedidoRoutes(getController) {
  const router = express.Router();
  const pedidoController = getController(PedidoController);

  router.post(pedidoPath, async (req, res) => {
    await pedidoController.crear(req, res);
  });

  router.patch(pedidoPath + '/:id', async (req, res) => {
    await pedidoController.modificarEstado(req, res);
  });

  return router;
}
