import { PedidoModel } from '../schemas/mongooseSchemas/pedidoSchema.js';

export default class PedidoRepository {
  constructor() {
    this.model = PedidoModel;
  }

  async create(pedido) {
    const pedidoGuardado = new this.model(pedido);
    return await pedidoGuardado.save();
  }

  async update(id, pedido) {
    return await this.model.findByIdAndUpdate(id, pedido, { new: true });
  }

  async findById(idBuscado) {
    return await this.model.findById(idBuscado);
  }

  async findByUserId(usuarioId) {
    return await this.model.find({ comprador: usuarioId });
  }
}
