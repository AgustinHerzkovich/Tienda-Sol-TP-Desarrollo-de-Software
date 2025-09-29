import {
  pedidoPostSchema,
  pedidoPatchSchema,
} from '../schemas/zodSchemas/pedidoSchema.js';

export default class PedidoController {
  constructor(pedidoService) {
    this.pedidoService = pedidoService;
  }

  async crear(req, res, next) {
    const body = req.body;
    const resultBody = pedidoPostSchema.safeParse(body);
    if (resultBody.error) {
      res.status(400).json(resultBody.error.issues);
      return;
    }
    try {
      const pedido = await this.pedidoService.crear(resultBody.data);
      res.status(201).json(pedido);
    } catch (err) {
      next(err);
    }
  }

  async modificarEstado(req, res, next) {
    const id = req.params.id;
    let pedido = pedidoPatchSchema.safeParse(req.body);
    if (pedido.error) {
      res.status(400).json(pedido.error.issues);
      return;
    }
    try {
      pedido = await this.pedidoService.modificar(id, pedido.data);
      res.status(200).json(pedido);
    } catch (err) {
      next(err);
    }
  }
}
