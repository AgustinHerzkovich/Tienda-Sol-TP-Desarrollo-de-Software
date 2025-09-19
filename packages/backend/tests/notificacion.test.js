import Notificacion from '../models/notificacion.js';
import Usuario from '../models/usuario.js';
import { TipoUsuario } from '../models/tipoUsuario.js';

describe('Tests unitarios de notificación', () => {
  const usuario = new Usuario(
    'Fabian',
    'fabian123@gmail.com',
    '1192871245',
    TipoUsuario.COMPRADOR
  );

  let notificacion = new Notificacion(usuario, 'hola');

  notificacion.marcarComoLeida();

  test('La notificación se marcó como leída correctamente', () => {
    expect(notificacion.leida).toBe(true);
  });
});
