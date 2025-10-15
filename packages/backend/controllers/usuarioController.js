export default class UsuarioController {
  constructor(usuarioService, pedidoService, notificacionService) {
    this.usuarioService = usuarioService;
    this.pedidoService = pedidoService;
    this.notificacionService = notificacionService;
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
