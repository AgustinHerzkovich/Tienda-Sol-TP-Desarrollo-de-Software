export default class PedidoController {
  constructor(pedidoService) {
    this.pedidoService = pedidoService;
  }

  async crear(req, res, next) {
    try {
      const pedido = await this.pedidoService.crear(req.validatedData);
      res.status(201).json(pedido);
    } catch (err) {
      next(err);
    }
  }

  async modificarEstado(req, res, next) {
    const id = req.params.id;
    try {
      const pedido = await this.pedidoService.modificar(id, req.validatedData);
      res.status(200).json(pedido);
    } catch (err) {
      next(err);
    }
  }
}
