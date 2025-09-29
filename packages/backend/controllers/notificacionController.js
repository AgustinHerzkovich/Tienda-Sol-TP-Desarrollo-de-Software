import { notificacionPatchSchema } from '../schemas/zodSchemas/notificacionSchema.js';

export default class NotificacionController {
  constructor(notificacionService) {
    this.notificationService = notificacionService;
  }

  async modificar(req, res, next) {
    const id = req.params.id;

    const resultBody = notificacionPatchSchema.safeParse(req.body);

    if (resultBody.error) {
      res.status(400).json(resultBody.error.issues);
      return;
    }

    try {
      const notificacionModificada = await this.notificationService.modificar(
        id,
        resultBody.data
      );
      res.status(200).json(notificacionModificada);
    } catch (err) {
      next(err);
    }
  }
}
