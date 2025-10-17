import { PedidoModel } from '../schemas/mongooseSchemas/pedidoSchema.js';
import Repository from './repository.js';
import mongoose from 'mongoose';

export default class PedidoRepository extends Repository {
  constructor() {
    super(PedidoModel);
  }

  async findByCompradorId(usuarioId) {
    const objectId = new mongoose.Types.ObjectId(usuarioId);
    return await this.model.find({ comprador: objectId });
  }

  async findByVendedorId(usuarioId) {
    const objectId = new mongoose.Types.ObjectId(usuarioId);
    return await this.model.find({ 'items.vendedor': objectId });
  }
}
