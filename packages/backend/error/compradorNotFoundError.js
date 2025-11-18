import AppError from './appError.js';

export default class CompradorNotFoundError extends AppError {
  constructor(message = 'El comprador no existe para este producto!') {
    super(message, 500);
  }
}