export default class UsuarioNotFoundError extends Error {
  constructor(usuarioId) {
    super(`Usuario con id ${usuarioId} no encontrado`);
    this.name = 'UserNotFoundError';
    this.usuarioId = usuarioId;
    this.statusCode = 404;
  }
}
