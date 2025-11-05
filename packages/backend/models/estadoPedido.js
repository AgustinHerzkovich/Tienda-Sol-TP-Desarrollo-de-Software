import { Moneda } from "./moneda.js";

function monedaString(moneda){
  if(moneda == Moneda.DOLAR_USA){
    return "US$"
  }else if(moneda == Moneda.REAL){
    return "R$"
  }else if(moneda == Moneda.PESO_ARG){
    return "AR$"
  }else{
    return "$"
  }
}

export const EstadoPedido = Object.freeze({
  // ENUM en javascript
  PENDIENTE: {
    valor: 'PENDIENTE',
    mensaje: 'Se ha realizado un pedido! ',
    notificacion: (pedido) => ({
      destinatario: pedido.getVendedor(),
      mensaje: `- Pedido Id: ${pedido.id}
      - Comprador: ${pedido.comprador}
      - Productos: ${pedido.getProductos().map((producto) => " " + producto.titulo)}
      - Total: ${monedaString(pedido.moneda)} ${pedido.total}
      - Direccion de entrega: País: ${pedido.direccionEntrega.pais}, Provincia: ${pedido.direccionEntrega.provincia}, Ciudad: ${pedido.direccionEntrega.ciudad}, Calle: ${pedido.direccionEntrega.calle}, Altura : ${pedido.direccionEntrega.altura}`,
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
