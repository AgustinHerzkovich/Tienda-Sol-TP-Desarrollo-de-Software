import AppError from './appError.js';

export default class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 500);
  }
}
