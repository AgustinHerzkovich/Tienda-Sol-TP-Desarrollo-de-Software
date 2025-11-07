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

  async obtener(req, res, next) {
    const { email, password } = req.query;

    try {
      const usuarios = await this.usuarioService.find(email, password);
      res.status(200).json(usuarios);
    } catch (err) {
      next(err);
    }
  }

  async actualizar(req, res, next) {
    const usuarioId = req.params.id;
    const usuarioData = req.validatedData;
    try {
      const usuarioActualizado = await this.usuarioService.actualizar(
        usuarioId,
        usuarioData
      );
      res.status(200).json(usuarioActualizado);
    } catch (err) {
      next(err);
    }
  }

  async getDirecciones(req, res, next){
    const usuarioId = req.params.id;
    try {
      const direcciones = await this.usuarioService.getDirecciones(usuarioId);
      res.status(200).json(direcciones);
    } catch (err) {
      next(err);
    }
  }
  async postDireccion(req, res, next){
    const usuarioId = req.params.id;
    const validatedDireccion = req.validatedData;
    try {
      const direccion = await this.usuarioService.agregarDireccion(usuarioId, validatedDireccion);
      res.status(200).json(direccion);
    } catch (err) {
      next(err);
    }
  }
  async deleteDireccion(req, res, next){
    const usuarioId = req.params.id;
    const direccionId = req.params.idDireccion;
    try {
      await this.usuarioService.eliminarDireccion(usuarioId, direccionId);
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

}
