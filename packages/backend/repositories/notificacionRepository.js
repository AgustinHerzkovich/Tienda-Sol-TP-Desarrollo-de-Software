import { NotificacionModel } from '../schemas/mongooseSchemas/notificacionSchema.js';
import Repository from './repository.js';
import mongoose from 'mongoose';

export default class NotificacionRepository extends Repository {
  constructor() {
    super(NotificacionModel);
  }

  async findByUserId(idBuscado, leida) {
    const objectId = new mongoose.Types.ObjectId(idBuscado);
    return await this.model.find({
      usuarioDestino: objectId,
      leida: leida,
    });
  }
}
