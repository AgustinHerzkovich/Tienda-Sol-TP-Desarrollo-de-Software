import { TipoUsuario } from './tipoUsuario.js';

export class Usuario {
  constructor(id, nombre, mail, telefono, tipo, fechaAlta) {
    this.id = id;
    this.nombre = nombre;
    this.mail = mail;
    this.telefono = telefono;
    this.tipo = tipo;
    this.fechaAlta = fechaAlta;
  }
}
