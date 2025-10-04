import ItemPedido from '../../../models/itemPedido.js';
import Usuario from '../../../models/usuario.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import Producto from '../../../models/producto.js';
import Categoria from '../../../models/categoria.js';
import { Moneda } from '../../../models/moneda.js';

describe('Tests unitarios de itemPedido', () => {
  let vendedor;
  let producto;

  beforeAll(() => {
    vendedor = new Usuario(
      'Carlos',
      'carlos123@gmail.com',
      '1184710281',
      TipoUsuario.VENDEDOR
    );
  });

  const crearProducto = (precio = 5000, stock = 100) => {
    return new Producto(
      vendedor,
      'Producto Test',
      'descripcion test',
      [new Categoria('test')],
      precio,
      Moneda.PESO_ARG,
      stock,
      ['http://localhost:8000/api-docs'],
      true
    );
  };

  describe('Constructor e inicialización', () => {
    test('Se crea el itemPedido correctamente con todos los parámetros', () => {
      const producto = crearProducto(1000, 50);
      const itemPedido = new ItemPedido(producto, 5);

      expect(itemPedido.producto).toBe(producto);
      expect(itemPedido.cantidad).toBe(5);
      expect(itemPedido.precioUnitario).toBe(1000);
    });

    test('El precio unitario se toma del producto al momento de creación', () => {
      const producto = crearProducto(2500, 10);
      const itemPedido = new ItemPedido(producto, 3);

      expect(itemPedido.precioUnitario).toBe(2500);
    });
  });

  describe('Cálculo de subtotal', () => {
    test('El subtotal se calcula correctamente (cantidad * precio)', () => {
      const producto = crearProducto(5000, 100);
      const itemPedido = new ItemPedido(producto, 10);

      expect(itemPedido.subtotal()).toBe(50000);
    });

    test('Subtotal con cantidad 1', () => {
      const producto = crearProducto(1500, 100);
      const itemPedido = new ItemPedido(producto, 1);

      expect(itemPedido.subtotal()).toBe(1500);
    });

    test('Subtotal con cantidad 0 es 0', () => {
      const producto = crearProducto(1000, 100);
      const itemPedido = new ItemPedido(producto, 0);

      expect(itemPedido.subtotal()).toBe(0);
    });

    test('Subtotal con precio 0 es 0', () => {
      const producto = crearProducto(0, 100);
      const itemPedido = new ItemPedido(producto, 5);

      expect(itemPedido.subtotal()).toBe(0);
    });

    test('Subtotal con cantidades grandes', () => {
      const producto = crearProducto(10000000000000000000000, 100000000000000);
      const itemPedido = new ItemPedido(producto, 50000000000);

      expect(itemPedido.subtotal()).toBe(500000000000000000000000000000000);
    });
  });

  describe('Validación de stock', () => {
    test('tieneStock retorna true cuando hay stock suficiente', () => {
      const producto = crearProducto(1000, 20);
      const itemPedido = new ItemPedido(producto, 10);

      expect(itemPedido.tieneStock()).toBe(true);
    });

    test('tieneStock retorna true cuando la cantidad es igual al stock', () => {
      const producto = crearProducto(1000, 15);
      const itemPedido = new ItemPedido(producto, 15);

      expect(itemPedido.tieneStock()).toBe(true);
    });

    test('tieneStock retorna false cuando no hay stock suficiente', () => {
      const producto = crearProducto(1000, 5);
      const itemPedido = new ItemPedido(producto, 10);

      expect(itemPedido.tieneStock()).toBe(false);
    });

    test('tieneStock retorna true para cantidad 0', () => {
      const producto = crearProducto(1000, 0);
      const itemPedido = new ItemPedido(producto, 0);

      expect(itemPedido.tieneStock()).toBe(true);
    });

    test('tieneStock retorna false cuando el producto no tiene stock', () => {
      const producto = crearProducto(1000, 0);
      const itemPedido = new ItemPedido(producto, 1);

      expect(itemPedido.tieneStock()).toBe(false);
    });
  });

  describe('Casos edge', () => {
    test('Hay stock si se pide 0 cuando hay 0', () => {
      const producto = crearProducto(100, 0);
      const itemPedido = new ItemPedido(producto, 0);

      expect(itemPedido.subtotal()).toBe(0);
      expect(itemPedido.tieneStock()).toBe(true);
    });

    test('ItemPedido mantiene referencia al producto original', () => {
      const producto = crearProducto(1000, 10);
      const itemPedido = new ItemPedido(producto, 5);

      // Modificar el producto después de crear el item
      producto.precio = 2000;

      // El precio unitario del item no debería cambiar
      expect(itemPedido.precioUnitario).toBe(1000);
      expect(itemPedido.subtotal()).toBe(5000);
    });
  });
});
