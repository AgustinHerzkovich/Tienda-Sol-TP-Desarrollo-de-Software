export default class Usuario {
  id;
  nombre;
  email;
  telefono;
  tipo;
  fechaAlta;

  constructor(nombre, mail, telefono, tipo) {
    this.nombre = nombre;
    this.mail = mail;
    this.telefono = telefono;
    this.tipo = tipo;
    this.fechaAlta = Date.now();
  }
}
