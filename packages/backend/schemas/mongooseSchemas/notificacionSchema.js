import mongoose from 'mongoose';
import Notificacion from '../../models/notificacion';

const NotificacionSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    mensaje: {
      type: String,
      required: true,
      trim: true,
    },
    fechaAlta: {
      type: Date,
      required: false,
    },
    leida: {
      type: Boolean,
      required: false,
    },
    fechaLeida: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'notificaciones',
  }
);

NotificacionSchema.loadClass(Notificacion);

export default mongoose.model('Notificacion', NotificacionSchema);
