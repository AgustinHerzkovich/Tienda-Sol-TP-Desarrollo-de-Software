import UsuarioService from '../../../services/usuarioService.js';
import Usuario from '../../../models/usuario.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import UsuarioNotFoundError from '../../../exceptions/usuarioNotFoundError.js';
import { jest } from '@jest/globals';

describe('UsuarioService', () => {
  let usuarioService;
  let usuarioRepositoryMock;

  beforeEach(() => {
    usuarioRepositoryMock = {
      findById: jest.fn(),
      create: jest.fn(),
    };
    usuarioService = new UsuarioService(usuarioRepositoryMock);
    jest.clearAllMocks();
  });
  describe('validarUsuarioId', () => {
    test('lanza UsuarioNotFoundError si el usuario no existe', async () => {
      usuarioRepositoryMock.findById.mockResolvedValue(undefined);

      await expect(usuarioService.validarUsuarioId(1)).rejects.toThrow(
        UsuarioNotFoundError
      );

      expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(1);
    });

    test('no lanza error si el usuario existe', async () => {
      const usuario = {
        nombre: 'juan',
        mail: 'mail@mail.com',
        telefono: '35',
        tipo: TipoUsuario.COMPRADOR,
        id: 1,
      };
      usuarioRepositoryMock.findById.mockResolvedValue(usuario);

      await expect(usuarioService.validarUsuarioId(1)).resolves.toBeUndefined();
      expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(1);
    });

    test('lanza error con mensaje específico cuando usuario no existe', async () => {
      usuarioRepositoryMock.findById.mockResolvedValue(null);

      await expect(usuarioService.validarUsuarioId(999)).rejects.toThrow(
        'Usuario no encontrado'
      );
    });
  });

  describe('findById', () => {
    test('devuelve el usuario cuando existe', async () => {
      const usuario = {
        nombre: 'juan',
        mail: 'mail@mail.com',
        telefono: '35',
        tipo: TipoUsuario.COMPRADOR,
        id: 1,
      };
      usuarioRepositoryMock.findById.mockResolvedValue(usuario);

      const result = await usuarioService.findById(1);

      expect(result).toEqual(usuario);
      expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(1);
    });

    test('devuelve undefined cuando el usuario no existe', async () => {
      usuarioRepositoryMock.findById.mockResolvedValue(undefined);

      const result = await usuarioService.findById(999);

      expect(result).toBeUndefined();
      expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(999);
    });

    test('devuelve null cuando el repositorio retorna null', async () => {
      usuarioRepositoryMock.findById.mockResolvedValue(null);

      const result = await usuarioService.findById(123);

      expect(result).toBeNull();
      expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(123);
    });
  });

  describe('crear', () => {
    test('crea un Usuario ADMIN correctamente', async () => {
      const usuarioJSON = {
        nombre: 'María',
        mail: 'maria@mail.com',
        telefono: '123456789',
        tipo: 'ADMIN',
      };
      const usuarioGuardado = { id: 10, ...usuarioJSON };
      usuarioRepositoryMock.save.mockResolvedValue(usuarioGuardado);

      const result = await usuarioService.crear(usuarioJSON);

      expect(usuarioRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(usuarioRepositoryMock.save).toHaveBeenCalledWith(
        expect.any(Usuario)
      );
      expect(result).toEqual(usuarioGuardado);
    });

    test('crea un Usuario COMPRADOR correctamente', async () => {
      const usuarioJSON = {
        nombre: 'Juan',
        mail: 'juan@mail.com',
        telefono: '987654321',
        tipo: 'COMPRADOR',
      };
      const usuarioGuardado = { id: 20, ...usuarioJSON };
      usuarioRepositoryMock.save.mockResolvedValue(usuarioGuardado);

      const result = await usuarioService.crear(usuarioJSON);

      expect(usuarioRepositoryMock.save).toHaveBeenCalledWith(
        expect.any(Usuario)
      );
      expect(result).toEqual(usuarioGuardado);
    });

    test('crea un Usuario VENDEDOR correctamente', async () => {
      const usuarioJSON = {
        nombre: 'Carlos',
        mail: 'carlos@mail.com',
        telefono: '555123456',
        tipo: 'VENDEDOR',
      };
      const usuarioGuardado = { id: 30, ...usuarioJSON };
      usuarioRepositoryMock.save.mockResolvedValue(usuarioGuardado);

      const result = await usuarioService.crear(usuarioJSON);

      expect(usuarioRepositoryMock.save).toHaveBeenCalledWith(
        expect.any(Usuario)
      );
      expect(result).toEqual(usuarioGuardado);
    });

    test('lanza error cuando el tipo de usuario es inválido', async () => {
      const usuarioJSON = {
        nombre: 'Test',
        mail: 'test@mail.com',
        telefono: '123',
        tipo: 'TIPO_INVALIDO',
      };

      await expect(usuarioService.crear(usuarioJSON)).rejects.toThrow(
        'Tipo de usuario no válido, posible falla de zod'
      );

      expect(usuarioRepositoryMock.save).not.toHaveBeenCalled();
    });

    test('el Usuario creado tiene los parámetros correctos', async () => {
      const usuarioJSON = {
        nombre: 'Ana',
        mail: 'ana@mail.com',
        telefono: '111222333',
        tipo: 'COMPRADOR',
      };
      usuarioRepositoryMock.save.mockImplementation((usuario) => {
        expect(usuario.nombre).toBe(usuarioJSON.nombre);
        expect(usuario.mail).toBe(usuarioJSON.mail);
        expect(usuario.telefono).toBe(usuarioJSON.telefono);
        expect(usuario.tipo).toBe(usuarioJSON.tipo);
        return { id: 40, ...usuarioJSON };
      });

      await usuarioService.crear(usuarioJSON);

      expect(usuarioRepositoryMock.save).toHaveBeenCalledTimes(1);
    });

    test('maneja tipos de usuario en diferentes casos', async () => {
      const casos = ['ADMIN', 'COMPRADOR', 'VENDEDOR'];

      for (const tipo of casos) {
        usuarioRepositoryMock.save.mockResolvedValue({ id: 1 });

        const usuarioJSON = {
          nombre: 'Test',
          mail: 'test@test.com',
          telefono: '123',
          tipo: tipo,
        };

        await expect(usuarioService.crear(usuarioJSON)).resolves.toBeDefined();
      }
    });
  });

  describe('Casos edge', () => {
    test('findById con ID undefined', async () => {
      usuarioRepositoryMock.findById.mockResolvedValue(undefined);

      const result = await usuarioService.findById(undefined);

      expect(result).toBeUndefined();
      expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(undefined);
    });

    test('validarUsuarioId con ID null', async () => {
      usuarioRepositoryMock.findById.mockResolvedValue(null);

      await expect(usuarioService.validarUsuarioId(null)).rejects.toThrow(
        UsuarioNotFoundError
      );
    });

    test('crear con tipo null lanza error', async () => {
      const usuarioJSON = {
        nombre: 'Test',
        mail: 'test@mail.com',
        telefono: '123',
        tipo: null,
      };

      await expect(usuarioService.crear(usuarioJSON)).rejects.toThrow(
        'Tipo de usuario no válido, posible falla de zod'
      );
    });

    test('crear con tipo undefined lanza error', async () => {
      const usuarioJSON = {
        nombre: 'Test',
        mail: 'test@mail.com',
        telefono: '123',
        tipo: undefined,
      };

      await expect(usuarioService.crear(usuarioJSON)).rejects.toThrow(
        'Tipo de usuario no válido, posible falla de zod'
      );
    });
  });
});
