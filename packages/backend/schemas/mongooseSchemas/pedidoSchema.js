import mongoose from 'mongoose';
import Pedido from '../../models/pedido.js';
import { Moneda } from '../../models/moneda.js';
import { EstadoPedido } from '../../models/estadoPedido.js';
import { DireccionEntregaSchema } from './direccionEntregaSchema.js';

/*
    this.comprador = ref a comprador;
    this.items = {ref a producto, cantidad Number}; 
    this.total = Number
    this.moneda = String enum;
    this.direccionEntrega = {DireccionEntrega embebida};
    this.estado = String enum;
    this.fechaCreacion = Date);
    this.historialEstados = [{fecha Date, estado String enum, ref a pedido, ref a usuario, motivo String}];
*/

const PedidoSchema = new mongoose.Schema(
  {
    comprador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    items: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Producto',
          required: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: 0,
        },
        precioUnitario: {
          type: Number,
          required: true,
          min: 0,
        },
        _id: false,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    moneda: {
      type: String,
      enum: Object.values(Moneda),
      required: true,
    },
    direccionEntrega: DireccionEntregaSchema,
    estado: {
      type: String,
      enum: Object.values(EstadoPedido).map((e) => e.valor),
    },
    fechaCreacion: {
      type: Number,
      required: true,
    },
    historialEstados: [
      {
        fecha: {
          type: Date,
          required: true,
        },
        estadoPrevio: {
          type: String,
          enum: Object.values(EstadoPedido).map((e) => e.valor),
          required: true,
        },
        nuevoEstado: {
          type: String,
          enum: Object.values(EstadoPedido).map((e) => e.valor),
          required: true,
        },
        pedido: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pedido',
          required: true,
        },
        usuario: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Usuario',
          required: false, // Opcional porque puede ser un cambio automático del sistema
        },
        motivo: {
          type: String,
          required: true,
        },
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'pedidos',
  }
);

PedidoSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items.producto',
    model: 'Producto',
  });
  next();
});

PedidoSchema.loadClass(Pedido);

export const PedidoModel = mongoose.model('Pedido', PedidoSchema);
