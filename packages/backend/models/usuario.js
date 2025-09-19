export default class Usuario {
  constructor(nombre, mail, telefono, tipo) {
    this.nombre = nombre;
    this.mail = mail;
    this.telefono = telefono;
    this.tipo = tipo;
    this.fechaAlta = Date.now();
  }
}
