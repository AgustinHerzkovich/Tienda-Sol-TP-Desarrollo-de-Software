import Usuario from '../../../models/usuario.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import Producto from '../../../models/producto.js';
import { Moneda } from '../../../models/moneda.js';
import Categoria from '../../../models/categoria.js';
import ItemPedido from '../../../models/itemPedido.js';
import DireccionEntrega from '../../../models/direccionEntrega.js';
import Pedido from '../../../models/pedido.js';
import Notificacion from '../../../models/notificacion.js';
import NotificacionService from '../../../services/notificacionService.js';
import { jest } from '@jest/globals';

// Mock del repositorio
const mockNotificacionRepository = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
};

describe('Tests unitarios de notificacionService', () => {
  const notificacionService = new NotificacionService(
    mockNotificacionRepository
  );

  const usuarioDestino = new Usuario(
    'Nicolás Piacentini',
    'nicol@nicol.com',
    '123456789',
    TipoUsuario.VENDEDOR
  );
  usuarioDestino.id = 1;

  const sampleNotifications = [
    new Notificacion(usuarioDestino, 'message 1'),
    new Notificacion(usuarioDestino, 'message 2'),
    new Notificacion(usuarioDestino, 'message 3'),
  ];

  // Asignar IDs a las notificaciones de prueba
  sampleNotifications.forEach((notificacion, index) => {
    notificacion.id = index + 1;
  });

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  test('Se crea notificación correctamente para el pedido', async () => {
    const comprador = new Usuario(
      'Fabian',
      'fabian123@gmail.com',
      '1192871245',
      TipoUsuario.COMPRADOR
    );
    const vendedor = new Usuario(
      'Carlos',
      'carlos123@gmail.com',
      '1184710281',
      TipoUsuario.VENDEDOR
    );
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
      new ItemPedido(producto1, 10),
      new ItemPedido(producto2, 20),
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
    const pedido = new Pedido(
      comprador,
      items,
      Moneda.PESO_ARG,
      direccionEntrega
    );

    // Configurar el mock para devolver una notificación con el vendedor correcto
    mockNotificacionRepository.create.mockImplementation((notificacion) => {
      notificacion.id = 1;
      return Promise.resolve(notificacion);
    });

    const notificacion = await notificacionService.notificarPedido(pedido);

    expect(mockNotificacionRepository.create).toHaveBeenCalledTimes(1);
    expect(notificacion.usuarioDestino).toBe(vendedor);
    expect(notificacion.leida).toBe(false);
    expect(notificacion.id).toBeDefined();
  });

  test('Se obtienen las notificaciones no leídas de un usuario', async () => {
    // Configurar el mock para devolver las notificaciones no leídas
    mockNotificacionRepository.findByUserId.mockResolvedValue(
      sampleNotifications
    );

    const notificaciones = await notificacionService.findByUsuarioId(
      usuarioDestino.id,
      false
    );

    expect(mockNotificacionRepository.findByUserId).toHaveBeenCalledWith(
      usuarioDestino.id,
      false
    );
    expect(notificaciones.length).toBe(3);
    expect(notificaciones[0].usuarioDestino).toBe(usuarioDestino);
    expect(notificaciones[1].usuarioDestino).toBe(usuarioDestino);
    expect(notificaciones[2].usuarioDestino).toBe(usuarioDestino);
  });

  test('Se marca como leída una notificación y se obtienen las notificaciones leídas de un usuario', async () => {
    // Configurar mocks
    const notificacionModificada = new Notificacion(
      usuarioDestino,
      'message 1'
    );
    notificacionModificada.id = 1;
    notificacionModificada.leida = true;

    mockNotificacionRepository.findById.mockResolvedValue(
      sampleNotifications[0]
    );
    mockNotificacionRepository.update.mockResolvedValue(notificacionModificada);
    mockNotificacionRepository.findByUserId.mockResolvedValue([
      notificacionModificada,
    ]);

    const idNotificacion = 1;
    const notificacionActualizada = await notificacionService.modificar(
      idNotificacion,
      { read: true }
    );

    expect(mockNotificacionRepository.findById).toHaveBeenCalledWith(
      idNotificacion
    );
    expect(mockNotificacionRepository.update).toHaveBeenCalledTimes(1);
    expect(notificacionActualizada.leida).toBe(true);

    const notificacionesLeidas = await notificacionService.findByUsuarioId(
      usuarioDestino.id,
      true
    );
    expect(mockNotificacionRepository.findByUserId).toHaveBeenCalledWith(
      usuarioDestino.id,
      true
    );
    expect(notificacionesLeidas.length).toBe(1);
    expect(notificacionesLeidas[0].leida).toBe(true);
  });
});
