import { ProductoModel } from '../schemas/mongooseSchemas/productoSchema.js';

export default class productoRepository {
  constructor() {
    this.model = ProductoModel;
  }

  async create(producto) {
    const productoGuardado = new this.model(producto);
    return await productoGuardado.save();
  }

  async update(id, producto) {
    return await this.model.findByIdAndUpdate(id, producto, { new: true });
  }

  async findById(idBuscado) {
    return await this.model.findById(idBuscado);
  }

  async findByVendedorId(vendedorId, filtros = {}, paginacion = {}) {
    // Construir el filtro base
    const query = { 'vendedor.id': vendedorId };

    // Filtros adicionales
    if (filtros.titulo) {
      query.titulo = { $regex: filtros.titulo, $options: 'i' };
    }

    if (filtros.categoria) {
      query.categorias = {
        $elemMatch: { nombre: { $regex: filtros.categoria, $options: 'i' } },
      };
    }

    if (filtros.descripcion) {
      query.descripcion = { $regex: filtros.descripcion, $options: 'i' };
    }

    // Rango de precios
    if (filtros.minPrecio || filtros.maxPrecio) {
      query.precio = {};
      if (filtros.minPrecio) query.precio.$gte = parseFloat(filtros.minPrecio);
      if (filtros.maxPrecio) query.precio.$lte = parseFloat(filtros.maxPrecio);
    }

    // Paginación
    const page = paginacion.page ? parseInt(paginacion.page) : 1;
    const limit = paginacion.limit ? parseInt(paginacion.limit) : 10;
    const skip = (page - 1) * limit;

    // Ordenamiento
    let sortOptions = {};
    if (filtros.sort === 'ventas') {
      sortOptions.cantidadVendida = filtros.order === 'desc' ? -1 : 1;
    } else if (filtros.sort === 'precio') {
      sortOptions.precio = filtros.order === 'desc' ? -1 : 1;
    } else {
      sortOptions.precio = 1; // por defecto
    }

    // Ejecutar consulta
    const productos = await this.model
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    // Contar total de documentos para paginación
    const total = await this.model.countDocuments(query);

    return {
      productos,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }
}
