import express from 'express';
import PedidoController from '../controllers/healthCheckController.js';

const pedidoPath = '/pedidos';

export default function pedidoRoutes(getController) {
  const router = express.Router();
  const pedidoController = getController(PedidoController);
  /**
   * @swagger
   * /pedidos:
   *   post:
   *     summary: Crear un pedido
   *     tags: [Pedidos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Pedido'
   *     responses:
   *       201:
   *         description: Pedido creado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Pedido'
   */
  router.post(pedidoPath, async (req, res) => {
    await pedidoController.crear(req, res);
  });

  /**
   * @swagger
   * /pedidos/{id}:
   *   patch:
   *     summary: Modificar estado de un pedido
   *     tags: [Pedidos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               estado:
   *                 type: string
   *                 enum: [PENDIENTE, CONFIRMADO, EN_PREPARACION, ENVIADO, ENTREGADO, CANCELADO]
   *     responses:
   *       200:
   *         description: Estado actualizado
   */
  router.patch(pedidoPath + '/:id', async (req, res) => {
    await pedidoController.modificarEstado(req, res);
  });

  return router;
}
