import Producto from '../models/producto.js';

export default class ProductoService {
  constructor(productoRepository, usuarioService) {
    this.productoRepository = productoRepository;
    this.usuarioService = usuarioService;
  }

  async crear(productoJSON) {
    const vendedor = await this.usuarioService.findById(
      productoJSON.vendedorId
    );
    if (vendedor == undefined) {
      throw new Error('No existe el vendedor');
    }
    const producto = new Producto(
      vendedor,
      productoJSON.titulo,
      productoJSON.descripcion,
      productoJSON.categorias,
      productoJSON.precio,
      productoJSON.moneda,
      productoJSON.stock,
      productoJSON.fotos,
      productoJSON.activo
    );
    return await this.productoRepository.save(producto);
  }

  async findById(id) {
    return await this.productoRepository.findById(id);
  }

  async findByVendedorId(userId, filtros, paginacion) {
    const productos = await this.productoRepository.findByVendedorId(
      userId,
      filtros,
      paginacion
    );
    return productos;
  }

  async modificarStock(producto, cantidad) {
    if (cantidad > 0) {
      producto.aumentarStock(cantidad);
    }
    producto.reducirStock(Math.abs(cantidad));
    await this.productoRepository.save(producto);
  }

  async aumentarVentas(producto, cantidad) {
    producto.aumentarVentas(cantidad);
    await this.productoRepository.save(producto);
  }
}
