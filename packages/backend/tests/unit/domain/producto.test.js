import Producto from '../../../models/producto.js';
import Usuario from '../../../models/usuario.js';
import Categoria from '../../../models/categoria.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import { Moneda } from '../../../models/moneda.js';
import ProductoOutOfStockError from '../../../error/productoOutOfStockError.js';

describe('Tests unitarios de producto', () => {
  let vendedor;

  beforeAll(() => {
    vendedor = new Usuario(
      'Carlos',
      'carlos@test.com',
      '123456789',
      TipoUsuario.VENDEDOR
    );
  });

  // Helper function para crear productos frescos en cada test
  const crearProducto = (stock = 11) => {
    return new Producto(
      vendedor,
      'Black Rock',
      'hace pium pium',
      [new Categoria('arma')],
      200,
      Moneda.DOLAR_USA,
      stock,
      ['https://url.com'],
      true
    );
  };

  describe('Constructor e inicialización', () => {
    test('Se crea el producto correctamente con todos los parámetros', () => {
      const producto = crearProducto();

      expect(producto.vendedor).toBe(vendedor);
      expect(producto.titulo).toBe('Black Rock');
      expect(producto.descripcion).toBe('hace pium pium');
      expect(producto.categorias).toHaveLength(1);
      expect(producto.precio).toBe(200);
      expect(producto.moneda).toBe(Moneda.DOLAR_USA);
      expect(producto.stock).toBe(11);
      expect(producto.fotos).toEqual(['https://url.com']);
      expect(producto.activo).toBe(true);
    });

    test('Se inicializa cantidadVentas en 0', () => {
      const producto = crearProducto();
      expect(producto.cantidadVentas).toBe(0);
    });
  });

  describe('Disponibilidad de stock', () => {
    test('El producto está disponible si la cantidad pedida es menor al stock', () => {
      const producto = crearProducto(11);
      expect(producto.estaDisponible(10)).toBe(true);
    });

    test('El producto está disponible si la cantidad pedida es igual al stock', () => {
      const producto = crearProducto(10);
      expect(producto.estaDisponible(10)).toBe(true);
    });

    test('El producto no está disponible si la cantidad pedida es mayor al stock', () => {
      const producto = crearProducto(11);
      expect(producto.estaDisponible(12)).toBe(false);
    });

    test('El producto está disponible para cantidad 0', () => {
      const producto = crearProducto(5);
      expect(producto.estaDisponible(0)).toBe(true);
    });

    test('Producto sin stock no está disponible', () => {
      const producto = crearProducto(0);
      expect(producto.estaDisponible(1)).toBe(false);
    });
  });

  describe('Reducción de stock', () => {
    test('La cantidad de stock se reduce adecuadamente', () => {
      const producto = crearProducto(11);
      producto.reducirStock(1);
      expect(producto.stock).toBe(10);
    });

    test('Se puede reducir todo el stock', () => {
      const producto = crearProducto(5);
      producto.reducirStock(5);
      expect(producto.stock).toBe(0);
    });

    test('Se puede reducir stock en 0 (no afecta)', () => {
      const producto = crearProducto(10);
      producto.reducirStock(0);
      expect(producto.stock).toBe(10);
    });

    test('Se produce un error al intentar reducir más stock del disponible', () => {
      const producto = crearProducto(10);
      expect(() => producto.reducirStock(11)).toThrow(ProductoOutOfStockError);
    });

    test('Se produce un error al intentar reducir stock cuando está en 0', () => {
      const producto = crearProducto(0);
      expect(() => producto.reducirStock(1)).toThrow(ProductoOutOfStockError);
    });
  });

  describe('Aumento de stock', () => {
    test('La cantidad de stock se aumenta adecuadamente', () => {
      const producto = crearProducto(10);
      producto.aumentarStock(2);
      expect(producto.stock).toBe(12);
    });

    test('Se puede aumentar stock en 0 (no afecta)', () => {
      const producto = crearProducto(10);
      producto.aumentarStock(0);
      expect(producto.stock).toBe(10);
    });

    test('Se puede aumentar stock desde 0', () => {
      const producto = crearProducto(0);
      producto.aumentarStock(5);
      expect(producto.stock).toBe(5);
    });
  });

  describe('Aumento de ventas', () => {
    test('La cantidad de ventas se aumenta adecuadamente', () => {
      const producto = crearProducto();
      producto.aumentarVentas(1);
      expect(producto.cantidadVentas).toBe(1);
    });

    test('Se pueden aumentar múltiples ventas', () => {
      const producto = crearProducto();
      producto.aumentarVentas(5);
      producto.aumentarVentas(3);
      expect(producto.cantidadVentas).toBe(8);
    });

    test('Se puede aumentar ventas en 0 (no afecta)', () => {
      const producto = crearProducto();
      producto.aumentarVentas(0);
      expect(producto.cantidadVentas).toBe(0);
    });
  });

  describe('Operaciones combinadas', () => {
    test('Reducir stock y aumentar ventas funciona correctamente', () => {
      const producto = crearProducto(10);
      producto.reducirStock(3);
      producto.aumentarVentas(3);

      expect(producto.stock).toBe(7);
      expect(producto.cantidadVentas).toBe(3);
    });
  });
});
