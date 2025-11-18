import AppError from './appError.js';

export default class InvalidUserTypeError extends AppError {
  constructor(message) {
    super(message, 500);
  }
}
