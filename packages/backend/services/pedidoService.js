import Pedido from '../models/pedido.js';
import Item from '../models/itemPedido.js';
import PedidoOutOfStockError from '../exceptions/PedidoOutOfStockError.js';
import CancellationError from '../exceptions/cancellationError.js';
import { EstadoPedido } from '../models/estadoPedido.js';
import _ from 'lodash';
import NotFoundError from '../exceptions/notFoundError.js';
import ItemPedido from '../models/itemPedido.js';

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
    if(comprador == null){
      throw new Error("El comprador no existe para este producto!")
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

    // Notificar
    await this.notificacionService.notificarPedido(pedido);

    const items = pedidoJSON.items.map((item) => { new ItemPedido(item.productoId, item.cantidad)});
    pedido.items = items;

    pedido = await this.pedidoRepository.create(pedido);
    const valorEstadoPedido = pedido.estado.valor;
    pedido.estado = valorEstadoPedido
    return this.toDTO(pedido);
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
      console.log(nuevoEstado + ' Se entro al if de entregado');
      console.log('items: ' + items + ' q: ' + items.length);
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

    await this.notificacionService.notificarPedido(pedidoAlmacenado);
    pedidoAlmacenado = await this.pedidoRepository.update(id, pedidoAlmacenado);

    return this.toDTO(pedidoAlmacenado);
  }

  async pedidosByUser(usuarioId) {
    const pedidos = await this.pedidoRepository.findByUserId(usuarioId);
    return pedidos.map((pedido) => this.toDTO(pedido));
  }

  async getItem(id, cantidad) {
    const producto = await this.productoService.findObjectById(id);
    console.log('Producto obtenido' + producto + producto.id )
    return new Item(producto, cantidad);
  }

  async getComprador(id)  {
    return await this.usuarioService.findById(id);
  }
}