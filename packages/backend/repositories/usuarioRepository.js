import { UsuarioModel } from '../schemas/mongooseSchemas/usuarioSchema.js';

export default class UsuarioRepository extends Repository {
  constructor() {
    super(UsuarioModel)
  }
}
