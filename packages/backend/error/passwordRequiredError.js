import AppError from './appError.js';

export default class PasswordRequiredError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}
