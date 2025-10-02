import { ProductoModel } from '../schemas/mongooseSchemas/productoSchema.js';
import Repository from './repository.js';
import mongoose from 'mongoose';

export default class ProductoRepository extends Repository {
  constructor() {
    super(ProductoModel);
  }

  async findByVendedorId(vendedorId, filtros = {}, paginacion = {}) {
    const objectId = new mongoose.Types.ObjectId(vendedorId);
    // Construir el filtro base
    const query = { 'vendedor.id': objectId };

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
