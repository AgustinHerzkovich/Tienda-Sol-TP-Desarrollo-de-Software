import Pedido from '../models/pedido.js';
import Item from '../models/itemPedido.js';
import PedidoOutOfStockError from '../error/pedidoOutOfStockError.js';
import CancellationError from '../error/cancellationError.js';
import { EstadoPedido } from '../models/estadoPedido.js';
import _ from 'lodash';
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
      // deberia estar en el getComprador
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
      throw new PedidoOutOfStockError(pedido.itemsSinStock());
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

    // Crear una copia temporal con estado completo para la notificación
    const pedidoParaNotificacion =
      this.crearCopiaParaNotificacion(pedidoGuardado);

    // Notificar
    await this.notificacionService.notificarPedido(pedidoParaNotificacion);

    return this.toDTO(pedidoGuardado);
  }

  async modificar(id, pedidoModificadoJSON) {
    let pedidoAlmacenado = await this.pedidoRepository.findById(id);
    const items = pedidoAlmacenado.items;
    const estadoActual = pedidoAlmacenado.estado; // string
    const estadosIncancelables = [
      EstadoPedido.ENVIADO.valor,
      EstadoPedido.ENTREGADO.valor,
    ];
    const nuevoEstadoString = pedidoModificadoJSON.estado;
    const nuevoEstado = Object.values(EstadoPedido).find(
      (e) => e.valor === nuevoEstadoString.valor
    );

    if (nuevoEstado === EstadoPedido.CANCELADO) {
      if (estadosIncancelables.includes(estadoActual.valor)) {
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

    // Actualizar el estado como string en la base de datos
    pedidoAlmacenado.estado = nuevoEstadoString;
    const pedidoActualizado = await this.pedidoRepository.update(
      id,
      pedidoAlmacenado
    );

    // Crear una copia temporal con estado completo para la notificación
    const pedidoParaNotificacion =
      this.crearCopiaParaNotificacion(pedidoAlmacenado);

    // Notificar
    await this.notificacionService.notificarPedido(pedidoParaNotificacion);

    return this.toDTO(pedidoActualizado);
  }

  async pedidosByUser(usuarioId) {
    const usuario = await this.usuarioService.findById(usuarioId);
    let pedidos;
    if (usuario.tipo === TipoUsuario.COMPRADOR) {
      pedidos = await this.pedidoRepository.findByCompradorId(usuarioId);
    } else {
      pedidos = await this.pedidoRepository.findByVendedorId(usuarioId);
    }
    return pedidos.map((pedido) => this.toDTO(pedido));
  }

  async getItem(id, cantidad) {
    const producto = await this.productoService.findObjectById(id);
    return new Item(producto, cantidad);
  }

  async getComprador(id) {
    return await this.usuarioService.findById(id);
  }

  // Helper para crear una copia temporal con estado completo para notificaciones
  crearCopiaParaNotificacion(pedidoMongoose) {
    const estadoString = pedidoMongoose.estado;
    const estadoCompleto = Object.values(EstadoPedido).find(
      (e) => e.valor === estadoString
    );

    // Crear una copia simple del pedido con el estado completo
    return {
      id: pedidoMongoose.id || pedidoMongoose._id,
      comprador: pedidoMongoose.comprador,
      items: pedidoMongoose.items,
      total: pedidoMongoose.total,
      moneda: pedidoMongoose.moneda,
      direccionEntrega: pedidoMongoose.direccionEntrega,
      estado: estadoCompleto,
      fechaCreacion: pedidoMongoose.fechaCreacion,
      getVendedor: function () {
        return this.items[0]?.producto?.vendedor;
      },
      getProductos: function () {
        return this.items.map((item) => item.producto);
      },
    };
  }
}
