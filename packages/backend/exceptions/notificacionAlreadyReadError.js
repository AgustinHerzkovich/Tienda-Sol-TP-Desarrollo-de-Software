export default class NotificacionAlreadyReadError extends Error {
  constructor(notificacionId) {
    super(`La notificación con id ${notificacionId} ya estaba leída.`);
    this.name = 'NotificacionAlreadyReadError';
    this.notificacionId = notificacionId;
    this.statusCode = 400;
  }
}
