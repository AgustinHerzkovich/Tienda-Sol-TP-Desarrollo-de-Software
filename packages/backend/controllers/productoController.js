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

  async obtenerPorId(req, res, next) {
    const id = req.params.id;
    try {
      const producto = await this.productoService.findById(id);
      res.status(200).json(producto);
    } catch (err) {
      next(err);
    }
  }

  async obtenerTodos(req, res, next) {
    // Filtros, paginación y ordenamiento desde query params
    const {
      titulo,
      categoria,
      descripcion,
      minPrecio,
      maxPrecio,
      vendedorId,
      search,
      page = 1,
      limit = 10,
      sort = 'precio', // campo de ordenamiento (precio, ventas)
      order = 'asc', // asc o desc
    } = req.query;

    const filtros = {
      titulo,
      categoria,
      descripcion,
      minPrecio,
      maxPrecio,
      vendedorId,
      search,
      sort,
      order,
    };

    try {
      const productos = await this.productoService.findAll(filtros, {
        page: Number(page),
        limit: Number(limit),
      });
      res.status(200).json(productos);
    } catch (err) {
      next(err);
    }
  }
}
