export default class ItemPedido {
  producto;
  cantidad;
  precioUnitario;

  constructor(producto, cantidad, precioUnitario = producto.precio) {
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
