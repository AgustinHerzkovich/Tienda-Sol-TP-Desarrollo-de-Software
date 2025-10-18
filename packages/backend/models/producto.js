import ProductoOutOfStockError from '../error/productoOutOfStockError.js';
export default class Producto {
  id;
  vendedor;
  titulo;
  descripcion;
  categorias;
  precio;
  moneda;
  stock;
  fotos;
  activo;

  constructor(
    vendedor,
    titulo,
    descripcion,
    categorias,
    precio,
    moneda,
    stock,
    fotos,
    activo,
    cantidadVentas
  ) {
    this.vendedor = vendedor;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.categorias = categorias;
    this.precio = precio;
    this.moneda = moneda;
    this.stock = stock;
    this.fotos = fotos;
    this.activo = activo;
    this.cantidadVentas = 0;
  }

  estaDisponible(cantidad) {
    return this.stock >= cantidad;
  }

  reducirStock(cantidad) {
    if (!this.estaDisponible(cantidad)) {
      throw new ProductoOutOfStockError(this.id, cantidad);
    }
    this.stock -= cantidad;
  }

  aumentarStock(cantidad) {
    this.stock += cantidad;
  }

  aumentarVentas(cantidad) {
    this.cantidadVentas += cantidad;
  }
}
