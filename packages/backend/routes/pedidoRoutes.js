import express from 'express';
import PedidoController from '../controllers/pedidoController.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { pedidoPostSchema, pedidoPatchSchema } from '../schemas/zodSchemas/pedidoSchema.js';

const pedidoPath = '/pedidos';

export default function pedidoRoutes(getController) {
  const router = express.Router();
  const pedidoController = getController(PedidoController);

  router.post(pedidoPath, validateSchema(pedidoPostSchema, 'body'), async (req, res, next) => {
    await pedidoController.crear(req, res, next);
  });

  router.patch(pedidoPath + '/:id', validateSchema(pedidoPatchSchema, 'body'), async (req, res, next) => {
    await pedidoController.modificarEstado(req, res, next);
  });

  return router;
}
