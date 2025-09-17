import Notificacion from './notificacion.js';

export default class FactoryNotificacion {
  crearSegunEstadoPedido(estado) {
    return estado.mensaje;
  }

  crearSegunPedido(pedido) {
    return new Notificacion(
      pedido.estado.notificacion(pedido).destinatario,
      this.crearSegunEstadoPedido(pedido.estado) +
        pedido.estado.notificacion(pedido).mensaje
    );
  }
}
