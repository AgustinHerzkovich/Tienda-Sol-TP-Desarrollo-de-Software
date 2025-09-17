export default class UsuarioRepository {
  constructor() {
    this.usuarios = [];
  }

  async save(usuario) {
    usuario.id = crypto.randomUUID();
    this.usuarios.push(usuario);
    return usuario;
  }

  async findById(id) {
    const usuario = this.usuarios.find((user) => user.id === id);
    return usuario;
  }
}
