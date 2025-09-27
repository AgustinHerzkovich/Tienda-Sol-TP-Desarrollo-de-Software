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
    let notificacion = this.notificationFactory.crearSegunPedido(pedido);
    notificacion = await this.notificacionRepository.create(notificacion);
    return this.toDTO(notificacion);
  }

  async findByUsuarioId(usuarioId, leido) {
    let notificacionesDeUsuario =
      await this.notificacionRepository.findByUserId(usuarioId);
    notificacionesDeUsuario = notificacionesDeUsuario.filter(
      (noti) => noti.leida === leido
    );
    return notificacionesDeUsuario.map((noti) => this.toDTO(noti));
  }

  async modificar(notificacionId, leidoJSON) {
    let notificacion =
      await this.notificacionRepository.findById(notificacionId);
    if (leidoJSON.read) {
      notificacion.marcarComoLeida();
    }
    notificacion = await this.notificacionRepository.update(
      notificacionId,
      notificacion
    );
    return this.toDTO(notificacion);
  }
}
