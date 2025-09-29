import UsuarioService from '../../../services/usuarioService.js';
import Usuario from '../../../models/usuario.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import NotFoundError from '../../../error/notFoundError.js';
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
  describe('findById', () => {
    test('devuelve el usuario cuando existe', async () => {
      const usuario = {
        nombre: 'juan',
        email: 'mail@mail.com',
        telefono: '35',
        tipo: TipoUsuario.COMPRADOR,
        id: 1,
      };
      usuarioRepositoryMock.findById.mockResolvedValue(usuario);

      const result = await usuarioService.findById(1);

      expect(result).toEqual(usuario);
      expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(1);
    });

    test('tira error cuando el usuario no existe', async () => {
      await expect(usuarioService.findById(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('crear', () => {
    test('crea un Usuario ADMIN correctamente', async () => {
      const usuarioJSON = {
        nombre: 'María',
        email: 'maria@mail.com',
        telefono: '123456789',
        tipo: 'ADMIN',
      };
      const usuarioGuardado = { id: 10, ...usuarioJSON };
      usuarioRepositoryMock.create.mockResolvedValue(usuarioGuardado);

      const result = await usuarioService.crear(usuarioJSON);

      expect(usuarioRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(usuarioRepositoryMock.create).toHaveBeenCalledWith(
        expect.any(Usuario)
      );
      expect(result).toEqual(usuarioGuardado);
    });

    test('crea un Usuario COMPRADOR correctamente', async () => {
      const usuarioJSON = {
        nombre: 'Juan',
        email: 'juan@mail.com',
        telefono: '987654321',
        tipo: 'COMPRADOR',
      };
      const usuarioGuardado = { id: 20, ...usuarioJSON };
      usuarioRepositoryMock.create.mockResolvedValue(usuarioGuardado);

      const result = await usuarioService.crear(usuarioJSON);

      expect(usuarioRepositoryMock.create).toHaveBeenCalledWith(
        expect.any(Usuario)
      );
      expect(result).toEqual(usuarioGuardado);
    });

    test('crea un Usuario VENDEDOR correctamente', async () => {
      const usuarioJSON = {
        nombre: 'Carlos',
        email: 'carlos@mail.com',
        telefono: '555123456',
        tipo: 'VENDEDOR',
      };
      const usuarioGuardado = { id: 30, ...usuarioJSON };
      usuarioRepositoryMock.create.mockResolvedValue(usuarioGuardado);

      const result = await usuarioService.crear(usuarioJSON);

      expect(usuarioRepositoryMock.create).toHaveBeenCalledWith(
        expect.any(Usuario)
      );
      expect(result).toEqual(usuarioGuardado);
    });

    test('lanza error cuando el tipo de usuario es inválido', async () => {
      const usuarioJSON = {
        nombre: 'Test',
        email: 'test@mail.com',
        telefono: '123',
        tipo: 'TIPO_INVALIDO',
      };

      await expect(usuarioService.crear(usuarioJSON)).rejects.toThrow(
        'Tipo de usuario no válido, posible falla de zod'
      );

      expect(usuarioRepositoryMock.create).not.toHaveBeenCalled();
    });

    test('el Usuario creado tiene los parámetros correctos', async () => {
      const usuarioJSON = {
        nombre: 'Ana',
        email: 'ana@mail.com',
        telefono: '111222333',
        tipo: 'COMPRADOR',
      };
      usuarioRepositoryMock.create.mockImplementation((usuario) => {
        expect(usuario.nombre).toBe(usuarioJSON.nombre);
        expect(usuario.email).toBe(usuarioJSON.email);
        expect(usuario.telefono).toBe(usuarioJSON.telefono);
        expect(usuario.tipo).toBe(usuarioJSON.tipo);
        return { id: 40, ...usuarioJSON };
      });

      await usuarioService.crear(usuarioJSON);

      expect(usuarioRepositoryMock.create).toHaveBeenCalledTimes(1);
    });

    test('maneja tipos de usuario en diferentes casos', async () => {
      const casos = ['ADMIN', 'COMPRADOR', 'VENDEDOR'];

      for (const tipo of casos) {
        usuarioRepositoryMock.create.mockResolvedValue({ id: 1 });

        const usuarioJSON = {
          nombre: 'Test',
          email: 'test@test.com',
          telefono: '123',
          tipo: tipo,
        };

        await expect(usuarioService.crear(usuarioJSON)).resolves.toBeDefined();
      }
    });
  });

  describe('Casos edge', () => {
    test('findById con ID undefined lanza error', async () => {
      await expect(usuarioService.findById(undefined)).rejects.toThrow(
        NotFoundError
      );
    });

    test('crear con tipo null lanza error', async () => {
      const usuarioJSON = {
        nombre: 'Test',
        email: 'test@mail.com',
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
        email: 'test@mail.com',
        telefono: '123',
        tipo: undefined,
      };

      await expect(usuarioService.crear(usuarioJSON)).rejects.toThrow(
        'Tipo de usuario no válido, posible falla de zod'
      );
    });
  });
});
