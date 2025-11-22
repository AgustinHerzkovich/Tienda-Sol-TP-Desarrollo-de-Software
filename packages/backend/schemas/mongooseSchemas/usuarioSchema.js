import mongoose from 'mongoose';
import Usuario from '../../models/usuario.js';
import { TipoUsuario } from '../../models/tipoUsuario.js';
import bcrypt from 'bcrypt';
import { DireccionEntregaSchema} from './direccionEntregaSchema.js';

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
    password: {
      type: String,
      required: true,
      minLength: 8,
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
      require: true,
    },
    direcciones: [DireccionEntregaSchema],
  },
  {
    timestamps: true,
    collection: 'usuarios',
  }
);

UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Genera un salt aleatorio
    this.password = await bcrypt.hash(this.password, salt); // Hashea la contraseña con el salt
    next();
  } catch (error) {
    next(error);
  }
});

UsuarioSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);
