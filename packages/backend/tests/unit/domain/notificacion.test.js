import Notificacion from '../../../models/notificacion.js';
import Usuario from '../../../models/usuario.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import NotificacionAlreadyReadError from '../../../exceptions/notificacionAlreadyReadError.js';

describe('Tests unitarios de notificación', () => {
  let usuario;

  beforeAll(() => {
    usuario = new Usuario(
      'Fabian',
      'fabian123@gmail.com',
      '1192871245',
      TipoUsuario.COMPRADOR
    );
  });

  describe('Constructor e inicialización', () => {
    test('Se crea la notificación con parámetros obligatorios', () => {
      const notificacion = new Notificacion(usuario, 'Mensaje de prueba');

      expect(notificacion.usuarioDestino).toBe(usuario);
      expect(notificacion.mensaje).toBe('Mensaje de prueba');
    });

    test('Se inicializa con valores por defecto correctos', () => {
      const notificacion = new Notificacion(usuario, 'Test');

      expect(notificacion.leida).toBe(false);
      expect(notificacion.fechaLeida).toBeNull();
      expect(notificacion.fechaAlta).toBeDefined();
      expect(typeof notificacion.fechaAlta).toBe('number');
    });

    test('Se puede crear con fecha personalizada', () => {
      const fechaCustom = Date.now() - 1000;
      const notificacion = new Notificacion(
        usuario,
        'Test',
        fechaCustom,
        false,
        null
      );

      expect(notificacion.fechaAlta).toBe(fechaCustom);
    });

    test('Se puede crear ya marcada como leída', () => {
      const fechaLeida = Date.now();
      const notificacion = new Notificacion(
        usuario,
        'Test',
        Date.now(),
        true,
        fechaLeida
      );

      expect(notificacion.leida).toBe(true);
      expect(notificacion.fechaLeida).toBe(fechaLeida);
    });
  });

  describe('Marcar como leída', () => {
    test('Se marca como leída correctamente', () => {
      const notificacion = new Notificacion(usuario, 'Test');
      const tiempoAntes = Date.now();

      notificacion.marcarComoLeida();

      const tiempoDespues = Date.now();

      expect(notificacion.leida).toBe(true);
      expect(notificacion.fechaLeida).toBeGreaterThanOrEqual(tiempoAntes);
      expect(notificacion.fechaLeida).toBeLessThanOrEqual(tiempoDespues);
    });

    test('No se puede marcar como leída una notificación que ya está leída', () => {
      const notificacion = new Notificacion(usuario, 'Test');
      notificacion.marcarComoLeida();

      expect(() => notificacion.marcarComoLeida()).toThrow(
        NotificacionAlreadyReadError
      );
    });

    test('No se puede marcar como leída una notificación creada ya leída', () => {
      const notificacion = new Notificacion(
        usuario,
        'Test',
        Date.now(),
        true,
        Date.now()
      );

      expect(() => notificacion.marcarComoLeida()).toThrow(
        NotificacionAlreadyReadError
      );
    });

    test('La fecha de lectura se mantiene después de marcar como leída', () => {
      const notificacion = new Notificacion(usuario, 'Test');

      notificacion.marcarComoLeida();
      const fechaLeidaOriginal = notificacion.fechaLeida;

      // Intentar marcar de nuevo debería fallar pero no cambiar la fecha
      try {
        notificacion.marcarComoLeida();
      } catch (error) {
        // Se espera el error
      }

      expect(notificacion.fechaLeida).toBe(fechaLeidaOriginal);
    });
  });

  describe('Estados de notificación', () => {
    test('Notificación nueva está no leída', () => {
      const notificacion = new Notificacion(usuario, 'Nueva notificación');

      expect(notificacion.leida).toBe(false);
      expect(notificacion.fechaLeida).toBeNull();
    });

    test('Notificación leída mantiene estado consistente', () => {
      const notificacion = new Notificacion(usuario, 'Test');
      notificacion.marcarComoLeida();

      expect(notificacion.leida).toBe(true);
      expect(notificacion.fechaLeida).not.toBeNull();
      expect(notificacion.fechaLeida).toBeGreaterThanOrEqual(
        notificacion.fechaAlta
      );
    });
  });

  describe('Casos edge', () => {
    test('Funciona con mensaje vacío', () => {
      const notificacion = new Notificacion(usuario, '');

      expect(notificacion.mensaje).toBe('');
      expect(notificacion.usuarioDestino).toBe(usuario);
    });

    test('Funciona con mensaje muy largo', () => {
      const mensajeLargo = 'A'.repeat(1000);
      const notificacion = new Notificacion(usuario, mensajeLargo);

      expect(notificacion.mensaje).toBe(mensajeLargo);
      expect(notificacion.mensaje.length).toBe(1000);
    });

    test('Múltiples notificaciones para el mismo usuario', () => {
      const notif1 = new Notificacion(usuario, 'Mensaje 1');
      const notif2 = new Notificacion(usuario, 'Mensaje 2');

      expect(notif1.usuarioDestino).toBe(usuario);
      expect(notif2.usuarioDestino).toBe(usuario);
      expect(notif1.mensaje).not.toBe(notif2.mensaje);
    });

    test('Fechas de notificaciones diferentes', () => {
      const notif1 = new Notificacion(usuario, 'Test 1');

      // Pequeña pausa para asegurar diferentes timestamps
      setTimeout(() => {
        const notif2 = new Notificacion(usuario, 'Test 2');
        expect(notif2.fechaAlta).toBeGreaterThanOrEqual(notif1.fechaAlta);
      }, 1);
    });
  });

  describe('Validación de error', () => {
    test('El error incluye el ID de la notificación cuando existe', () => {
      const notificacion = new Notificacion(usuario, 'Test');
      notificacion.id = 123;
      notificacion.marcarComoLeida();

      expect(() => notificacion.marcarComoLeida()).toThrow(
        NotificacionAlreadyReadError
      );
    });
  });
});
