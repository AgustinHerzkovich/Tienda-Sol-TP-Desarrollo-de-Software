export default class Usuario {
  id;
  nombre;
  email;
  telefono;
  tipo;
  fechaAlta;
  password;
  direcciones;

  constructor(nombre, email, telefono, tipo) {
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.tipo = tipo;
    this.fechaAlta = Date.now();
    this.direcciones = [];
  }

  agregarDireccion(direccionEntrega){
    this.direcciones.push(direccionEntrega)
  }
}
