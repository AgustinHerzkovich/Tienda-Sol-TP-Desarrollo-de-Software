import { notificacionPatchSchema } from '../schemas/notificacionSchema.js';
import { usuarioPostSchema } from '../schemas/usuarioSchema.js';

export default class UsuarioController {
  constructor(usuarioService, pedidoService, notificacionService) {
    this.usuarioService = usuarioService;
    this.pedidoService = pedidoService;
    this.notificacionService = notificacionService;
  }

  async pedidos(req, res) {
    // validar id con db
    const id = req.params.id;

    try {
      await this.usuarioService.validarUsuarioId(id);
      const pedidos = await this.pedidoService.pedidosByUser(id);
      res.status(200).json(pedidos);
    } catch (err) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
  }

  async productos(req, res) {
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
      await this.usuarioService.validarUsuarioId(id);
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
      res.status(err.statusCode).json({ error: err.message });
    }
  }

  async notificaciones(req, res) {
    const id = req.params.id;
    const { read } = notificacionPatchSchema.safeParse(req.query);

    try {
      await this.usuarioService.validarUsuarioId(id);
      const notificaciones = await this.notificacionService.findByUsuarioId(
        id,
        read
      );
      res.status(200).json(notificaciones);
    } catch (err) {
      res.status(err.statusCode).json({ error: err.message });
    }
  }

  async crear(req, res) {
    const body = req.body
    const resultBody = usuarioPostSchema.safeParse(body)
    
    if (resultBody.error) {
      res.status(400).json(resultBody.error.issues)
    }

    const usuario = await this.usuarioService.crear(resultBody.data)
    res.status(201).json(usuario)
  }
}
