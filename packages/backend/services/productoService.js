import Producto from '../models/producto.js';

export default class ProductoService {
  constructor(productoRepository, usuarioService) {
    this.productoRepository = productoRepository;
    this.usuarioService = usuarioService;
  }

  toDTO(producto) {
    return {
      id: producto.id || producto._id,
      vendedor: producto.vendedor,
      titulo: producto.titulo,
      descripcion: producto.descripcion,
      categorias: producto.categorias,
      precio: producto.precio,
      moneda: producto.moneda,
      stock: producto.stock,
      fotos: producto.fotos,
    };
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

    producto = await this.productoRepository.create(producto);

    return this.toDTO(producto);
  }

  async findById(id) {
    const producto = await this.productoRepository.findById(id);
    return this.toDTO(producto);
  }

  async findByVendedorId(userId, filtros, paginacion) {
    const productos = await this.productoRepository.findByVendedorId(
      userId,
      filtros,
      paginacion
    );
    return productos.map((producto) => this.toDTO(producto));
  }

  async modificarStock(producto, cantidad) {
    if (cantidad > 0) {
      producto.aumentarStock(cantidad);
    } else {
      producto.reducirStock(Math.abs(cantidad));
    }
    await this.productoRepository.update(producto.id, producto);
  }

  async aumentarVentas(producto, cantidad) {
    producto.aumentarVentas(cantidad);
    await this.productoRepository.update(producto.id, producto);
  }
}
