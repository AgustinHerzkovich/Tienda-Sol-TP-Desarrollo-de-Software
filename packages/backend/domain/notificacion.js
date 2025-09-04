import { Usuario } from './usuario.js';

export class Notificacion {
  constructor(
    id = crypto.randomUUID,
    usuarioDestino,
    mensaje,
    fechaAlta = Date.now(),
    leida = false,
    fechaLeida = null
  ) {
    if (
      typeof id !== 'string' ||
      !(usuarioDestino instanceof Usuario) ||
      typeof mensaje !== 'string'
    ) {
      throw new Error(`Se intentó instanciar Notificacion con tipos erróneos`);
    }
    this.id = id;
    this.usuarioDestino = usuarioDestino;
    this.mensaje = mensaje;
    this.fechaAlta = fechaAlta;
    this.leida = leida;
    this.fechaLeida = fechaLeida;
    console.log('Notificacion creada (id:' + this.id + ')');
  }

  marcarComoLeida() {
    this.leida = true;
    this.fechaLeida = Date.now();
    console.log(
      'Notificacion (id: ' +
        this.id +
        ') leida (fechaLeida: ' +
        this.fechaLeida +
        ')'
    );
  }
}
