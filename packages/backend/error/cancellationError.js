import AppError from './appError.js';

export default class cancellationError extends AppError {
  constructor(pedidoId, estadoActual) {
    super(
      `Pedido con id ${pedidoId} no puede ser cancelado debido a que su estado es ${estadoActual}`,
      500
    );
  }
}
