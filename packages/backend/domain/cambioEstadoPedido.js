import { EstadoPedido } from './estadoPedido.js';
import { Pedido } from './pedido.js';
import { Usuario } from './usuario.js';

export class CambioEstadoPedido {
  constructor(estado, pedido, usuario, motivo, fecha = Date.now()) {
    this.fecha = fecha;
    this.estado = estado;
    this.pedido = pedido;
    this.usuario = usuario;
    this.motivo = motivo;
  }
}
