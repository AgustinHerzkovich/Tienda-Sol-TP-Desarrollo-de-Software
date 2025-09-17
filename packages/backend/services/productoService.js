export default class ProductoService {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async crear(producto) {
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
    producto.reducirStock(cantidad);
    await this.productoRepository.save(producto);
  }

  async aumentarVentas(producto, cantidad) {
    producto.aumentarVentas(cantidad);
    await this.productoRepository.save(producto);
  }
}
