import { Moneda } from './moneda.js';

function monedaString(moneda) {
  if (moneda == Moneda.DOLAR_USA) {
    return 'US$';
  } else if (moneda == Moneda.REAL) {
    return 'R$';
  } else if (moneda == Moneda.PESO_ARG) {
    return 'AR$';
  } else {
    return '$';
  }
}

export const EstadoPedido = Object.freeze({
  // ENUM en javascript
  PENDIENTE: {
    valor: 'PENDIENTE',
    mensaje: 'Se ha realizado un pedido! \n',
    notificacion: (pedido) => ({
      destinatario: pedido.getVendedor(),
      mensaje: `- Comprador: ${pedido.comprador.nombre}
      - Productos: ${pedido.items.map((item) => ' ' + item.producto.titulo + ' x' + item.cantidad)}
      - Total: ${monedaString(pedido.moneda)} ${pedido.total}
      - Direccion de entrega: ${pedido.direccionEntrega.pais}, ${pedido.direccionEntrega.provincia}, ${pedido.direccionEntrega.ciudad}, Calle: ${pedido.direccionEntrega.calle}, ${pedido.direccionEntrega.altura}`,
    }),
  },
  CONFIRMADO: {
    valor: 'CONFIRMADO',
    mensaje: 'Confirmamos tu pedido!! ',
    notificacion: (pedido) => ({
      destinatario: pedido.comprador.id,
      mensaje: `Productos confirmados:
      ${pedido.items.map((item) => `- ${item.producto.titulo} x${item.cantidad}`).join('\n')}
      Total: ${monedaString(pedido.moneda)} ${pedido.total}`,
    }),
  },
  EN_PREPARACION: {
    valor: 'EN_PREPARACION',
    mensaje: 'Estamos preparando tu pedido! ',
    notificacion: (pedido) => ({
      destinatario: pedido.comprador.id,
      mensaje: `Productos en preparación:
      ${pedido.items.map((item) => `- ${item.producto.titulo} x${item.cantidad}`).join('\n')}`,
    }),
  },
  ENVIADO: {
    valor: 'ENVIADO',
    mensaje: 'Enviamos tu pedido! ',
    notificacion: (pedido) => ({
      destinatario: pedido.comprador.id,
      mensaje: `Productos enviados:
      ${pedido.items.map((item) => `- ${item.producto.titulo} x${item.cantidad}`).join('\n')}
      Dirección de entrega: ${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.altura}, ${pedido.direccionEntrega.ciudad}`,
    }),
  },
  ENTREGADO: {
    valor: 'ENTREGADO',
    mensaje: 'Entregamos tu pedido! ',
    notificacion: (pedido) => ({
      destinatario: pedido.comprador.id,
      mensaje: `Productos entregados:
      ${pedido.items.map((item) => `- ${item.producto.titulo} x${item.cantidad}`).join('\n')}
      ¡Gracias por tu compra!`,
    }),
  },
  CANCELADO: {
    valor: 'CANCELADO',
    mensaje: 'Un comprador canceló un pedido! ',
    notificacion: (pedido) => ({
      destinatario: pedido.getVendedor(),
      mensaje: `Pedido cancelado:
      ${pedido.items.map((item) => `- ${item.producto.titulo} x${item.cantidad}`).join('\n')}
      Comprador: ${pedido.comprador.nombre}`,
    }),
  },
});
