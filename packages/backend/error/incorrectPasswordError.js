import AppError from './appError.js';

export default class IncorrectPasswordError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}