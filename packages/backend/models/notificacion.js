import NotificacionAlreadyReadError from '../exceptions/notificacionAlreadyReadError.js';

export default class Notificacion {
  id;
  usuarioDestino;
  mensaje;
  fechaAlta;
  leida;
  fechaLeida;

  constructor(
    usuarioDestino,
    mensaje,
    fechaAlta = Date.now(),
    leida = false,
    fechaLeida = null
  ) {
    this.usuarioDestino = usuarioDestino;
    this.mensaje = mensaje;
    this.fechaAlta = fechaAlta;
    this.leida = leida;
    this.fechaLeida = fechaLeida;
  }

  marcarComoLeida() {
    if (this.leida) {
      throw new NotificacionAlreadyReadError(this.id);
    }
    this.leida = true;
    this.fechaLeida = Date.now();
  }
}
