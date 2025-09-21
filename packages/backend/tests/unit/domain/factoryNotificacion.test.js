import { EstadoPedido } from '../../../models/estadoPedido.js';
import FactoryNotificacion from '../../../models/factoryNotificacion.js';
import Usuario from '../../../models/usuario.js';
import Producto from '../../../models/producto.js';
import Categoria from '../../../models/categoria.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import { Moneda } from '../../../models/moneda.js';
import ItemPedido from '../../../models/itemPedido.js';
import DireccionEntrega from '../../../models/direccionEntrega.js';
import Pedido from '../../../models/pedido.js';

describe('Tests unitarios de factory notificación', () => {
  let comprador;
  let vendedor;
  let factoryNotificacion;
  let pedidoBase;

  // Helper function para crear copias correctas del pedido
  const crearPedidoCopia = (estado, id = 1) => {
    const pedidoCopy = new Pedido(
      pedidoBase.comprador,
      pedidoBase.items,
      pedidoBase.moneda,
      pedidoBase.direccionEntrega
    );
    pedidoCopy.estado = estado;
    pedidoCopy.id = id;
    return pedidoCopy;
  };

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

    factoryNotificacion = new FactoryNotificacion();

    // Crear pedido base para reutilizar
    const producto1 = new Producto(
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

    const items = [new ItemPedido(producto1, 10)];
    const direccionEntrega = new DireccionEntrega(
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

    pedidoBase = new Pedido(
      comprador,
      items,
      Moneda.PESO_ARG,
      direccionEntrega
    );
  });

  describe('Creación de mensajes según estado', () => {
    test('Mensaje para estado PENDIENTE', () => {
      const mensaje = factoryNotificacion.crearSegunEstadoPedido(
        EstadoPedido.PENDIENTE
      );
      expect(mensaje).toBe('Se ha realizado un pedido!');
    });

    test('Mensaje para estado CONFIRMADO', () => {
      const mensaje = factoryNotificacion.crearSegunEstadoPedido(
        EstadoPedido.CONFIRMADO
      );
      expect(mensaje).toBe('Confirmamos tu pedido!!');
    });

    test('Mensaje para estado EN_PREPARACION', () => {
      const mensaje = factoryNotificacion.crearSegunEstadoPedido(
        EstadoPedido.EN_PREPARACION
      );
      expect(mensaje).toBe('Estamos preparando tu pedido!');
    });

    test('Mensaje para estado ENVIADO', () => {
      const mensaje = factoryNotificacion.crearSegunEstadoPedido(
        EstadoPedido.ENVIADO
      );
      expect(mensaje).toBe('Enviamos tu pedido!');
    });

    test('Mensaje para estado ENTREGADO', () => {
      const mensaje = factoryNotificacion.crearSegunEstadoPedido(
        EstadoPedido.ENTREGADO
      );
      expect(mensaje).toBe('Entregamos tu pedido!');
    });

    test('Mensaje para estado CANCELADO', () => {
      const mensaje = factoryNotificacion.crearSegunEstadoPedido(
        EstadoPedido.CANCELADO
      );
      expect(mensaje).toBe('Un comprador canceló un pedido!');
    });
  });

  describe('Creación de notificaciones según pedido', () => {
    test('Notificación para pedido PENDIENTE va al vendedor', () => {
      // Usar directamente pedidoBase que ya tiene estado PENDIENTE por defecto
      pedidoBase.id = 1;

      const notificacion = factoryNotificacion.crearSegunPedido(pedidoBase);

      expect(notificacion.usuarioDestino).toBe(vendedor);
      expect(notificacion.mensaje).toContain('Se ha realizado un pedido!');
    });

    test('Notificación para pedido CONFIRMADO va al comprador', () => {
      // Crear una copia correcta manteniendo los métodos
      const pedidoCopy = new Pedido(
        pedidoBase.comprador,
        pedidoBase.items,
        pedidoBase.moneda,
        pedidoBase.direccionEntrega
      );
      pedidoCopy.estado = EstadoPedido.CONFIRMADO;
      pedidoCopy.id = 1;

      const notificacion = factoryNotificacion.crearSegunPedido(pedidoCopy);

      expect(notificacion.usuarioDestino).toBe(comprador);
      expect(notificacion.mensaje).toContain('Confirmamos tu pedido!!');
    });

    test('Notificación para pedido EN_PREPARACION va al comprador', () => {
      const pedido = crearPedidoCopia(EstadoPedido.EN_PREPARACION);

      const notificacion = factoryNotificacion.crearSegunPedido(pedido);

      expect(notificacion.usuarioDestino).toBe(comprador);
      expect(notificacion.mensaje).toContain('Estamos preparando tu pedido!');
    });

    test('Notificación para pedido ENVIADO va al comprador', () => {
      const pedido = crearPedidoCopia(EstadoPedido.ENVIADO);

      const notificacion = factoryNotificacion.crearSegunPedido(pedido);

      expect(notificacion.usuarioDestino).toBe(comprador);
      expect(notificacion.mensaje).toContain('Enviamos tu pedido!');
    });

    test('Notificación para pedido ENTREGADO va al comprador', () => {
      const pedido = crearPedidoCopia(EstadoPedido.ENTREGADO);

      const notificacion = factoryNotificacion.crearSegunPedido(pedido);

      expect(notificacion.usuarioDestino).toBe(comprador);
      expect(notificacion.mensaje).toContain('Entregamos tu pedido!');
    });

    test('Notificación para pedido CANCELADO va al vendedor', () => {
      const pedido = crearPedidoCopia(EstadoPedido.CANCELADO);

      const notificacion = factoryNotificacion.crearSegunPedido(pedido);

      expect(notificacion.usuarioDestino).toBe(vendedor);
      expect(notificacion.mensaje).toContain('Un comprador canceló un pedido!');
    });
  });

  describe('Validación del mensaje completo', () => {
    test('El mensaje se concatena correctamente con información del pedido', () => {
      const pedido = crearPedidoCopia(EstadoPedido.CONFIRMADO, 123);

      const notificacion = factoryNotificacion.crearSegunPedido(pedido);

      expect(notificacion.mensaje).toContain('Confirmamos tu pedido!!');
      expect(notificacion.mensaje).toContain('Pedido Id: 123');
    });

    test('La notificación creada es una instancia válida', () => {
      const pedido = crearPedidoCopia(EstadoPedido.CONFIRMADO);

      const notificacion = factoryNotificacion.crearSegunPedido(pedido);

      expect(notificacion).toBeDefined();
      expect(notificacion.usuarioDestino).toBeDefined();
      expect(notificacion.mensaje).toBeDefined();
      expect(typeof notificacion.mensaje).toBe('string');
      expect(notificacion.mensaje.length).toBeGreaterThan(0);
    });
  });

  describe('Casos con diferentes tipos de pedidos', () => {
    test('Funciona con pedido que tiene múltiples productos', () => {
      const producto2 = new Producto(
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

      const items = [
        new ItemPedido(pedidoBase.items[0].producto, 10),
        new ItemPedido(producto2, 5),
      ];

      const direccionEntrega = new DireccionEntrega(
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

      const pedidoMultiple = new Pedido(
        comprador,
        items,
        Moneda.PESO_ARG,
        direccionEntrega
      );
      pedidoMultiple.estado = EstadoPedido.CONFIRMADO;
      pedidoMultiple.id = 456;

      const notificacion = factoryNotificacion.crearSegunPedido(pedidoMultiple);

      expect(notificacion.usuarioDestino).toBe(comprador);
      expect(notificacion.mensaje).toContain('Confirmamos tu pedido!!');
    });
  });
});
