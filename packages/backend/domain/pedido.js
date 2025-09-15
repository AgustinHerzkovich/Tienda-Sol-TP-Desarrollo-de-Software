import CambioEstadoPedido from './cambioEstadoPedido.js';
import _ from 'lodash';

export default class Pedido {
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
    this.#descontarStocks();
    this.total = this.calcularTotal(); // El total no se pasa en el constructor
    this.moneda = moneda;
    this.direccionEntrega = direccionEntrega;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
  }

  calcularTotal() {
    return _.sumBy(this.items, (item) => item.subtotal());
  }

  actualizarEstado(nuevoEstado, quien, motivo) {
    const cambioEstado = new CambioEstadoPedido(
      this.estado,
      this,
      quien,
      motivo
    );
    this.historialEstados.push(cambioEstado);
    this.estado = nuevoEstado;
  }

  //bool
  validarStock() {
    return this.items.every((itemPedido) => itemPedido.tieneStock());
  }

  //void
  #descontarStocks() {
    // Podría no tener sentido si un service invoca a validarStock y hace la reducción
    // de stock por cada producto
    if (!this.validarStock()) {
      throw new Error('No hay stock suficiente para realizar el pedido');
    } else {
      this.items.forEach((itemPedido) => {
        itemPedido.producto.reducirStock(itemPedido.cantidad);
      });
    }
  }
}
