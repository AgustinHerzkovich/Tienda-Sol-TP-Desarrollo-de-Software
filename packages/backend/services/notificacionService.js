import FactoryNotification from '../models/factoryNotificacion.js';

export default class NotificacionService {
  constructor(notificacionRepository) {
    this.notificacionRepository = notificacionRepository;
    this.notificationFactory = new FactoryNotification();
  }

  toDTO(notificacion) {
    return {
      id: notificacion.id || notificacion._id,
      usuarioDestino: notificacion.usuarioDestino,
      mensaje: notificacion.mensaje,
      leida: notificacion.leida,
    };
  }

  async notificarPedido(pedido) {
    const notificacion = this.notificationFactory.crearSegunPedido(pedido);
    notificacion = await this.notificacionRepository.save(notificacion);
    return this.toDTO(notificacion);
  }

  async findByUsuarioId(usuarioId, leido) {
    const notificacionesDeUsuario =
      await this.notificacionRepository.getAllByUserId(usuarioId);
    notificacionesDeUsuario = notificacionesDeUsuario.filter(
      (noti) => noti.leida === leido
    );
    return notificacionesDeUsuario.map((noti) => this.toDTO(noti));
  }

  async modificar(notificacionId, leidoJSON) {
    const notificacion =
      await this.notificacionRepository.getById(notificacionId);
    if (leidoJSON.read) {
      notificacion.marcarComoLeida();
    }
    notificacion = await this.notificacionRepository.save(notificacion);
    return this.toDTO(notificacion);
  }
}
