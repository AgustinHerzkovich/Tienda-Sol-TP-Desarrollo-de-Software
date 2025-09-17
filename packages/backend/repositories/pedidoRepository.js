export default class PedidoRepository {
  constructor() {
    this.pedidos = [];
  }

  // Usen solo el metodo "save"

  async guardar(pedido) {
    pedido.id = crypto.randomUUID();
    this.pedidos.push(pedido);
    return pedido;
  }

  async save(pedido) {
    //Base de batos, guardame el pedido!
    return this.guardar(pedido);
  }

  async findById(idBuscado) {
    this.pedidos.find((pedido) => pedido.id == idBuscado);
  }

  findByUsuarioId(usuarioId) {
    return this.pedidos.find((pedido) => pedido.usuario.id === usuarioId);
  }
}
