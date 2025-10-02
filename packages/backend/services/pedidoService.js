import Pedido from '../models/pedido.js';
import Item from '../models/itemPedido.js';
import PedidoOutOfStockError from '../error/PedidoOutOfStockError.js';
import CancellationError from '../error/cancellationError.js';
import { EstadoPedido } from '../models/estadoPedido.js';
import _ from 'lodash';
import NotFoundError from '../error/notFoundError.js';
import ItemPedido from '../models/itemPedido.js';
import { TipoUsuario } from '../models/tipoUsuario.js';
import InvalidUserTypeError from '../error/invalidUserTypeError.js';

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

  toDTO(pedido) {
    return {
      id: pedido.id || pedido._id,
      comprador: pedido.comprador,
      items: pedido.items,
      total: pedido.total,
      moneda: pedido.moneda,
      direccionEntrega: pedido.direccionEntrega,
      estado: pedido.estado,
      fechaCreacion: pedido.fechaCreacion,
    };
  }

  async crear(pedidoJSON) {
    // Generar los items
    const itemsCreados = await Promise.all(
      pedidoJSON.items.map((item) =>
        this.getItem(item.productoId, item.cantidad)
      )
    );

    // Traer el comprador
    const comprador = await this.getComprador(pedidoJSON.compradorId);
    if (comprador == null) {
      throw new Error('El comprador no existe para este producto!');
    }

    if (comprador.tipo !== TipoUsuario.COMPRADOR) {
      throw new InvalidUserTypeError(
        'No se puede crear un pedido con un usuario que no es de tipo comprador'
      );
    }

    // Construir el pedido con items reales
    let pedido = new Pedido(
      comprador.id,
      itemsCreados,
      pedidoJSON.moneda,
      pedidoJSON.direccionEntrega
    );
    // Validar stock
    if (!pedido.validarStock()) {
      const cantidad = _.sumBy(pedido.items, (item) => item.cantidad);
      throw new PedidoOutOfStockError(pedido.id, cantidad);
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

    pedido.estado = pedido.estado.valor; // Guardar solo el valor string del estado

    const pedidoGuardado = await this.pedidoRepository.create(pedido);

    // Restaurar el estado como objeto EstadoPedido después de la persistencia
    pedido.estado = Object.values(EstadoPedido).find(
      (e) => e.valor === pedido.estado
    );
    pedido.id = pedidoGuardado.id || pedidoGuardado._id;

    // Notificar
    await this.notificacionService.notificarPedido(pedido);

    return this.toDTO(pedidoGuardado);
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

      await Promise.all(
        items.map((itemPedido) =>
          this.productoService.modificarStock(
            itemPedido.producto,
            itemPedido.cantidad
          )
        )
      );
    }
    if (nuevoEstado === EstadoPedido.ENTREGADO) {
      await Promise.all(
        items.map((itemPedido) =>
          this.productoService.aumentarVentas(
            itemPedido.producto,
            itemPedido.cantidad
          )
        )
      );
    }

    pedidoAlmacenado.estado = pedidoModificadoJSON.estado;

    const pedidoActualizado = await this.pedidoRepository.update(id, pedidoAlmacenado);

    // Restaurar el estado como objeto EstadoPedido después de la persistencia
    pedidoAlmacenado.estado = Object.values(EstadoPedido).find(
      (e) => e.valor === pedidoActualizado.estado
    );

    // Notificar
    await this.notificacionService.notificarPedido(pedidoAlmacenado);

    return this.toDTO(pedidoActualizado);
  }

  async pedidosByUser(usuarioId) {
    const pedidos = await this.pedidoRepository.findByUserId(usuarioId);
    return pedidos.map((pedido) => this.toDTO(pedido));
  }

  async getItem(id, cantidad) {
    const producto = await this.productoService.findObjectById(id);
    return new Item(producto, cantidad);
  }

  async getComprador(id) {
    return await this.usuarioService.findById(id);
  }
}
