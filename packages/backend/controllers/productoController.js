export default class ProductoController {
  constructor(productoService) {
    this.productoService = productoService;
  }

  async crear(req, res, next) {
    try {
      const producto = await this.productoService.crear(req.validatedData);
      res.status(201).json(producto);
    } catch (err) {
      next(err);
    }
  }
}
