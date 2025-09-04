import { Usuario } from './usuario.js';
import { ItemPedido } from './itemPedido.js';
import { Moneda } from './moneda.js';
import { DireccionEntrega } from './direccionEntrega.js';
import { EstadoPedido } from './estadoPedido.js';
import { CambioEstadoPedido } from './cambioEstadoPedido.js';
import { FactoryNotificacion } from './FactoryNotificacio.js';

export class Pedido {
  constructor(
    id,
    comprador,
    items,
    moneda,
    direccionEntrega,
    estado,
    fechaCreacion,
    historialEstados // Solo guardamos el estado previo, y el nuevo no lo guardamos hasta que se vuelve a cambiar de estado
  ) {
    this.id = id;
    this.comprador = comprador;
    this.items = items; // Asumimos que no va a tener dos itemsPedido para un mismo producto, en ese caso es uno solo con las cantidades sumadas
    this.descontarStocks();
    this.total = this.calcularTotal(); // El total no se pasa en el constructor
    this.moneda = moneda;
    this.direccionEntrega = direccionEntrega;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
  }

  calcularTotal() {
    return this.items.reduce((contador, item) => contador + item.subtotal(), 0);
  }

  actualizarEstado(nuevoEstado, quien, motivo) {
    cambioEstado = new CambioEstadoPedido(this.estado, this, quien, motivo);
    this.historialEstados.push(cambioEstado);
    this.estado = nuevoEstado;
  }

  //bool
  validarStock() {
    // mutex.lock();
    let hayStock = this.items.every((itemPedido) => itemPedido.tieneStock());
    // mutex.unlock();
    return hayStock;
  }

  //void
  descontarStocks() {
    if (!this.validarStock) {
      throw new Error('No hay stock suficiente para realizar el pedido');
    } else {
      this.items.forEach((itemPedido) => {
        itemPedido.producto.descontarStock(itemPedido.cantidad);
      });
    }
  }
}
