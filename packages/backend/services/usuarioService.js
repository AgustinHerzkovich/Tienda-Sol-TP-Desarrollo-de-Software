import UsuarioNotFoundError from '../exceptions/usuarioNotFoundError.js';
import Usuario from '../models/usuario.js';
import { TipoUsuario } from '../models/tipoUsuario.js';

export default class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async validarUsuarioId(usuarioId) {
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new UsuarioNotFoundError('Usuario no encontrado');
    }
  }

  async findById(usuarioId) {
    return this.usuarioRepository.findById(usuarioId);
  }

  async crear(usuarioJSON) {
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
    const usuario = new Usuario(
      usuarioJSON.nombre,
      usuarioJSON.mail,
      usuarioJSON.telefono,
      usuarioJSON.tipo
    );
    return await this.usuarioRepository.save(usuario);
  }
}
