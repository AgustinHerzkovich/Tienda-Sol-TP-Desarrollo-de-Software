import { UsuarioModel } from '../schemas/mongooseSchemas/usuarioSchema.js';
import Repository from './repository.js';

export default class UsuarioRepository extends Repository {
  constructor() {
    super(UsuarioModel);
  }

  async findByEmail(email) {
    return this.model.findOne({ email });
  }
  async deleteDireccion(idUsuario, idDireccion) {
    return await UsuarioModel.updateOne(
      { _id: idUsuario },
      { $pull: { direcciones: { _id: idDireccion } } }
    );
  }
    async agregarDireccionYReturnDireccionConId(idUsuario, direccion) {
      const usuario = await UsuarioModel.findByIdAndUpdate(
        idUsuario,
        { $push: { direcciones: direccion } },
        { new: true, runValidators: true }
      );
      if (!usuario) throw new Error('Usuario no encontrado');
      return usuario.direcciones.at(usuario.direcciones.length - 1);
  }
}
