import express from 'express';
import ProductoController from '../controllers/productoController.js';

const productoPath = '/productos';

export default function productoRoutes(getController) {
  const router = express.Router();
  const productoController = getController(ProductoController);

  /**
   * @swagger
   * /productos:
   *   post:
   *     summary: Crear producto
   *     tags: [Productos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Producto'
   *     responses:
   *       201:
   *         description: Producto creado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Producto'
   */
  router.post(productoPath, async (req, res) => {
    await productoController.crear(req, res);
  });

  return router;
}
