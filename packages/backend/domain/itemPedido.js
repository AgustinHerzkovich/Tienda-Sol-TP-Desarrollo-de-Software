import { Producto } from './producto.js';

export class ItemPedido {
  constructor(producto, cantidad, precioUnitario) {
    this.producto = producto;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
  }

  subtotal() {
    return this.precioUnitario * this.cantidad;
  }

  tieneStock() {
    return this.producto.estaDisponible(this.cantidad);
  }
}
