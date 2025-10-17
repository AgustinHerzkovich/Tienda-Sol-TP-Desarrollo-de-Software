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

    const pedidos = await this.model.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'productos',
          localField: 'items.producto',
          foreignField: '_id',
          as: 'producto',
        },
      },
      { $unwind: '$producto' },
      { $match: { 'producto.vendedor': objectId } },
      {
        $group: {
          _id: '$_id',
          pedido: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$pedido' } },
    ]);

    return await PedidoModel.populate(pedidos, {
      path: 'items.producto',
      populate: { path: 'vendedor', select: 'nombre email' },
    });
  }
}
