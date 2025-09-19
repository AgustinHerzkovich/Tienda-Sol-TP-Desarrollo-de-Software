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
 *           enum: [PENDIENTE, CONFIRMADO, EN_PREPARACION, ENVIADO, ENTREGADO, CANCELADO]
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
 *         moneda:
 *           type: string
 *           enum: [PESO_ARG, DOLAR_USA, REAL]
 *         direccionEntrega:
 *           type: object
 *           properties:
 *             calle:
 *               type: string
 *             altura:
 *               type: string
 *             piso:
 *               type: string
 *             departamento:
 *               type: string
 *             codigoPostal:
 *               type: string
 *             ciudad:
 *               type: string
 *             provincia:
 *               type: string
 *             pais:
 *               type: string
 *             lat:
 *               type: string
 *             lon:
 *               type: string
 *
 *     Producto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         vendedorId:
 *           type: string
 *         titulo:
 *           type: string
 *         descripcion:
 *           type: string
 *         categorias:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *         precio:
 *           type: number
 *         moneda:
 *           type: string
 *           enum: [PESO_ARG, DOLAR_USA, REAL]
 *         stock:
 *           type: integer
 *         fotos:
 *           type: array
 *           items:
 *             type: string
 *         activo:
 *           type: boolean
 *
 *     Notificacion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         usuarioDestinoId:
 *           type: string
 *         mensaje:
 *           type: string
 *         leida:
 *           type: boolean
 *
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         nombre:
 *           type: string
 *         mail:
 *           type: string
 *         telefono:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [COMPRADOR, VENDEDOR, ADMIN]
 */
