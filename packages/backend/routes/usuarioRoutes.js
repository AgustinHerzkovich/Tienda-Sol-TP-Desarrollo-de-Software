import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';

const usuarioPath = '/usuarios';

export default function usuarioRoutes(getController) {
  const router = express.Router();
  const usuarioController = getController(UsuarioController);

  /**
   * @swagger
   * /usuarios/{id}/pedidos:
   *   get:
   *     summary: Pedidos de un usuario
   *     tags: [Usuarios]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de pedidos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Pedido'
   */
  router.get(usuarioPath + '/:id/pedidos', async (req, res) => {
    // Compradores
    await usuarioController.pedidos(req, res);
  });

  /**
   * @swagger
   * /usuarios/{id}/productos:
   *   get:
   *     summary: Productos de un vendedor
   *     tags: [Usuarios]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de productos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Producto'
   */
  router.get(usuarioPath + '/:id/productos', async (req, res) => {
    // Vendedores
    await usuarioController.productos(req, res);
  });

  /**
   * @swagger
   * /usuarios/{id}/notificaciones:
   *   get:
   *     summary: Notificaciones de un usuario
   *     tags: [Usuarios]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de notificaciones
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Notificacion'
   */
  router.get(usuarioPath + '/:id/notificaciones', async (req, res) => {
    await usuarioController.notificaciones(req, res);
  });

  /**
   * @swagger
   * /usuarios:
   *   post:
   *     summary: Crear un usuario
   *     tags: [Usuarios]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Usuario'
   *     responses:
   *       201:
   *         description: Usuario creado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Usuario'
   */
  router.post(usuarioPath, async (req, res) => {
    await usuarioController.crear(req, res);
  });

  return router;
}
