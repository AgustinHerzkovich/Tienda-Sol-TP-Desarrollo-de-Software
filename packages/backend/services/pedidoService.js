import Pedido from '../models/pedido.js';
import Item from '../models/itemPedido.js';
import OutOfStockError from '../exceptions/outOfStockError.js';
import CancellationError from '../exceptions/cancellationError.js';
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
    // Generar los items
    const itemsCreados = await Promise.all(pedidoJSON.items.map((item) =>
      this.getItem(item.productoId, item.cantidad))
    );

    // Traer el comprador
    const comprador = await this.getComprador(pedidoJSON.compradorId);

    // Construir el pedido con items reales
    const pedido = new Pedido(
      comprador,
      itemsCreados,
      pedidoJSON.moneda,
      pedidoJSON.direccionEntrega
    );

    // Validar stock
    if (!pedido.validarStock()) {
      const cantidad = _.sumBy(pedido.items, (item) => item.cantidad);
      throw new OutOfStockError(cantidad);
    }

    // Actualizar stock de cada producto
    await Promise.all(
      itemsCreados.map((itemPedido) =>
        this.productoService.modificarStock(
          itemPedido.producto,
          -1 * itemPedido.cantidad
        )
      )
    );

    // Notificar
    await this.notificacionService.notificarPedido(pedido);

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

    await this.notificacionService.notificarPedido(pedidoAlmacenado);

    return await this.pedidoRepository.save(pedidoAlmacenado);
  }

  async pedidosByUser(usuarioId) {
    const pedidos = await this.pedidoRepository.findByUsuarioId(usuarioId);
    return pedidos;
  }

  async getItem(id, cantidad) {
    const producto = await this.productoService.findById(id)
    return new Item(producto, cantidad);
  }

  async getComprador(id) {
    return await this.usuarioService.findById(id);
  }
}
