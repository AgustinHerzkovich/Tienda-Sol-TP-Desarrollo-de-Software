import { Console } from 'console';
import Crypto from 'crypto';

export default class UsuarioRepository {
  constructor() {
    this.usuarios = [];
  }

  async save(usuario) {
    if (usuario.id === undefined) {
      usuario.id = Crypto.randomUUID();
      this.usuarios.push(usuario);
    }
    return usuario;
  }

  async findById(id) {
    const usuario = this.usuarios.find((user) => user.id === id);
    return usuario;
  }
}
