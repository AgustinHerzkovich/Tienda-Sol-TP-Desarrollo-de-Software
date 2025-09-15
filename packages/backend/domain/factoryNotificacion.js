import Notificacion from './notificacion.js';

export default class FactoryNotificacion {
  crearSegunEstadoPedido(estado) {
    return estado.mensaje();
  }

  crearSegunPedido(pedido) {
    return new Notificacion(
      pedido.comprador,
      this.crearSegunEstadoPedido(pedido.estado)
    );
  }
}
