/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         estado:
 *           type: string
 *         compradorId:
 *           type: string
 *         productos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productoId:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *         total:
 *           type: number
 *         direccionEntrega:
 *           type: string
 *     Producto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         nombre:
 *           type: string
 *         precio:
 *           type: number
 *         stock:
 *           type: integer
 *     Notificacion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         mensaje:
 *           type: string
 *         leida:
 *           type: boolean
 */
