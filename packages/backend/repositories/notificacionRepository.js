import { NotificacionModel } from '../schemas/mongooseSchemas/notificacionSchema.js';

export default class NotificacionRepository extends Repository {
  constructor() {
    super(NotificacionModel)
  }

  async findByUserId(idBuscado) {
    return await this.model.find({ usuarioDestino: idBuscado });
  }
}
