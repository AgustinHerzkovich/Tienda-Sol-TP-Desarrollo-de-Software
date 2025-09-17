import UsuarioNotFoundError from '../exceptions/usuarioNotFoundError.js';

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
}
