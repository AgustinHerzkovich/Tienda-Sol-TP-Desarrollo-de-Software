import FactoryNotification from '../models/factoryNotificacion.js';

export default class NotificacionService {
  constructor(notificacionRepository) {
    this.notificacionRepository = notificacionRepository;
    this.notificationFactory = new FactoryNotification();
  }

  async notificarPedido(pedido) {
    const notificacion = this.notificationFactory.crearSegunPedido(pedido);
    return await this.notificacionRepository.save(notificacion);
  }

  async findByUsuarioId(usuarioId, leido) {
    const notificacionesDeUsuario =
      await this.notificacionRepository.getAllByUserId(usuarioId);
    return notificacionesDeUsuario.filter((noti) => noti.leida === leido);
  }

  async modificar(notificacionId, leidoJSON) {
    const notificacion =
      await this.notificacionRepository.getById(notificacionId);
    if (leidoJSON.read) {
      notificacion.marcarComoLeida();
    }
    this.notificacionRepository.save(notificacion);
    return notificacion;
  }
}
