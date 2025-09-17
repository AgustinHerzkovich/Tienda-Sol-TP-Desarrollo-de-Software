export default class CambioEstadoPedido {
  constructor(estado, pedido, usuario, motivo, fecha = Date.now()) {
    this.fecha = fecha;
    this.estado = estado;
    this.pedido = pedido;
    this.usuario = usuario;
    this.motivo = motivo;
  }
}
