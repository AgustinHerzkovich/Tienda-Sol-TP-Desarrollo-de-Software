import express from 'express';
import ProductoController from '../controllers/productoController.js';

const productoPath = '/productos';

export default function productoRoutes(getController) {
  const router = express.Router();
  const productoController = getController(ProductoController);

  router.post(productoPath, async (req, res) => {
    await productoController.crear(req, res);
  });

  return router;
}
