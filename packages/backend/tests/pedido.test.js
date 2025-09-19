import Pedido from '../models/pedido.js';
import Usuario from '../models/usuario.js';
import Producto from '../models/producto.js';
import ItemPedido from '../models/itemPedido.js';
import { TipoUsuario } from '../models/tipoUsuario.js';
import { Moneda } from '../models/moneda.js';
import DireccionEntrega from '../models/direccionEntrega.js';
import { EstadoPedido } from '../models/estadoPedido.js';
import Categoria from '../models/categoria.js';

describe('pruebas de pedido', () => {
  let pedido;
  let vendedor;
  beforeAll(() => {
    const comprador = new Usuario(
      'Fabian',
      'fabian123@gmail.com',
      '1192871245',
      TipoUsuario.COMPRADOR
    );
    vendedor = new Usuario(
      'Carlos',
      'carlos123@gmail.com',
      '1184710281',
      TipoUsuario.VENDEDOR
    );
    const producto1 = new Producto(
      vendedor,
      'Producto 1',
      'descripcion x',
      [new Categoria('inmueble')],
      5000,
      Moneda.PESO_ARG,
      100,
      ['http://localhost:8000/api-docs'],
      true
    );
    const producto2 = new Producto(
      vendedor,
      'Producto 2',
      'descripcion y',
      [new Categoria('inmueble')],
      10000,
      Moneda.PESO_ARG,
      100,
      ['http://localhost:8000/api-docs'],
      true
    );
    const items = [
      new ItemPedido(producto1, 10),
      new ItemPedido(producto2, 20),
    ];
    const direccionEntrega = new DireccionEntrega(
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j'
    );
    pedido = new Pedido(comprador, items, Moneda.PESO_ARG, direccionEntrega);
  });

  test('El total del pedido es 250000', () => {
    expect(pedido.calcularTotal()).toBe(250000);
  });

  test('El pedido tiene stock', () => {
    expect(pedido.validarStock()).toBe(true);
  });

  test('Se actualiza el estado del pedido a CONFIRMADO', () => {
    pedido.actualizarEstado(EstadoPedido.CONFIRMADO, vendedor, 'Motivo x');
    expect(pedido.estado).toBe(EstadoPedido.CONFIRMADO);
    expect(pedido.historialEstados.length).toBe(1);
  });
});
