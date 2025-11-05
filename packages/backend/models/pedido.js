import CambioEstadoPedido from './cambioEstadoPedido.js';
import _ from 'lodash';
import { EstadoPedido } from './estadoPedido.js';
import TasaDeCambioHelper from './tasaDeCambioHelper.js'
export default class Pedido {
  id;
  comprador;
  items;
  total;
  moneda;
  direccionEntrega;
  estado;
  fechaCreacion;
  historialEstados;

  constructor(comprador, items, moneda, direccionEntrega) {
    this.comprador = comprador;
    this.items = items; // Asumimos que no va a tener dos itemsPedido para un mismo producto, en ese caso es uno solo con las cantidades sumadas
    this.moneda = moneda;
    this.total = this.calcularTotal(); // El total no se pasa en el constructor
    this.direccionEntrega = direccionEntrega;
    this.estado = EstadoPedido.PENDIENTE;
    this.fechaCreacion = Date.now();
    this.historialEstados = [];
  }

  calcularTotal() {
    return _.sumBy(this.items, (item) => TasaDeCambioHelper.convertir(item.subtotal(), item.producto.moneda, this.moneda));
  }

  actualizarEstado(nuevoEstado, quien, motivo) {
    const cambioEstado = new CambioEstadoPedido(
      this.estado,
      this,
      quien,
      motivo
    );
    this.historialEstados.push(cambioEstado); // Solo guardamos el estado previo, y el nuevo no lo guardamos hasta que se vuelve a cambiar de estado
    this.estado = nuevoEstado;
  }

  //bool
  validarStock() {
    return this.items.every((itemPedido) => itemPedido.tieneStock());
  }

  //item List
  itemsSinStock() {
    return this.items.filter((item) => !item.tieneStock());
  }

  getVendedor() {
    return _.first(this.items).producto.vendedor; // Asumimos que todos los items de un pedido son del mismo vendedor
  }

  getProductos() {
    return this.items.map((itemPedido) => itemPedido.producto);
  }
}
