import mongoose from 'mongoose';
import Notificacion from '../../models/notificacion.js';

const NotificacionSchema = new mongoose.Schema(
  {
    usuarioDestino: {
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
      required: true,
    },
    leida: {
      type: Boolean,
      required: true,
    },
    fechaLeida: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'notificaciones',
  }
);

NotificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model(
  'Notificacion',
  NotificacionSchema
);
