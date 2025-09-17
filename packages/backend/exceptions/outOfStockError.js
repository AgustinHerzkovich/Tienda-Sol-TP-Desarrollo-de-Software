export default class OutOfStockError extends Error {
  constructor(id, cantidad) {
    super(
      `No hay stock suficiente para el pedido ${id}, cantidad necesaria: ${cantidad}`
    );
    this.name = 'OutOfStockError';
    this.pedidoId = id;
    this.cantidad = cantidad;
    this.statusCode = 404;
  }
}
