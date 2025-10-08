import Producto from '../models/producto.js';
import NotFoundError from '../error/notFoundError.js';
import { TipoUsuario } from '../models/tipoUsuario.js';
import InvalidUserTypeError from '../error/invalidUserTypeError.js';

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

    if (vendedor.tipo !== TipoUsuario.VENDEDOR) {
      throw new InvalidUserTypeError(
        'No se puede crear un producto con un usuario que no es de tipo vendedor'
      );
    }

    let producto = new Producto(
      productoJSON.vendedorId,
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
    const producto = await this.findObjectById(id);
    return this.toDTO(producto);
  }

  async findObjectById(id) {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new NotFoundError(`Producto con id: ${id} no encontrado`);
    }

    return producto;
  }

  async findByVendedorId(userId, filtros, paginacion) {
    const resultado = await this.productoRepository.findByVendedorId(
      userId,
      filtros,
      paginacion
    );

    // El repository retorna { productos: [...], pagination: {...} }
    return {
      productos: resultado.productos.map((producto) => this.toDTO(producto)),
      pagination: resultado.pagination,
    };
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
