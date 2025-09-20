import ItemPedido from '../../models/itemPedido.js';
import Usuario from '../../models/usuario.js';
import { TipoUsuario } from '../../models/tipoUsuario.js';
import Producto from '../../models/producto.js';
import Categoria from '../../models/categoria.js';
import { Moneda } from '../../models/moneda.js';

describe('Tests unitarios de itemPedido', () => {
  const vendedor = new Usuario(
    'Carlos',
    'carlos123@gmail.com',
    '1184710281',
    TipoUsuario.VENDEDOR
  );

  const producto = new Producto(
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

  const itemPedido = new ItemPedido(producto, 10);

  test('El subtotal del itemPedido es 50000', () => {
    expect(itemPedido.subtotal()).toBe(50000);
  });
});
