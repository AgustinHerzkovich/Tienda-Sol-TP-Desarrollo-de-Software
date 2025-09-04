import { EstadoPedido } from './estadoPedido.js';
import { Notificacion } from './notificacion.js';
import { Pedido } from './pedido.js';

export class FactoryNotificacion {
  //tiene que devolver un string
  crearSegunEstadoPedido(estado) {
    if (estado == PENDIENTE) return 'Tu pedido esta pendiente!!';
    else if (estado == CONFIRMADO) return 'Confirmamos tu pedido!!';
    else if (estado == EN_PREPARACION) return 'Estamos preparando tu pedido!';
    else if (estado == ENVIADO) return 'Enviamos tu pedido!';
    else if (estado == ENTREGADO) return 'Entregamos tu pedido!';
    else if (estado == CANCELADO) return 'Tu pedido fue cancelado!';
    else return 'Tu pedido se bugeo.';
  }

  //tiene que devolver una notificacion
  crearSegunPedido(pedido) {
    if (!(pedido instanceof Pedido))
      throw new Error(
        'Se intento crear un pedido con algo que no es un pedido (' +
          typeof pedido +
          ')'
      );
    return new Notificacion(
      pedido.comprador,
      this.crearSegunEstadoPedido(pedido.estado)
    );
  }
}
