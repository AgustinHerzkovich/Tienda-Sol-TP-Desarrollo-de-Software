export default class NotificacionController {
  constructor(notificacionService) {
    this.notificationService = notificacionService;
  }

  async modificar(req, res, next) {
    const id = req.params.id;
    try {
      const notificacionModificada = await this.notificationService.modificar(id, req.validatedData);
      res.status(200).json(notificacionModificada);
    } catch (err) {
      next(err);
    }
  }
}
