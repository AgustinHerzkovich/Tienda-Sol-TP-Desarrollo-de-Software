import AppError from "./appError.js";

export default class UserAlreadyExists extends AppError {
  constructor(email) {
    super(`Ya existe un usuario con el email: ${email}`, 409);
  }
}
