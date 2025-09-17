import FactoryNotification from '../models/factoryNotificacion.js';

export default class NotificacionService {
  constructor(notificacionRepository) {
    this.notificacionRepository = notificacionRepository;
    this.notificationFactory = new FactoryNotification();
  }

  async notificarPedido(pedido) {
    const notificacion = this.notificationFactory.crearSegunPedido(pedido);
    return await this.notificacionRepository.guardar(notificacion);
  }

  async findByUsuarioId(usuarioId, leido) {
    return await this.notificacionRepository
      .getAllByUserId(usuarioId)
      .filter((noti) => noti.leida === leido);
  }

  async modificar(notificacionId, leidoJSON) {
    const notificacion =
      await this.notificacionRepository.getById(notificacionId);
    notificacion.leida = leidoJSON.read;
    this.notificacionRepository.save(notificacion);
    return notificacion;
  }
}
