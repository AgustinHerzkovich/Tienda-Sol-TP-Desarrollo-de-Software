import Pedido from '../../../models/pedido.js';
import Usuario from '../../../models/usuario.js';
import Producto from '../../../models/producto.js';
import ItemPedido from '../../../models/itemPedido.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import { Moneda } from '../../../models/moneda.js';
import DireccionEntrega from '../../../models/direccionEntrega.js';
import { EstadoPedido } from '../../../models/estadoPedido.js';
import Categoria from '../../../models/categoria.js';

describe('Tests unitarios de pedido', () => {
  let pedido;
  let comprador;
  let vendedor;
  let producto1;
  let producto2;
  let items;
  let direccionEntrega;

  beforeAll(() => {
    comprador = new Usuario(
      'Fabian',
      'fabian123@gmail.com',
      '1192871245',
      TipoUsuario.COMPRADOR
    );
    vendedor = new Usuario(
      'Carlos',
      'carlos123@gmail.com',
      '1184710281',
      TipoUsuario.VENDEDOR
    );
    producto1 = new Producto(
      vendedor,
      'Producto 1',
      'descripcion x',
      [new Categoria('inmueble')],
      5000,
      Moneda.PESO_ARG,
      100,
      ['http://localhost:8000/api-docs'],
      true
    );
    producto2 = new Producto(
      vendedor,
      'Producto 2',
      'descripcion y',
      [new Categoria('inmueble')],
      10000,
      Moneda.PESO_ARG,
      100,
      ['http://localhost:8000/api-docs'],
      true
    );
    items = [new ItemPedido(producto1, 10), new ItemPedido(producto2, 20)];
    direccionEntrega = new DireccionEntrega(
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j'
    );
    pedido = new Pedido(comprador, items, Moneda.PESO_ARG, direccionEntrega);
  });

  describe('Constructor e inicialización', () => {
    test('Se crea el pedido correctamente con todos los parámetros', () => {
      expect(pedido.comprador).toBe(comprador);
      expect(pedido.items).toBe(items);
      expect(pedido.moneda).toBe(Moneda.PESO_ARG);
      expect(pedido.direccionEntrega).toBe(direccionEntrega);
    });

    test('El pedido se inicializa con estado PENDIENTE', () => {
      expect(pedido.estado).toBe(EstadoPedido.PENDIENTE);
    });

    test('Se asigna la fecha de creación', () => {
      expect(pedido.fechaCreacion).toBeDefined();
      expect(typeof pedido.fechaCreacion).toBe('number');
    });

    test('El historial de estados inicia vacío', () => {
      expect(pedido.historialEstados).toEqual([]);
    });

    test('El total se calcula automáticamente en el constructor', () => {
      expect(pedido.total).toBe(250000);
    });
  });

  describe('Cálculo del total', () => {
    test('El total del pedido es 250000', () => {
      expect(pedido.calcularTotal()).toBe(250000);
    });

    test('Pedido sin items tiene total 0', () => {
      const pedidoVacio = new Pedido(
        comprador,
        [],
        Moneda.PESO_ARG,
        direccionEntrega
      );
      expect(pedidoVacio.calcularTotal()).toBe(0);
    });

    test('Pedido con items de precio 0 tiene total 0', () => {
      const productoGratis = new Producto(
        vendedor,
        'Producto Gratis',
        'descripcion',
        [new Categoria('promocion')],
        0,
        Moneda.PESO_ARG,
        100,
        ['http://localhost:8000/api-docs'],
        true
      );
      const itemsGratis = [new ItemPedido(productoGratis, 5)];
      const pedidoGratis = new Pedido(
        comprador,
        itemsGratis,
        Moneda.PESO_ARG,
        direccionEntrega
      );
      expect(pedidoGratis.calcularTotal()).toBe(0);
    });
  });

  describe('Validación de stock', () => {
    test('El pedido tiene stock suficiente', () => {
      expect(pedido.validarStock()).toBe(true);
    });

    test('Pedido sin stock suficiente retorna false', () => {
      const productoSinStock = new Producto(
        vendedor,
        'Producto Sin Stock',
        'descripcion',
        [new Categoria('agotado')],
        1000,
        Moneda.PESO_ARG,
        5, // Solo 5 unidades disponibles
        ['http://localhost:8000/api-docs'],
        true
      );
      const itemsSinStock = [new ItemPedido(productoSinStock, 10)]; // Pedimos 10 pero solo hay 5
      const pedidoSinStock = new Pedido(
        comprador,
        itemsSinStock,
        Moneda.PESO_ARG,
        direccionEntrega
      );
      expect(pedidoSinStock.validarStock()).toBe(false);
    });

    test('Pedido vacío tiene stock', () => {
      const pedidoVacio = new Pedido(
        comprador,
        [],
        Moneda.PESO_ARG,
        direccionEntrega
      );
      expect(pedidoVacio.validarStock()).toBe(true);
    });
  });

  describe('Actualización de estado', () => {
    let pedidoParaEstados;

    beforeEach(() => {
      pedidoParaEstados = new Pedido(
        comprador,
        items,
        Moneda.PESO_ARG,
        direccionEntrega
      );
    });

    test('Se actualiza el estado del pedido a CONFIRMADO', () => {
      pedidoParaEstados.actualizarEstado(
        EstadoPedido.CONFIRMADO,
        vendedor,
        'Motivo x'
      );
      expect(pedidoParaEstados.estado).toBe(EstadoPedido.CONFIRMADO);
      expect(pedidoParaEstados.historialEstados.length).toBe(1);
    });

    test('Se guardan correctamente los datos del cambio de estado', () => {
      const motivo = 'Pedido confirmado por el vendedor';
      pedidoParaEstados.actualizarEstado(
        EstadoPedido.CONFIRMADO,
        vendedor,
        motivo
      );

      const cambioEstado = pedidoParaEstados.historialEstados[0];
      expect(cambioEstado.estadoPrevio).toBe(EstadoPedido.PENDIENTE.valor);
      expect(cambioEstado.nuevoEstado).toBe(EstadoPedido.CONFIRMADO.valor);
      expect(cambioEstado.pedido).toBe(pedidoParaEstados);
      expect(cambioEstado.usuario).toBe(vendedor);
      expect(cambioEstado.motivo).toBe(motivo);
    });

    test('Múltiples cambios de estado se guardan en el historial', () => {
      pedidoParaEstados.actualizarEstado(
        EstadoPedido.CONFIRMADO,
        vendedor,
        'Confirmación'
      );
      pedidoParaEstados.actualizarEstado(
        EstadoPedido.EN_PREPARACION,
        vendedor,
        'Preparando pedido'
      );
      pedidoParaEstados.actualizarEstado(
        EstadoPedido.ENVIADO,
        vendedor,
        'Enviado'
      );

      expect(pedidoParaEstados.historialEstados.length).toBe(3);
      expect(pedidoParaEstados.estado).toBe(EstadoPedido.ENVIADO);

      expect(pedidoParaEstados.historialEstados[0].estadoPrevio).toBe(
        EstadoPedido.PENDIENTE.valor
      );
      expect(pedidoParaEstados.historialEstados[0].nuevoEstado).toBe(
        EstadoPedido.CONFIRMADO.valor
      );
      expect(pedidoParaEstados.historialEstados[1].estadoPrevio).toBe(
        EstadoPedido.CONFIRMADO.valor
      );
      expect(pedidoParaEstados.historialEstados[1].nuevoEstado).toBe(
        EstadoPedido.EN_PREPARACION.valor
      );
      expect(pedidoParaEstados.historialEstados[2].estadoPrevio).toBe(
        EstadoPedido.EN_PREPARACION.valor
      );
      expect(pedidoParaEstados.historialEstados[2].nuevoEstado).toBe(
        EstadoPedido.ENVIADO.valor
      );
    });
  });

  describe('Métodos auxiliares', () => {
    test('getVendedor() retorna el vendedor del primer item', () => {
      expect(pedido.getVendedor()).toBe(vendedor);
    });

    test('getProductos() retorna todos los productos del pedido', () => {
      const productos = pedido.getProductos();
      expect(productos.length).toBe(2);
      expect(productos).toContain(producto1);
      expect(productos).toContain(producto2);
    });

    test('getProductos() con pedido vacío retorna array vacío', () => {
      const pedidoVacio = new Pedido(
        comprador,
        [],
        Moneda.PESO_ARG,
        direccionEntrega
      );
      expect(pedidoVacio.getProductos()).toEqual([]);
    });
  });
});
