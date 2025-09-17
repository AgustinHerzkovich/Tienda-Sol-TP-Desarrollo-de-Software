export default class NotificacionNotFoundError extends Error {
  constructor(notificacionId) {
    super(`Notificacion con id ${notificacionId} no encontrada`);
    this.name = 'NotificacionNotFoundError';
    this.notificacionId = notificacionId;
    this.statusCode = 404;
  }
}
