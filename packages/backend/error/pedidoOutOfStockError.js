import AppError from './appError.js';

export default class PedidoOutOfStockError extends AppError {
  constructor(itemsSinStock) {
    const itemsAsString = itemsSinStock
      .map((item) => item.producto.id + ' - ' + item.producto.titulo + ' - ' + item.cantidad)
      .join(' | ');

    super(
      `No hay stock suficiente para crear el Pedido. Items sin stock: ${itemsAsString}`,
      400
    );
  }
}
