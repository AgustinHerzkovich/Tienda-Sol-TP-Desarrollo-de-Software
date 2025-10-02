import { PedidoModel } from '../schemas/mongooseSchemas/pedidoSchema.js';
import Repository from './repository.js';
import mongoose from 'mongoose';

export default class PedidoRepository extends Repository {
  constructor() {
    super(PedidoModel)
  }

  async findByUserId(usuarioId) {
    const objectId = new mongoose.Types.ObjectId(usuarioId);
    return await this.model.find({ comprador: objectId });
  }
}
