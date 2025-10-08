import AppError from './appError.js';

export default class PedidoOutOfStockError extends AppError {
  constructor(itemsSinStock) {
    const itemsAsString = itemsSinStock
      .map((item) => 'id: ' + item.producto.id + ' - nombre: ' + item.producto.titulo + ' - solicitado: ' + item.cantidad + ' - disponible: ' + item.producto.stock)
      .join(' || ');

    super(
      `No hay stock suficiente para crear el Pedido. Items sin stock: ${itemsAsString}`,
      400
    );
  }
}
