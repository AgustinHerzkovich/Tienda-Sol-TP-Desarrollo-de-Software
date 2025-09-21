import Crypto from 'crypto';
export default class PedidoRepository {
  constructor() {
    this.pedidos = [];
  }

  // Usen solo el metodo "save"

  async guardar(pedido) {
    if (pedido.id === undefined) {
      pedido.id = Crypto.randomUUID();
      this.pedidos.push(pedido);
    }
    return pedido;
  }

  async save(pedido) {
    //Base de batos, guardame el pedido!
    return this.guardar(pedido);
  }

  async findById(idBuscado) {
    return this.pedidos.find((pedido) => pedido.id == idBuscado);
  }

  findByUsuarioId(usuarioId) {
    return this.pedidos.filter((pedido) => pedido.comprador.id === usuarioId);
  }
}
