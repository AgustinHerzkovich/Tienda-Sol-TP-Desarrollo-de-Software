export const EstadoPedido = Object.freeze({
  // ENUM en javascript
  PENDIENTE: { valor: 'PENDIENTE', mensaje: 'Tu pedido esta pendiente!!' },
  CONFIRMADO: { valor: 'CONFIRMADO', mensaje: 'Confirmamos tu pedido!!' },
  EN_PREPARACION: {
    valor: 'EN_PREPARACION',
    mensaje: 'Estamos preparando tu pedido!',
  },
  ENVIADO: { valor: 'ENVIADO', mensaje: 'Enviamos tu pedido!' },
  ENTREGADO: { valor: 'ENTREGADO', mensaje: 'Entregamos tu pedido!' },
  CANCELADO: { valor: 'CANCELADO', mensaje: 'Tu pedido fue cancelado!' },
});
