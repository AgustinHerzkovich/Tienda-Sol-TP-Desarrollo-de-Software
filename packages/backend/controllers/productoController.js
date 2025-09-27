import { productoPostSchema } from '../schemas/zodSchemas/productoSchema.js';

export default class ProductoController {
  constructor(productoService) {
    this.productoService = productoService;
  }

  async crear(req, res) {
    const body = req.body;
    const resultBody = productoPostSchema.safeParse(body);
    if (resultBody.error) {
      res.status(400).json(resultBody.error.issues);
    }
    const producto = await this.productoService.crear(resultBody.data);
    res.status(201).json(producto);
  }
}
