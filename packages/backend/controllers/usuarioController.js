import { notificacionPatchSchema } from '../schemas/zodSchemas/notificacionSchema.js';

export default class UsuarioController {
  constructor(usuarioService, pedidoService, notificacionService, productoService) {
    this.usuarioService = usuarioService;
    this.pedidoService = pedidoService;
    this.notificacionService = notificacionService;
    this.productoService = productoService;
  }

  async pedidos(req, res, next) {
    // validar id con db
    const id = req.params.id;

    try {
      await this.usuarioService.findById(id);
      const pedidos = await this.pedidoService.pedidosByUser(id);
      res.status(200).json(pedidos);
    } catch (err) {
      next(err);
    }
  }

  async productos(req, res, next) {
    const id = req.params.id;
    // Filtros, paginación y ordenamiento desde query params
    const {
      titulo,
      categoria,
      descripcion,
      minPrecio,
      maxPrecio,
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
      sort,
      order,
    };

    try {
      await this.usuarioService.findById(id);
      const productos = await this.productoService.findByVendedorId(
        id,
        filtros,
        {
          page: Number(page),
          limit: Number(limit),
        }
      );
      res.status(200).json(productos);
    } catch (err) {
      next(err);
    }
  }

  async notificaciones(req, res, next) {
    const id = req.params.id;
    const { read } = req.validatedData;

    try {
      await this.usuarioService.findById(id);
      const notificaciones = await this.notificacionService.findByUsuarioId(
        id,
        read
      );
      res.status(200).json(notificaciones);
    } catch (err) {
      next(err);
    }
  }

  async crear(req, res, next) {
    try {
      const usuario = await this.usuarioService.crear(req.validatedData);
      res.status(201).json(usuario);
    } catch (err) {
      next(err);
    }
  }
}
