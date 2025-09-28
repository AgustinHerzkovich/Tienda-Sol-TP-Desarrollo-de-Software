import { NotificacionModel } from '../schemas/mongooseSchemas/notificacionSchema.js';
import Repository from './repository.js';

export default class NotificacionRepository extends Repository {
  constructor() {
    super(NotificacionModel)
  }

  async findByUserId(idBuscado) {
    return await this.model.find({ usuarioDestino: idBuscado });
  }
}
