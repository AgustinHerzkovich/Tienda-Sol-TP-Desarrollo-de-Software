import AppError from './appError.js';

export default class NotificacionAlreadyReadError extends AppError {
  constructor(notificacionId) {
    super(`La notificación con id ${notificacionId} ya estaba leída.`, 500);
  }
}
