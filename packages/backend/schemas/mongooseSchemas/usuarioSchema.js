import mongoose from 'mongoose';
import Usuario from '../../models/usuario.js';
import { TipoUsuario } from '../../models/tipoUsuario.js';

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
    },
    tipo: {
      type: String,
      enum: Object.values(TipoUsuario),
      required: true,
    },
    fechaAlta: {
      type: Date,
      require: false,
    },
  },
  {
    timestamps: true,
    collection: 'usuarios',
  }
);

UsuarioSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);
