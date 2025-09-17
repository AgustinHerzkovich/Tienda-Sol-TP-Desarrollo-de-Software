import Pedido from '../models/pedido.js';
import Item from '../models/itemPedido.js';
import OutOfStockError from '../exceptions/outOfStockError.js';
import CancellationError from '../exceptions/cancellationError.js';
import Usuario from '../models/usuario.js';
import {EstadoPedido} from '../models/estadoPedido.js';
import _ from 'lodash';

export default class PedidoService {
  constructor(
    pedidoRepository,
    productoService,
    usuarioService,
    notificacionService
  ) {
    this.pedidoRepository = pedidoRepository;
    this.productoService = productoService;
    this.usuarioService = usuarioService;
    this.notificacionService = notificacionService;
  }

  async crear(pedidoJSON) {
    const itemsCreados = pedidoJSON.items.forEach((item) =>
      this.getItem(item.id, item.cantidad)
    );
    const comprador = this.getComprador(pedidoJSON.comprador.id);
    const pedido = new Pedido(
      comprador,
      itemsCreados,
      pedidoJSON.moneda,
      pedidoJSON.direccionEntrega
    );
    if (!this.validarStock(pedido)) {
      const cantidad = _.sumBy(pedido.items, (item) => item.cantidad);
      throw new OutOfStockError(pedido.id, cantidad);
    }

    itemsCreados.forEach((itemPedido) => async () => {
      await this.productoService.modificarStock(
        itemPedido.producto,
        -1 * itemPedido.cantidad
      );
    });

    await this.notificacionService.notificarEstadoPedido(pedido);

    return await this.pedidoRepository.save(pedido);
  }

  async modificar(id, pedidoModificadoJSON) {
    let pedidoAlmacenado = await this.pedidoRepository.findById(id);
    const items = pedidoAlmacenado.items;
    const estadoActual = pedidoAlmacenado.estado;
    const estadosIncancelables = [EstadoPedido.ENVIADO, EstadoPedido.ENTREGADO];
    const nuevoEstado = pedidoModificadoJSON.estado;
    if (nuevoEstado === EstadoPedido.CANCELADO) {
      if (estadosIncancelables.includes(estadoActual)) {
        // No se puede cancelar un pedido si ya fue enviado o entregado
        throw new CancellationError(pedidoAlmacenado.id, estadoActual);
      }
      items.forEach((itemPedido) => async () => {
        await this.productoService.modificarStock(
          itemPedido.producto,
          itemPedido.cantidad
        );
      });
      if (nuevoEstado === EstadoPedido.ENTREGADO) {
        items.forEach((itemPedido) => async () => {
          await this.productoService.aumentarVentas(
            itemPedido.producto,
            itemPedido.cantidad
          );
        });
      }
    }
    pedidoAlmacenado.estado = pedidoModificadoJSON.estado;

    await this.notificacionService.notificarEstadoPedido(pedidoAlmacenado);

    return await this.pedidoRepository.save(pedidoAlmacenado);
  }

  async pedidosByUser(usuarioId) {
    const pedidos = await this.pedidoRepository.findByUsuarioId(usuarioId);
    return pedidos;
  }

  async getItem(id, cantidad) {
    return new Item(await this.productoService.findById(id), cantidad);
  }
  async getComprador(id) {
    return new Usuario(await this.usuarioService.findById(id));
  }
}
