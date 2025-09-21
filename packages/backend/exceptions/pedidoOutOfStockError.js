export default class PedidoOutOfStockError extends Error {
  constructor(idPedido, cantidad) {
    super(
      `No hay stock suficiente para crear el Pedido con id ${idPedido}, cantidad necesaria: ${cantidad}`
    );
    this.name = 'PedidoOutOfStockError';
    this.idPedido = idPedido;
    this.cantidad = cantidad;
    this.statusCode = 400;
  }
}
