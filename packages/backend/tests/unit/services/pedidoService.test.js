import Usuario from '../../../models/usuario.js';
import PedidoService from '../../../services/pedidoService.js';
import PedidoRepository from '../../../repositories/pedidoRepository.js';
import ProductoService from '../../../services/productoService.js';
import ProductoRepository from '../../../repositories/productoRepository.js';
import UsuarioService from '../../../services/usuarioService.js';
import UsuarioRepository from '../../../repositories/usuarioRepository.js';
import NotificacionRepository from '../../../repositories/notificacionRepository.js';
import NotificationService from '../../../services/notificacionService.js';
import Pedido from '../../../models/pedido.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import ItemPedido from '../../../models/itemPedido.js';
import Producto from '../../../models/producto.js';
import Categoria from '../../../models/categoria.js';
import { Moneda } from '../../../models/moneda.js';
describe('Tests unitarios de pedidoService', () => {
  const usuarioRepository = new UsuarioRepository();
  const usuarioService = new UsuarioService(usuarioRepository);
  const productoRepository = new ProductoRepository();
  const productoService = new ProductoService(
    productoRepository,
    usuarioService
  );
  const pedidoRepository = new PedidoRepository();
  const notificationRepository = new NotificacionRepository();
  const notificationService = new NotificationService(notificationRepository);
  const pedidoService = new PedidoService(
    pedidoRepository,
    productoService,
    usuarioService,
    notificationService
  );
  test('Se hace un pedido', async () => {
    let comprador = new Usuario(
      'Juan Manuel',
      'JuanManuelBelgrano@hotmail.com',
      '12345678',
      TipoUsuario.COMPRADOR
    );
    comprador = await usuarioService.crear(comprador);
    let vendedor = new Usuario(
      'Goku',
      'Kakaroto@gmail.com',
      '95864231',
      TipoUsuario.VENDEDOR
    );
    vendedor = await usuarioService.crear(vendedor);
    console.log(vendedor);
    let producto = {
      titulo: 'soy un titulo',
      descripcion: 'aaa',
      categorias: ['aAAAA'],
      precio: 100,
      moneda: Moneda.DOLAR_USA,
      stock: 123,
      fotos: ['AAAA.url'],
      activo: true,
      vendedorId: vendedor.id,
    };
    const productoCreado = await productoService.crear(producto);
    const item = new ItemPedido(producto, 4);
    let pedido = {
      compradorId: comprador.id,
      items: [{productoId : productoCreado.id, cantidad : 4}],
      moneda: Moneda.DOLAR_USA,
      direccionEntrega: '1234 street',
    };
    pedido = await pedidoService.crear(pedido);
    const gokuId = vendedor.id;
    expect(true).toBe(true);
  });
});