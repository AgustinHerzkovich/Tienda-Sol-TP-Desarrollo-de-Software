export default class CambioEstadoPedido {
  fecha;
  estadoPrevio;
  nuevoEstado;
  pedido;
  usuario;
  motivo;

  constructor(estadoPrevio, nuevoEstado, pedido, usuario, motivo, fecha = Date.now()) {
    this.fecha = fecha;
    // Convertir estado a string si es un objeto con propiedad 'valor'
    this.estadoPrevio =
      typeof estadoPrevio === 'object' && estadoPrevio?.valor ? estadoPrevio.valor : estadoPrevio;
    this.nuevoEstado =
      typeof nuevoEstado === 'object' && nuevoEstado?.valor ? nuevoEstado.valor : nuevoEstado;
    this.pedido = pedido._id || pedido.id || pedido;
    this.usuario = usuario;
    this.motivo = motivo;
  }
}
