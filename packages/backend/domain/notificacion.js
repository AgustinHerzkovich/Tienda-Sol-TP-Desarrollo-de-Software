export default class Notificacion {
  constructor(
    id = crypto.randomUUID, // Mongo lo hace automáticamente
    usuarioDestino,
    mensaje,
    fechaAlta = Date.now(),
    leida = false,
    fechaLeida = null
  ) {
    this.id = id;
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
