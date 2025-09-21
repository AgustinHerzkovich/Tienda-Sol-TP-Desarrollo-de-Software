import Crypto from 'crypto';

export default class NotificacionRepository {
  constructor() {
    this.notifications = [];
  }

  async guardar(notification) {
    if (notification.id === undefined) {
    notification.id = Crypto.randomUUID();
    this.notifications.push(notification);
    } 
    return notification;
  }

  async save(notification) {
    //Base de batos, guardame el notification!
    return this.guardar(notification);
  }

  async getById(idBuscado) {
    this.notifications.find((notification) => notification.id === idBuscado);
  }
  async getAllByUserId(idBuscado) {
    this.notifications.filter(
      (notification) => notification.usuarioDestino.id === idBuscado
    );
  }
}
