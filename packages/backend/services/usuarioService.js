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

    // Buscar usuario por email
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw new NotFoundError(`Usuario con email: ${email} no encontrado`);
    }

    // Si se proporciona password, verificarla (para login)
    // Si no se proporciona password, solo devolver el usuario (para recuperación de contraseña)
    if (password && password.trim() !== '') {
      // Verificar contraseña
      if (!(await bcrypt.compare(password, usuario.password))) {
        throw new IncorrectPasswordError('Contraseña incorrecta');
      }
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

  async actualizar(usuarioId, usuarioJSON) {
    let usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundError(`Usuario con id: ${usuarioId} no encontrado`);
    }

    const actualizaciones = {};

    if (usuarioJSON.nombre !== undefined) {
      actualizaciones.nombre = usuarioJSON.nombre;
    }
    if (usuarioJSON.email !== undefined) {
      // Verificar si el nuevo email ya está en uso por otro usuario
      const usuarioExistente = await this.usuarioRepository.findByEmail(
        usuarioJSON.email
      );
      if (usuarioExistente && usuarioExistente._id.toString() !== usuarioId) {
        throw new UserAlreadyExists(usuarioJSON.email);
      }
      actualizaciones.email = usuarioJSON.email;
    }
    if (usuarioJSON.telefono !== undefined) {
      actualizaciones.telefono = usuarioJSON.telefono;
    }
    if (usuarioJSON.tipo !== undefined) {
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
      actualizaciones.tipo = tipoUsuario;
    }
    if (usuarioJSON.password !== undefined) {
      // Hashear la nueva contraseña antes de guardarla
      actualizaciones.password = await bcrypt.hash(usuarioJSON.password, 10);
    }

    usuario = await this.usuarioRepository.update(usuarioId, actualizaciones);
    return this.toDTO(usuario);
  }
}
