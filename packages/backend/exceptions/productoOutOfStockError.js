export default class ProductoOutOfStockError extends Error {
  constructor(idProducto, cantidad) {
    super(
      `No hay stock suficiente del Producto con id ${idProducto}, cantidad necesaria: ${cantidad}`
    );
    this.name = 'ProductoOutOfStockError';
    this.idProducto = idProducto;
    this.cantidad = cantidad;
    this.statusCode = 400;
  }
}
