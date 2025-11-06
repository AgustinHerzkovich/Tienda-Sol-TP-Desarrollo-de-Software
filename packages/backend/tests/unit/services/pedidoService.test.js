import PedidoService from '../../../services/pedidoService.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import ItemPedido from '../../../models/itemPedido.js';
import { Moneda } from '../../../models/moneda.js';
import { EstadoPedido } from '../../../models/estadoPedido.js';
import PedidoOutOfStockError from '../../../error/pedidoOutOfStockError.js';
import CancellationError from '../../../error/cancellationError.js';
import Usuario from '../../../models/usuario.js';
import Producto from '../../../models/producto.js';
import Pedido from '../../../models/pedido.js';
import Categoria from '../../../models/categoria.js';
import DireccionEntrega from '../../../models/direccionEntrega.js';
import { jest } from '@jest/globals';

describe('Tests unitarios de PedidoService', () => {
  let pedidoService;
  let mockPedidoRepository;
  let mockProductoService;
  let mockUsuarioService;
  let mockNotificationService;

  // Variables de test
  let comprador;
  let vendedor;
  let producto1;
  let producto2;
  let productoSinStock;
  let direccionEntrega;

  beforeAll(() => {
    // Crear objetos de prueba
    comprador = new Usuario(
      'Juan Manuel',
      'juan@test.com',
      '12345678',
      TipoUsuario.COMPRADOR
    );
    comprador.id = 1;

    vendedor = new Usuario(
      'Carlos Vendedor',
      'carlos@test.com',
      '87654321',
      TipoUsuario.VENDEDOR
    );
    vendedor.id = 2;

    producto1 = new Producto(
      vendedor,
      'Producto Test 1',
      'Descripción del producto 1',
      [new Categoria('Categoria1')],
      100,
      Moneda.PESO_ARG,
      50,
      ['http://test.com/foto1.jpg'],
      true
    );
    producto1.id = 1;

    producto2 = new Producto(
      vendedor,
      'Producto Test 2',
      'Descripción del producto 2',
      [new Categoria('Categoria2')],
      200,
      Moneda.DOLAR_USA,
      25,
      ['http://test.com/foto2.jpg'],
      true
    );
    producto2.id = 2;

    productoSinStock = new Producto(
      vendedor,
      'Producto Sin Stock',
      'Producto que se quedó sin stock',
      [new Categoria('Categoria3')],
      150,
      Moneda.PESO_ARG,
      0,
      ['http://test.com/foto3.jpg'],
      true
    );
    productoSinStock.id = 3;

    direccionEntrega = new DireccionEntrega(
      'Argentina',
      'Buenos Aires',
      'CABA',
      'Palermo',
      'Calle Test',
      '123',
      '1A',
      'C1414',
      'Entre Av. Test y Calle Mock',
      'Edificio Test'
    );
  });

  beforeEach(() => {
    // Configurar mocks
    mockPedidoRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByCompradorId: jest.fn(),
      findByVendedorId: jest.fn(),
      update: jest.fn(),
    };

    mockProductoService = {
      findById: jest.fn(),
      findObjectById: jest.fn(),
      modificarStock: jest.fn(),
      aumentarVentas: jest.fn(),
    };

    mockUsuarioService = {
      findById: jest.fn(),
      validarUsuarioId: jest.fn(),
    };

    mockNotificationService = {
      notificarPedido: jest.fn(),
    };

    pedidoService = new PedidoService(
      mockPedidoRepository,
      mockProductoService,
      mockUsuarioService,
      mockNotificationService
    );

    jest.clearAllMocks();
  });

  describe('crear()', () => {
    test('crea un pedido exitosamente con un producto', async () => {
      const pedidoJSON = {
        compradorId: comprador.id,
        items: [{ productoId: producto1.id, cantidad: 2 }],
        moneda: Moneda.PESO_ARG,
        direccionEntrega: direccionEntrega,
      };

      // Configurar mocks
      mockUsuarioService.findById.mockResolvedValue(comprador);
      mockProductoService.findObjectById.mockResolvedValue(producto1);
      mockProductoService.modificarStock.mockResolvedValue(undefined);
      mockNotificationService.notificarPedido.mockResolvedValue({ id: 1 });

      // Mock del repository create que devuelva el pedido con ID y fecha
      mockPedidoRepository.create.mockImplementation((pedido) => {
        pedido.id = 1;
        pedido.fechaCreacion = Date.now();
        return Promise.resolve(pedido);
      });

      const pedidoCreado = await pedidoService.crear(pedidoJSON);

      expect(pedidoCreado).toBeDefined();
      expect(pedidoCreado.id).toBe(1); // Verificar que tiene ID
      expect(pedidoCreado.comprador).toBe(comprador.id);
      expect(pedidoCreado.items).toHaveLength(1);
      expect(pedidoCreado.items[0].cantidad).toBe(2);
      expect(pedidoCreado.moneda).toBe(Moneda.PESO_ARG);
      expect(pedidoCreado.estado).toBe('PENDIENTE');
      expect(pedidoCreado.total).toBe(200); // 100 * 2

      // Verificar que se llamaron los métodos correctos
      expect(mockUsuarioService.findById).toHaveBeenCalledWith(comprador.id);
      expect(mockProductoService.findObjectById).toHaveBeenCalledWith(
        producto1.id
      );
      expect(mockProductoService.modificarStock).toHaveBeenCalledWith(
        producto1,
        -2
      );
      expect(mockPedidoRepository.create).toHaveBeenCalled();
      expect(mockNotificationService.notificarPedido).toHaveBeenCalled();
    });

    test('crea un pedido exitosamente con múltiples productos', async () => {
      const pedidoJSON = {
        compradorId: comprador.id,
        items: [
          { productoId: producto1.id, cantidad: 1 },
          { productoId: producto2.id, cantidad: 3 },
        ],
        moneda: Moneda.DOLAR_USA,
        direccionEntrega: direccionEntrega,
      };

      // Configurar mocks
      mockUsuarioService.findById.mockResolvedValue(comprador);
      mockProductoService.findObjectById
        .mockResolvedValueOnce(producto1)
        .mockResolvedValueOnce(producto2);
      mockProductoService.modificarStock.mockResolvedValue(undefined);
      mockNotificationService.notificarPedido.mockResolvedValue({ id: 1 });

      mockPedidoRepository.create.mockImplementation((pedido) => {
        pedido.id = 2;
        pedido.fechaCreacion = Date.now();
        return Promise.resolve(pedido);
      });

      const pedidoCreado = await pedidoService.crear(pedidoJSON);

      expect(pedidoCreado).toBeDefined();
      expect(pedidoCreado.id).toBe(2);
      expect(pedidoCreado.items).toHaveLength(2);
      expect(pedidoCreado.moneda).toBe(Moneda.DOLAR_USA);

      // Verificar llamadas a modificarStock
      expect(mockProductoService.modificarStock).toHaveBeenCalledWith(
        producto1,
        -1
      );
      expect(mockProductoService.modificarStock).toHaveBeenCalledWith(
        producto2,
        -3
      );
    });

    test('falla al crear pedido sin stock suficiente', async () => {
      const pedidoJSON = {
        compradorId: comprador.id,
        items: [{ productoId: productoSinStock.id, cantidad: 1 }],
        moneda: Moneda.PESO_ARG,
        direccionEntrega: direccionEntrega,
      };

      // Configurar mocks
      mockUsuarioService.findById.mockResolvedValue(comprador);
      mockProductoService.findObjectById.mockResolvedValue(productoSinStock);

      await expect(pedidoService.crear(pedidoJSON)).rejects.toThrow(
        PedidoOutOfStockError
      );

      // Verificar que no se guardó el pedido ni se modificó stock
      expect(mockPedidoRepository.create).not.toHaveBeenCalled();
      expect(mockProductoService.modificarStock).not.toHaveBeenCalled();
    });

    test('falla al crear pedido con cantidad mayor al stock disponible', async () => {
      const pedidoJSON = {
        compradorId: comprador.id,
        items: [{ productoId: producto1.id, cantidad: 100 }], // Stock: 50
        moneda: Moneda.PESO_ARG,
        direccionEntrega: direccionEntrega,
      };

      mockUsuarioService.findById.mockResolvedValue(comprador);
      mockProductoService.findObjectById.mockResolvedValue(producto1);

      await expect(pedidoService.crear(pedidoJSON)).rejects.toThrow(
        PedidoOutOfStockError
      );
    });

    test('establece la fecha de creación correctamente', async () => {
      const antes = Date.now();

      const pedidoJSON = {
        compradorId: comprador.id,
        items: [{ productoId: producto1.id, cantidad: 1 }],
        moneda: Moneda.PESO_ARG,
        direccionEntrega: direccionEntrega,
      };

      mockUsuarioService.findById.mockResolvedValue(comprador);
      mockProductoService.findObjectById.mockResolvedValue(producto1);
      mockProductoService.modificarStock.mockResolvedValue(undefined);
      mockNotificationService.notificarPedido.mockResolvedValue({ id: 1 });

      mockPedidoRepository.create.mockImplementation((pedido) => {
        pedido.id = 1;
        pedido.fechaCreacion = Date.now();
        return Promise.resolve(pedido);
      });

      const pedidoCreado = await pedidoService.crear(pedidoJSON);

      const despues = Date.now();

      expect(pedidoCreado.fechaCreacion).toBeDefined();
      expect(typeof pedidoCreado.fechaCreacion).toBe('number');
      expect(pedidoCreado.fechaCreacion).toBeGreaterThanOrEqual(antes);
      expect(pedidoCreado.fechaCreacion).toBeLessThanOrEqual(despues);
    });
  });

  describe('modificar()', () => {
    let pedidoParaModificar;

    beforeEach(() => {
      // Resetear cantidadVentas de los productos antes de cada test
      producto1.cantidadVentas = 0;
      producto2.cantidadVentas = 0;

      pedidoParaModificar = new Pedido(
        comprador,
        [new ItemPedido(producto1, 2)],
        Moneda.PESO_ARG,
        direccionEntrega
      );
      pedidoParaModificar.id = 1;
      pedidoParaModificar.fechaCreacion = Date.now();
    });

    test('modifica estado de PENDIENTE a CONFIRMADO', async () => {
      const pedidoModificadoJSON = { estado: 'CONFIRMADO' }; // Enviar como string

      // Configurar mocks - IMPORTANTE: findById debe devolver el pedido
      mockPedidoRepository.findById.mockResolvedValue(pedidoParaModificar);
      mockPedidoRepository.update.mockImplementation((id, pedidoModificado) => {
        // Simular que el repository actualiza el pedido y lo devuelve
        pedidoParaModificar.estado = 'CONFIRMADO';
        return Promise.resolve(pedidoParaModificar);
      });

      const resultado = await pedidoService.modificar(
        pedidoParaModificar.id,
        pedidoModificadoJSON
      );

      expect(resultado).toBeDefined();
      expect(resultado.id).toBe(1);
      expect(resultado.estado).toBe('CONFIRMADO');
      expect(mockPedidoRepository.findById).toHaveBeenCalledWith(1);
      expect(mockPedidoRepository.update).toHaveBeenCalled();
    });

    test('modifica estado de CONFIRMADO a EN_PREPARACION', async () => {
      // Configurar el pedido con estado CONFIRMADO
      pedidoParaModificar.estado = 'CONFIRMADO'; // Como string

      const pedidoModificadoJSON = { estado: 'EN_PREPARACION' }; // Enviar como string

      mockPedidoRepository.findById.mockResolvedValue(pedidoParaModificar);
      mockPedidoRepository.update.mockImplementation((id, pedidoModificado) => {
        pedidoParaModificar.estado = 'EN_PREPARACION';
        return Promise.resolve(pedidoParaModificar);
      });

      const resultado = await pedidoService.modificar(
        pedidoParaModificar.id,
        pedidoModificadoJSON
      );

      expect(resultado.estado).toBe('EN_PREPARACION');
    });

    test('modifica estado a ENTREGADO y aumenta ventas', async () => {
      const pedidoModificadoJSON = { estado: 'ENTREGADO' }; // Enviar como string

      mockPedidoRepository.findById.mockResolvedValue(pedidoParaModificar);
      mockProductoService.aumentarVentas.mockResolvedValue(undefined);
      mockPedidoRepository.update.mockImplementation((id, pedidoModificado) => {
        pedidoParaModificar.estado = 'ENTREGADO';
        return Promise.resolve(pedidoParaModificar);
      });

      const resultado = await pedidoService.modificar(
        pedidoParaModificar.id,
        pedidoModificadoJSON
      );

      expect(resultado.estado).toBe('ENTREGADO');
      expect(mockProductoService.aumentarVentas).toHaveBeenCalledWith(
        producto1,
        2
      );
    });

    test('verifica que cantidadVentas se incrementa al cambiar a ENTREGADO con un producto', async () => {
      // Guardar cantidadVentas inicial
      const ventasIniciales = producto1.cantidadVentas;

      const pedidoModificadoJSON = { estado: 'ENTREGADO' }; // Enviar como string

      mockPedidoRepository.findById.mockResolvedValue(pedidoParaModificar);

      // Mock de aumentarVentas que REALMENTE incremente el valor
      mockProductoService.aumentarVentas.mockImplementation(
        (producto, cantidad) => {
          producto.cantidadVentas += cantidad;
          return Promise.resolve();
        }
      );

      mockPedidoRepository.update.mockImplementation((id, pedidoModificado) => {
        pedidoParaModificar.estado = 'ENTREGADO';
        return Promise.resolve(pedidoParaModificar);
      });

      await pedidoService.modificar(
        pedidoParaModificar.id,
        pedidoModificadoJSON
      );

      // Verificar que cantidadVentas se incrementó por la cantidad del item
      expect(producto1.cantidadVentas).toBe(ventasIniciales + 2);
      expect(mockProductoService.aumentarVentas).toHaveBeenCalledWith(
        producto1,
        2
      );
    });

    test('verifica que cantidadVentas se incrementa al cambiar a ENTREGADO con múltiples productos', async () => {
      // Crear pedido con múltiples productos
      const pedidoMultiple = new Pedido(
        comprador,
        [new ItemPedido(producto1, 3), new ItemPedido(producto2, 5)],
        Moneda.PESO_ARG,
        direccionEntrega
      );
      pedidoMultiple.id = 2;
      pedidoMultiple.fechaCreacion = Date.now();

      const ventasInicialesP1 = producto1.cantidadVentas;
      const ventasInicialesP2 = producto2.cantidadVentas;

      const pedidoModificadoJSON = { estado: 'ENTREGADO' }; // Enviar como string

      mockPedidoRepository.findById.mockResolvedValue(pedidoMultiple);

      // Mock que incremente realmente las ventas
      mockProductoService.aumentarVentas.mockImplementation(
        (producto, cantidad) => {
          producto.cantidadVentas += cantidad;
          return Promise.resolve();
        }
      );

      mockPedidoRepository.update.mockImplementation((id, pedidoModificado) => {
        pedidoMultiple.estado = 'ENTREGADO';
        return Promise.resolve(pedidoMultiple);
      });

      await pedidoService.modificar(pedidoMultiple.id, pedidoModificadoJSON);

      // Verificar que ambos productos incrementaron sus ventas
      expect(producto1.cantidadVentas).toBe(ventasInicialesP1 + 3);
      expect(producto2.cantidadVentas).toBe(ventasInicialesP2 + 5);
      expect(mockProductoService.aumentarVentas).toHaveBeenCalledTimes(2);
      expect(mockProductoService.aumentarVentas).toHaveBeenCalledWith(
        producto1,
        3
      );
      expect(mockProductoService.aumentarVentas).toHaveBeenCalledWith(
        producto2,
        5
      );
    });

    test('permite cancelar pedido PENDIENTE y devuelve stock', async () => {
      const pedidoModificadoJSON = { estado: 'CANCELADO' }; // Enviar como string

      mockPedidoRepository.findById.mockResolvedValue(pedidoParaModificar);
      mockProductoService.modificarStock.mockResolvedValue(undefined);
      mockPedidoRepository.update.mockImplementation((id, pedidoModificado) => {
        pedidoParaModificar.estado = 'CANCELADO';
        return Promise.resolve(pedidoParaModificar);
      });

      const resultado = await pedidoService.modificar(
        pedidoParaModificar.id,
        pedidoModificadoJSON
      );

      expect(resultado.estado).toBe('CANCELADO');
      expect(mockProductoService.modificarStock).toHaveBeenCalledWith(
        producto1,
        2
      );
    });

    test('no permite cancelar pedido ENVIADO', async () => {
      pedidoParaModificar.estado = 'ENVIADO'; // Cambiar el estado del pedido
      const pedidoModificadoJSON = { estado: 'CANCELADO' }; // Enviar como string

      // IMPORTANTE: Configurar el mock para devolver el pedido
      mockPedidoRepository.findById.mockResolvedValue(pedidoParaModificar);

      await expect(
        pedidoService.modificar(pedidoParaModificar.id, pedidoModificadoJSON)
      ).rejects.toThrow(CancellationError);

      expect(mockPedidoRepository.update).not.toHaveBeenCalled();
    });

    test('no permite cancelar pedido ENTREGADO', async () => {
      pedidoParaModificar.estado = 'ENTREGADO'; // Cambiar el estado del pedido
      const pedidoModificadoJSON = { estado: 'CANCELADO' }; // Enviar como string

      mockPedidoRepository.findById.mockResolvedValue(pedidoParaModificar);

      await expect(
        pedidoService.modificar(pedidoParaModificar.id, pedidoModificadoJSON)
      ).rejects.toThrow(CancellationError);
    });
  });

  describe('pedidosByUser()', () => {
    test('devuelve todos los pedidos de un comprador', async () => {
      const pedido1 = new Pedido(
        comprador,
        [new ItemPedido(producto1, 1)],
        Moneda.PESO_ARG,
        direccionEntrega
      );
      const pedido2 = new Pedido(
        comprador,
        [new ItemPedido(producto2, 2)],
        Moneda.DOLAR_USA,
        direccionEntrega
      );
      pedido1.id = 1;
      pedido2.id = 2;

      mockUsuarioService.findById.mockResolvedValue(comprador);
      mockPedidoRepository.findByCompradorId.mockResolvedValue([
        pedido1,
        pedido2,
      ]);

      const pedidos = await pedidoService.pedidosByUser(comprador.id);

      expect(pedidos).toBeDefined();
      expect(Array.isArray(pedidos)).toBe(true);
      expect(pedidos).toHaveLength(2);
      expect(mockUsuarioService.findById).toHaveBeenCalledWith(comprador.id);
      expect(mockPedidoRepository.findByCompradorId).toHaveBeenCalledWith(
        comprador.id
      );

      pedidos.forEach((pedido) => {
        expect(pedido.comprador.id).toBe(comprador.id);
      });
    });

    test('devuelve todos los pedidos de un vendedor', async () => {
      const pedido1 = new Pedido(
        comprador,
        [new ItemPedido(producto1, 1)],
        Moneda.PESO_ARG,
        direccionEntrega
      );
      pedido1.id = 1;

      mockUsuarioService.findById.mockResolvedValue(vendedor);
      mockPedidoRepository.findByVendedorId.mockResolvedValue([pedido1]);

      const pedidos = await pedidoService.pedidosByUser(vendedor.id);

      expect(pedidos).toBeDefined();
      expect(Array.isArray(pedidos)).toBe(true);
      expect(pedidos).toHaveLength(1);
      expect(mockUsuarioService.findById).toHaveBeenCalledWith(vendedor.id);
      expect(mockPedidoRepository.findByVendedorId).toHaveBeenCalledWith(
        vendedor.id
      );
    });

    test('devuelve array vacío para comprador sin pedidos', async () => {
      mockUsuarioService.findById.mockResolvedValue(comprador);
      mockPedidoRepository.findByCompradorId.mockResolvedValue([]);

      const pedidos = await pedidoService.pedidosByUser(999);

      expect(pedidos).toBeDefined();
      expect(Array.isArray(pedidos)).toBe(true);
      expect(pedidos).toHaveLength(0);
    });
  });

  describe('Métodos auxiliares', () => {
    describe('getItem()', () => {
      test('crea ItemPedido correctamente', async () => {
        mockProductoService.findObjectById.mockResolvedValue(producto1);

        const item = await pedidoService.getItem(producto1.id, 3);

        expect(item).toBeInstanceOf(ItemPedido);
        expect(item.producto.id).toBe(producto1.id);
        expect(item.cantidad).toBe(3);
        expect(item.precioUnitario).toBe(producto1.precio);
      });

      test('calcula subtotal correctamente', async () => {
        mockProductoService.findObjectById.mockResolvedValue(producto2);

        const item = await pedidoService.getItem(producto2.id, 4);

        expect(item.subtotal()).toBe(producto2.precio * 4);
      });
    });

    describe('getComprador()', () => {
      test('obtiene comprador por ID', async () => {
        mockUsuarioService.findById.mockResolvedValue(comprador);

        const compradorObtenido = await pedidoService.getComprador(
          comprador.id
        );

        expect(compradorObtenido).toBeDefined();
        expect(compradorObtenido.id).toBe(comprador.id);
        expect(compradorObtenido.nombre).toBe(comprador.nombre);
        expect(compradorObtenido.tipo).toBe(TipoUsuario.COMPRADOR);
        expect(mockUsuarioService.findById).toHaveBeenCalledWith(comprador.id);
      });
    });
  });

  describe('Casos edge y validaciones', () => {
    test('maneja pedido con items que suman exactamente el stock disponible', async () => {
      const productoLimitado = new Producto(
        vendedor,
        'Producto Limitado',
        'Stock exacto',
        [new Categoria('Limitado')],
        50,
        Moneda.PESO_ARG,
        5,
        ['http://test.com/limitado.jpg'],
        true
      );
      productoLimitado.id = 4;

      const pedidoJSON = {
        compradorId: comprador.id,
        items: [{ productoId: productoLimitado.id, cantidad: 5 }],
        moneda: Moneda.PESO_ARG,
        direccionEntrega: direccionEntrega,
      };

      mockUsuarioService.findById.mockResolvedValue(comprador);
      mockProductoService.findObjectById.mockResolvedValue(productoLimitado);
      mockProductoService.modificarStock.mockResolvedValue(undefined);
      mockNotificationService.notificarPedido.mockResolvedValue({ id: 1 });

      mockPedidoRepository.create.mockImplementation((pedido) => {
        pedido.id = 1;
        pedido.fechaCreacion = Date.now();
        return Promise.resolve(pedido);
      });

      const pedidoCreado = await pedidoService.crear(pedidoJSON);

      expect(pedidoCreado).toBeDefined();
      expect(pedidoCreado.items[0].cantidad).toBe(5);
      expect(mockProductoService.modificarStock).toHaveBeenCalledWith(
        productoLimitado,
        -5
      );
    });

    test('maneja monedas diferentes correctamente', async () => {
      const testCases = [
        { moneda: Moneda.PESO_ARG },
        { moneda: Moneda.DOLAR_USA },
        { moneda: Moneda.REAL },
      ];

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const pedidoJSON = {
          compradorId: comprador.id,
          items: [{ productoId: producto1.id, cantidad: 1 }],
          moneda: testCase.moneda,
          direccionEntrega: direccionEntrega,
        };

        mockUsuarioService.findById.mockResolvedValue(comprador);
        mockProductoService.findObjectById.mockResolvedValue(producto1);
        mockProductoService.modificarStock.mockResolvedValue(undefined);
        mockNotificationService.notificarPedido.mockResolvedValue({
          id: i + 1,
        });

        mockPedidoRepository.create.mockImplementation((pedido) => {
          pedido.id = i + 1;
          pedido.fechaCreacion = Date.now();
          return Promise.resolve(pedido);
        });

        const pedidoCreado = await pedidoService.crear(pedidoJSON);
        expect(pedidoCreado.moneda).toBe(testCase.moneda);
      }
    });
  });

  describe('Integración completa', () => {
    test('flujo completo: crear, modificar múltiples estados, consultar', async () => {
      // 1. Crear pedido
      const pedidoJSON = {
        compradorId: comprador.id,
        items: [{ productoId: producto1.id, cantidad: 2 }],
        moneda: Moneda.PESO_ARG,
        direccionEntrega: direccionEntrega,
      };

      mockUsuarioService.findById.mockResolvedValue(comprador);
      mockProductoService.findObjectById.mockResolvedValue(producto1);
      mockProductoService.modificarStock.mockResolvedValue(undefined);
      mockProductoService.aumentarVentas.mockResolvedValue(undefined);
      mockNotificationService.notificarPedido.mockResolvedValue({ id: 1 });

      // Crear una instancia persistente del pedido que se mantenga entre llamadas
      let pedidoEjecutandose = null;

      mockPedidoRepository.create.mockImplementation((pedido) => {
        pedido.id = 1;
        pedido.fechaCreacion = Date.now();
        pedidoEjecutandose = pedido; // Guardar referencia
        return Promise.resolve(pedido);
      });

      mockPedidoRepository.findById.mockImplementation(() => {
        return Promise.resolve(pedidoEjecutandose);
      });

      mockPedidoRepository.update.mockImplementation((id, pedidoModificado) => {
        if (pedidoEjecutandose) {
          pedidoEjecutandose.estado = pedidoModificado.estado;
        }
        return Promise.resolve(pedidoEjecutandose);
      });

      mockPedidoRepository.findByUserId.mockImplementation(() => {
        return Promise.resolve([pedidoEjecutandose]);
      });

      const pedidoCreado = await pedidoService.crear(pedidoJSON);
      expect(pedidoCreado.estado).toBe('PENDIENTE');

      // 2-5. Modificar estados (enviando como strings)
      const estados = ['CONFIRMADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO'];

      for (const estado of estados) {
        const pedidoModificado = await pedidoService.modificar(
          pedidoCreado.id,
          { estado } // Enviar como string
        );
        expect(pedidoModificado.estado).toBe(estado); // Comparar como string
      }

      // 6. Verificar consulta
      mockUsuarioService.findById.mockResolvedValue(comprador);
      mockPedidoRepository.findByCompradorId.mockResolvedValue([pedidoCreado]);

      const pedidosUsuario = await pedidoService.pedidosByUser(comprador.id);
      expect(pedidosUsuario).toHaveLength(1);
      expect(pedidosUsuario[0].id).toBe(pedidoCreado.id);
    });
  });
});
