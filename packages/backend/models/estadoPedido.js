export const EstadoPedido = Object.freeze({
  // ENUM en javascript
  PENDIENTE: {
    valor: 'PENDIENTE',
    mensaje: 'Se ha realizado un pedido! ',
    notificacion: (pedido) => ({
      destinatario: pedido.getVendedor(),
      mensaje: `Pedido Id: ${pedido.id} - Comprador: ${pedido.comprador} - Productos: ${pedido.getProductos()} - Total: ${pedido.total} - Direccion de entrega: ${pedido.direccionEntrega}`,
    }),
  },
  CONFIRMADO: {
    valor: 'CONFIRMADO',
    mensaje: 'Confirmamos tu pedido!! ',
    notificacion: (pedido) => ({
      destinatario: pedido.comprador,
      mensaje: `Pedido Id: ${pedido.id}`,
    }),
  },
  EN_PREPARACION: {
    valor: 'EN_PREPARACION',
    mensaje: 'Estamos preparando tu pedido! ',
    notificacion: (pedido) => ({
      destinatario: pedido.comprador,
      mensaje: `Pedido Id: ${pedido.id}`,
    }),
  },
  ENVIADO: {
    valor: 'ENVIADO',
    mensaje: 'Enviamos tu pedido! ',
    notificacion: (pedido) => ({
      destinatario: pedido.comprador,
      mensaje: `Pedido Id: ${pedido.id}`,
    }),
  },
  ENTREGADO: {
    valor: 'ENTREGADO',
    mensaje: 'Entregamos tu pedido! ',
    notificacion: (pedido) => ({
      destinatario: pedido.comprador,
      mensaje: `Pedido Id: ${pedido.id}`,
    }),
  },
  CANCELADO: {
    valor: 'CANCELADO',
    mensaje: 'Un comprador canceló un pedido! ',
    notificacion: (pedido) => ({
      destinatario: pedido.getVendedor(),
      mensaje: `Pedido Id: ${pedido.id}`,
    }),
  },
});
