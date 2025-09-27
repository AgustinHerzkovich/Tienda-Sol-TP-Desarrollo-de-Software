import { UsuarioModel } from '../schemas/mongooseSchemas/usuarioSchema.js';

export default class UsuarioRepository {
  constructor() {
    this.model = UsuarioModel;
  }

  async create(usuario) {
    const usuarioGuardado = new this.model(usuario);
    return await usuarioGuardado.save();
  }

  async findById(id) {
    return await this.model.findById(id);
  }
}
