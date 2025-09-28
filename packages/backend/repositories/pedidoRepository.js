import { PedidoModel } from '../schemas/mongooseSchemas/pedidoSchema.js';
import Repository from './repository.js';

export default class PedidoRepository extends Repository {
  constructor() {
    super(PedidoModel)
  }

  async findByUserId(usuarioId) {
    return await this.model.find({ comprador: usuarioId });
  }
}
