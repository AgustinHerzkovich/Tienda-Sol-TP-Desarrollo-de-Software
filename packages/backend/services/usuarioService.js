import NotFoundError from '../error/notFoundError.js';
import UserAlreadyExists from '../error/userAlreadyExists.js';
import IncorrectPasswordError from '../error/incorrectPasswordError.js';
import PasswordRequiredError from '../error/passwordRequiredError.js';
import bcrypt from 'bcrypt';
import Usuario from '../models/usuario.js';
import { TipoUsuario } from '../models/tipoUsuario.js';

export default class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  toDTO(usuario) {
    return {
      id: usuario.id || usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      tipo: usuario.tipo,
    };
  }

  async findById(usuarioId) {
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundError(`Usuario con id: ${usuarioId} no encontrado`);
    }

    return this.toDTO(usuario);
  }

  async find(email = null, password = null) {
    // Si no se envía email, devolver todos los usuarios
    if (!email || email.trim() === '') {
      const usuarios = await this.usuarioRepository.find();
      return usuarios.map((usuario) => this.toDTO(usuario));
    }

    // Si se envía email, el password es obligatorio
    if (!password || password.trim() === '') {
      throw new PasswordRequiredError(
        'La contraseña es obligatoria cuando se proporciona un email'
      );
    }

    // Buscar usuario por email
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw new NotFoundError(`Usuario con email: ${email} no encontrado`);
    }

    // Verificar contraseña
    if (!(await bcrypt.compare(password, usuario.password))) {
      throw new IncorrectPasswordError('Contraseña incorrecta');
    }

    return this.toDTO(usuario);
  }

  async crear(usuarioJSON) {
    const usuarioExistente = await this.usuarioRepository.findByEmail(
      usuarioJSON.email
    );
    if (usuarioExistente) {
      throw new UserAlreadyExists(usuarioJSON.email);
    }

    let tipoUsuario;
    switch (usuarioJSON.tipo) {
      case 'COMPRADOR':
        tipoUsuario = TipoUsuario.COMPRADOR;
        break;
      case 'ADMIN':
        tipoUsuario = TipoUsuario.ADMIN;
        break;
      case 'VENDEDOR':
        tipoUsuario = TipoUsuario.VENDEDOR;
        break;
      default:
        throw new Error('Tipo de usuario no válido, posible falla de zod');
    }
    let usuario = new Usuario(
      usuarioJSON.nombre,
      usuarioJSON.email,
      usuarioJSON.telefono,
      usuarioJSON.tipo
    );
    usuario.password = usuarioJSON.password;
    usuario = await this.usuarioRepository.create(usuario);
    return this.toDTO(usuario);
  }
}
