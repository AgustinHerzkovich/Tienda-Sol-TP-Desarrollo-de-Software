export default class Notificacion {
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
    this.leida = true;
    this.fechaLeida = Date.now();
  }
}
