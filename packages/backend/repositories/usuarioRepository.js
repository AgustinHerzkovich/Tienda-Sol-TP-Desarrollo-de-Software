import { UsuarioModel } from '../schemas/mongooseSchemas/usuarioSchema.js';
import Repository from './repository.js';

export default class UsuarioRepository extends Repository {
  constructor() {
    super(UsuarioModel)
  }
}
