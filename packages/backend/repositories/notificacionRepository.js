import { NotificacionModel } from '../schemas/mongooseSchemas/notificacionSchema.js';

export default class NotificacionRepository {
  constructor() {
    this.model = NotificacionModel;
  }

  async create(notificacion) {
    const notificacionGuardada = new this.model(notificacion);
    return await notificacionGuardada.save();
  }

  async update(id, notificacion) {
    return await this.model.findByIdAndUpdate(id, notificacion, { new: true });
  }

  async findById(idBuscado) {
    return await this.model.findById(idBuscado);
  }

  async findByUserId(idBuscado) {
    return await this.model.find({ usuarioDestino: idBuscado });
  }
}
