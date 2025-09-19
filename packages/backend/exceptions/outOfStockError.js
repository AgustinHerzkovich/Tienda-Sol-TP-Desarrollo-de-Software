export default class OutOfStockError extends Error {
  constructor(cantidad) {
    super(
      `No hay stock suficiente para el pedido, cantidad necesaria: ${cantidad}`
    );
    this.name = 'OutOfStockError';
    this.cantidad = cantidad;
    this.statusCode = 404;
  }
}
