import mongoose from 'mongoose';
import Pedido from '../../models/pedido.js';
import { Moneda } from '../../models/moneda.js';
import { EstadoPedido } from '../../models/estadoPedido.js';

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

const PedidoSchema = new mongoose.Schema({
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
  direccionEntrega: {
    calle: {
      type: String,
      required: true,
    },
    altura: {
      type: String,
      required: true,
    },
    piso: {
      type: String,
      required: true,
    },
    departamento: {
      type: String,
      required: true,
    },
    codigoPostal: {
      type: String,
      required: true,
    },
    ciudad: {
      type: String,
      required: true,
    },
    provincia: {
      type: String,
      required: true,
    },
    pais: {
      type: String,
      required: true,
    },
    lat: {
      type: String,
      required: true,
    },
    lon: {
      type: String,
      required: true,
    },
  },
  estado: {
    valor : {
          type : String,
          required : true
        }
  },
  fechaCreacion: {
    type: Number,
    required: false,
  },
  historialEstados: [
    {
      fecha: {
        type: Date,
        required: false,
      },
      estado: {
        valor : {
          type : String,
          required : true
        }
        /*
        type: String,
        enum: Object.values(EstadoPedido).map((e) => e.valor),
        required: false,*/
      },
      pedido: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pedido',
        required: false,
      },
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false,
      },
      motivo: {
        type: String,
        required: false,
      },
    },
  ],
});


PedidoSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items.producto',
    model: 'Producto',
  });
  next();
});

PedidoSchema.loadClass(Pedido);

export const PedidoModel = mongoose.model('Pedido', PedidoSchema);
