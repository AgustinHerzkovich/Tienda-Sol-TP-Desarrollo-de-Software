export default class cancellationError extends Error {
  constructor(pedidoId, estadoActual) {
    super(
      `Pedido con id ${pedidoId} no puede ser cancelado debido a que su estado es ${estadoActual}`
    );
    this.name = 'CancellationError';
    this.pedidoId = pedidoId;
    this.estadoActual = estadoActual;
    this.statusCode = 400;
  }
}
