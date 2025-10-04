import AppError from './appError.js';

export default class PedidoOutOfStockError extends AppError {
  constructor(idPedido, cantidad) {
    super(
      `No hay stock suficiente para crear el Pedido con id ${idPedido}, cantidad necesaria: ${cantidad}`,
      400
    );
  }
}
