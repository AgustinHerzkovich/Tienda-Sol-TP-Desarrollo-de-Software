import AppError from './appError.js';

export default class ProductoOutOfStockError extends AppError {
  constructor(idProducto, cantidad) {
    super(
      `No hay stock suficiente del Producto con id ${idProducto}, cantidad necesaria: ${cantidad}`,
      500
    );
  }
}
