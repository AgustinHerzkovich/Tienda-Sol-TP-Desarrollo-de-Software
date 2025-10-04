import Notificacion from '../../../models/notificacion.js';
import Usuario from '../../../models/usuario.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import NotificacionAlreadyReadError from '../../../error/notificacionAlreadyReadError.js';

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

  describe('Casos edge', () => {
    test('Funciona con mensaje vacío', () => {
      const notificacion = new Notificacion(usuario, '');

      expect(notificacion.mensaje).toBe('');
      expect(notificacion.usuarioDestino).toBe(usuario);
    });

    test('Funciona con mensaje muy largo', () => {
      const mensajeLargo = 'A'.repeat(100000000);
      const notificacion = new Notificacion(usuario, mensajeLargo);

      expect(notificacion.mensaje).toBe(mensajeLargo);
      expect(notificacion.mensaje.length).toBe(100000000);
    });
    test('Funciona con simbolos raros ', () => {
  const mensajeRaro = `
      ⸘¡¿〽️⛩️∞∑≈≠√∛∆∇∂∫∬⊗⊕⊥⊨⊩∴∵∶≅⇌⇔⇐⇑⇓⇗⇘⇙⇚⇛ℵℶℷℸ℺ℼℽℿ
      ✈️✉️☂️☃️☄️⚡🔥🌪️🌈🌀🌋🗻🏔️🌍🌎🌏🌐🗺️📡📶🔗🔒🔓🔏🔐🔑💣🛡️🗝️
      🕉️☸️✡️☯️✝️☦️🛐⛎♈♉♊♋♌♍♎♏♐♑♒♓
      𝒮𝓎𝓂𝒷𝑜𝓁 𝓉𝑒𝓈𝓉
      😃😄😁😆😅😂🤣😊😇🙂🙃😉😍🥰😘😗😚😙😋😛😝😜🤪🤨🧐🤓😎🥳🤯😤😡🤬😱
      👽🤖👾🎃👻💀☠️👁️🧠🦷🦴🦾🦿🧬🧫🧪🧹🧺🧻🪠🧼🧽
      你好，世界！こんにちは世界！안녕하세요 세계! สวัสดีชาวโลก! Привет, мир! שלום עולם! مرحبا بالعالم!
      ਹੈਲੋ ਦੁਨਿਆ! హలో ప్రపంచం! ஹலோ வேர்ல்ட்! 😀😁😂🤣😃😄😅😆😉😊😋😎😍😘
      🈚🈯🈲🈳🈴🈵🈶🈷🈸🈹🈺🉐🉑㊗️㊙️🈁
      ௵₹₩€£₺₽₴₦₨₱¢¥₡₢₫₭₮₯₠₣₤₧₪
      🜁🜂🜃🜄🜅🜆🜇🜈🜉🜊🜋🜌🜍🜎🜏🜐🜑🜒🜓🜔🜕🜖🜗🜘🜙🜚🜛🜜🜝🜞🜟🜠🜡🜢🜣🜤🜥🜦🜧🜨🜩🜪🜫🜬🜭🜮🜯
      ༀ༁༂༃༄༅༆༇༈༉༊་༌།༎༏༐༑༒༓༔༕༖༗༘༙༚༛༜༝༞༟༠༡༢༣༤༥༦༧༨༩
      🕊️🦜🦢🦉🦚🦩🦇🦅🦆🦃🦤🐓🐔🐣🐥🐤🪿🪺
      🇺🇳🇺🇸🇪🇸🇫🇷🇧🇷🇨🇳🇯🇵🇷🇺🇮🇳🇩🇪🇮🇹🇰🇷🇲🇽🇨🇦
      🅰️🅱️🆎🆑🅾️🆘🆔🆚🉐🈲
      ÆØÅæøåÐđÞþĦħŦŧƛƩƔƱƵƷʃʒʔʕʢʡ`;
      const notificacion = new Notificacion(usuario, mensajeRaro);

      expect(notificacion.mensaje).toBe(mensajeRaro);
    });

    test('Múltiples notificaciones para el mismo usuario', () => {
      const notif1 = new Notificacion(usuario, 'Mensaje 1');
      const notif2 = new Notificacion(usuario, 'Mensaje 2');

      expect(notif1.usuarioDestino).toBe(usuario);
      expect(notif2.usuarioDestino).toBe(usuario);
      expect(notif1.mensaje).not.toBe(notif2.mensaje);
    });

    test('Fecha de notificacion cambia al pasar el tiempo', () => {
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
      try {
        notificacion.marcarComoLeida();
      } catch (error) {
        expect(error.message.includes(notificacion.id)).toBe(true);
      }
    });
  });
});
