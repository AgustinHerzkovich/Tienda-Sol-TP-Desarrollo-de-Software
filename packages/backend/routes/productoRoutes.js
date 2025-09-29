import express from 'express';
import ProductoController from '../controllers/productoController.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { productoPostSchema } from '../schemas/zodSchemas/productoSchema.js';

const productoPath = '/productos';

export default function productoRoutes(getController) {
  const router = express.Router();
  const productoController = getController(ProductoController);

  router.post(productoPath, validateSchema(productoPostSchema, 'body'), async (req, res, next) => {
    await productoController.crear(req, res, next);
  });

  return router;
}
