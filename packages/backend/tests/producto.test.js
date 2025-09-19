import Producto from '../models/producto.js';
import Categoria from '../models/categoria.js';
import { Moneda } from '../models/moneda.js';

describe('Tests unitarios de productos', () => {
  let producto = new Producto(
    'Black Rock',
    '9mm',
    'hace pium pium',
    [new Categoria('arma')],
    200,
    Moneda.DOLAR_USA,
    11,
    'url a la foto',
    true
  );

  test('El producto esta disponible si la cantidad pedida es menor al stock', () => {
    expect(producto.estaDisponible(10)).toBe(true);
  });

  test('El producto nos esta disponible si la cantidad pedida es amyor al stock', () => {
    expect(producto.estaDisponible(12)).toBe(false);
  });

  test('La cantidad de stokc se reduce adecuadamente', () => {
    producto.reducirStock(1);
    expect(producto.stock).toBe(10);
  });

  test('La cantidad de stock se aumenta adecuadamente', () => {
    producto.aumentarStock(2);
    expect(producto.stock).toBe(12);
  });

  test('La cantidad de ventas se aumenta adecuadamente', () => {
    producto.aumentarVentas(1);
    expect(producto.cantidadVentas).toBe(1);
  });
});
