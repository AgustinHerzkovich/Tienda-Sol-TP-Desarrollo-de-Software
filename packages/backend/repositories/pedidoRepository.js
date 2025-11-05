import { PedidoModel } from '../schemas/mongooseSchemas/pedidoSchema.js';
import Repository from './repository.js';
import mongoose from 'mongoose';

export default class PedidoRepository extends Repository {
  constructor() {
    super(PedidoModel);
  }

  async findById(id) {
    return await this.model.findById(id).populate('items.producto');
  }

  async findByCompradorId(usuarioId) {
    const objectId = new mongoose.Types.ObjectId(usuarioId);
    return await this.model.find({ comprador: objectId });
  }

  async findByVendedorId(usuarioId) {
    const objectId = new mongoose.Types.ObjectId(usuarioId);

    const pedidos = await this.model.aggregate([
  {
    $lookup: {
      from: 'productos',
      localField: 'items.producto',
      foreignField: '_id',
      as: 'productosInfo',
    },
  },
  {
    $addFields: {
      items: {
        $map: {
          input: '$items',
          as: 'item',
          in: {
            $mergeObjects: [
              '$$item',
              {
                producto: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$productosInfo',
                        as: 'p',
                        cond: { $eq: ['$$p._id', '$$item.producto'] },
                      },
                    },
                    0,
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
  { $match: { 'items.producto.vendedor': objectId } },
]);


    return await PedidoModel.populate(pedidos, {
      path: 'items.producto',
      populate: { path: 'vendedor', select: 'nombre email' },
    });
  }
}
