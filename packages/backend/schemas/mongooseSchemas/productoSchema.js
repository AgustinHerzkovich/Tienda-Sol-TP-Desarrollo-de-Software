import mongoose from 'mongoose';
import Producto from '../../models/producto.js';
import { Moneda } from '../../models/moneda.js';

const productoSchema = new mongoose.Schema(
  {
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    categorias: [
      {
        nombre: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    precio: {
      type: Number,
      required: true,
      min: 0,
    },
    moneda: {
      type: String,
      enum: Object.values(Moneda),
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    fotos: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    activo: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'productos',
  }
);

productoSchema.loadClass(Producto);

export const ProductoModel = mongoose.model('Producto', productoSchema);
