import UsuarioService from '../../../services/usuarioService.js';
import Usuario from '../../../models/usuario.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import NotFoundError from '../../../error/notFoundError.js';
import bcrypt from 'bcrypt';
import { jest } from '@jest/globals';

describe('UsuarioService', () => {
  let usuarioService;
  let usuarioRepositoryMock;

  beforeEach(() => {
    usuarioRepositoryMock = {
      findById: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      find: jest.fn(),
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

  describe('find', () => {
    test('devuelve todos los usuarios cuando no se proporciona email', async () => {
      const usuarios = [
        {
          nombre: 'juan',
          email: 'juan@mail.com',
          telefono: '35',
          tipo: TipoUsuario.COMPRADOR,
          id: 1,
        },
        {
          nombre: 'maria',
          email: 'maria@mail.com',
          telefono: '36',
          tipo: TipoUsuario.VENDEDOR,
          id: 2,
        },
      ];
      usuarioRepositoryMock.find.mockResolvedValue(usuarios);

      const result = await usuarioService.find();

      expect(result).toEqual(usuarios);
      expect(usuarioRepositoryMock.find).toHaveBeenCalled();
      expect(usuarioRepositoryMock.findByEmail).not.toHaveBeenCalled();
    });

    test('lanza error cuando se proporciona email sin password', async () => {
      await expect(usuarioService.find('juan@mail.com', null)).rejects.toThrow(
        'La contraseña es obligatoria cuando se proporciona un email'
      );
      await expect(usuarioService.find('juan@mail.com', '')).rejects.toThrow(
        'La contraseña es obligatoria cuando se proporciona un email'
      );
    });

    test('devuelve un usuario específico cuando se proporciona email y password correcta', async () => {
      const usuario = {
        nombre: 'juan',
        email: 'juan@mail.com',
        telefono: '35',
        tipo: TipoUsuario.COMPRADOR,
        id: 1,
        password: await bcrypt.hash('password123', 10),
      };
      usuarioRepositoryMock.findByEmail.mockResolvedValue(usuario);

      const result = await usuarioService.find('juan@mail.com', 'password123');

      expect(result).toEqual({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        tipo: usuario.tipo,
      });
      expect(usuarioRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'juan@mail.com'
      );
      expect(usuarioRepositoryMock.find).not.toHaveBeenCalled();
    });

    test('tira error cuando el usuario con email no existe', async () => {
      usuarioRepositoryMock.findByEmail.mockResolvedValue(null);

      await expect(
        usuarioService.find('noexiste@mail.com', 'password123')
      ).rejects.toThrow(NotFoundError);
      expect(usuarioRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'noexiste@mail.com'
      );
    });

    test('tira error con mensaje específico cuando el usuario con email no existe', async () => {
      usuarioRepositoryMock.findByEmail.mockResolvedValue(null);

      await expect(
        usuarioService.find('test@test.com', 'password123')
      ).rejects.toThrow('Usuario con email: test@test.com no encontrado');
    });

    test('tira error cuando la password es incorrecta', async () => {
      const usuario = {
        nombre: 'juan',
        email: 'juan@mail.com',
        telefono: '35',
        tipo: TipoUsuario.COMPRADOR,
        id: 1,
        password: await bcrypt.hash('password123', 10),
      };
      usuarioRepositoryMock.findByEmail.mockResolvedValue(usuario);

      await expect(
        usuarioService.find('juan@mail.com', 'wrongpassword')
      ).rejects.toThrow('Contraseña incorrecta');
    });

    test('devuelve array vacío cuando no hay usuarios', async () => {
      usuarioRepositoryMock.find.mockResolvedValue([]);

      const result = await usuarioService.find();

      expect(result).toEqual([]);
      expect(usuarioRepositoryMock.find).toHaveBeenCalled();
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
      usuarioRepositoryMock.findByEmail.mockResolvedValue(null); // Usuario no existe
      usuarioRepositoryMock.create.mockResolvedValue(usuarioGuardado);

      const result = await usuarioService.crear(usuarioJSON);

      expect(usuarioRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'maria@mail.com'
      );
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
      usuarioRepositoryMock.findByEmail.mockResolvedValue(null); // Usuario no existe
      usuarioRepositoryMock.create.mockResolvedValue(usuarioGuardado);

      const result = await usuarioService.crear(usuarioJSON);

      expect(usuarioRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'juan@mail.com'
      );
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
      usuarioRepositoryMock.findByEmail.mockResolvedValue(null); // Usuario no existe
      usuarioRepositoryMock.create.mockResolvedValue(usuarioGuardado);

      const result = await usuarioService.crear(usuarioJSON);

      expect(usuarioRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'carlos@mail.com'
      );
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
      usuarioRepositoryMock.findByEmail.mockResolvedValue(null); // Usuario no existe

      await expect(usuarioService.crear(usuarioJSON)).rejects.toThrow(
        'Tipo de usuario no válido, posible falla de zod'
      );

      expect(usuarioRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'test@mail.com'
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
      usuarioRepositoryMock.findByEmail.mockResolvedValue(null); // Usuario no existe
      usuarioRepositoryMock.create.mockImplementation((usuario) => {
        expect(usuario.nombre).toBe(usuarioJSON.nombre);
        expect(usuario.email).toBe(usuarioJSON.email);
        expect(usuario.telefono).toBe(usuarioJSON.telefono);
        expect(usuario.tipo).toBe(usuarioJSON.tipo);
        return { id: 40, ...usuarioJSON };
      });

      await usuarioService.crear(usuarioJSON);

      expect(usuarioRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'ana@mail.com'
      );
      expect(usuarioRepositoryMock.create).toHaveBeenCalledTimes(1);
    });

    test('maneja tipos de usuario en diferentes casos', async () => {
      const casos = ['ADMIN', 'COMPRADOR', 'VENDEDOR'];

      for (const tipo of casos) {
        usuarioRepositoryMock.findByEmail.mockResolvedValue(null); // Usuario no existe
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
      usuarioRepositoryMock.findByEmail.mockResolvedValue(null); // Usuario no existe

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
      usuarioRepositoryMock.findByEmail.mockResolvedValue(null); // Usuario no existe

      await expect(usuarioService.crear(usuarioJSON)).rejects.toThrow(
        'Tipo de usuario no válido, posible falla de zod'
      );
    });
  });
});
