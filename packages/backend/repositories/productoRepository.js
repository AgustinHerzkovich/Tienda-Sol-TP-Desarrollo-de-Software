import { ProductoModel } from '../schemas/mongooseSchemas/productoSchema.js';
import Repository from './repository.js';
import mongoose from 'mongoose';
import TasaDeCambioHelper from '../models/tasaDeCambioHelper.js';
import { Moneda } from '../models/moneda.js';
export default class ProductoRepository extends Repository {
  constructor() {
    super(ProductoModel);
  }

  async findAll(filtros = {}, paginacion = {}) {
    // Construir el filtro base (sin filtro fijo de vendedor)
    const query = {};

    // Filtro por vendedor (si se proporciona)
    if (filtros.vendedorId) {
      const objectId = new mongoose.Types.ObjectId(filtros.vendedorId);
      query.vendedor = objectId;
    }

    if (filtros.search) {
      query.$or = [
        { titulo: { $regex: filtros.search, $options: 'i' } },
        { descripcion: { $regex: filtros.search, $options: 'i' } },
        { 'categorias.nombre': { $regex: filtros.search, $options: 'i' } },
      ];
    }

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

    if (filtros.activo !== undefined) {
      query.activo = filtros.activo === 'true' || filtros.activo === true;
    }

    // Paginación
    const page = paginacion.page ? parseInt(paginacion.page) : 1;
    const limit = paginacion.limit ? parseInt(paginacion.limit) : 10;
    const skip = (page - 1) * limit;

    // Obtener tasas de cambio (valores en pesos argentinos)
    const tasas = TasaDeCambioHelper.valores;

    // Si hay filtros de precio O se ordena por precio, usamos aggregation para convertir a moneda base (ARS)
    const necesitaConversion =
      filtros.minPrecio || filtros.maxPrecio || filtros.sort === 'precio';

    if (necesitaConversion) {
      const pipeline = [
        // Primero aplicar los filtros base
        { $match: query },
        {
          $addFields: {
            precioConvertido: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ['$moneda', Moneda.DOLAR_USA] },
                    then: { $multiply: ['$precio', tasas[Moneda.DOLAR_USA]] },
                  },
                  {
                    case: { $eq: ['$moneda', Moneda.PESO_ARG] },
                    then: '$precio',
                  },
                  {
                    case: { $eq: ['$moneda', Moneda.REAL] },
                    then: { $multiply: ['$precio', tasas[Moneda.REAL]] },
                  },
                ],
                default: '$precio',
              },
            },
          },
        },
      ];

      // Filtro por rango de precios (en pesos argentinos)
      if (filtros.minPrecio || filtros.maxPrecio) {
        const matchPrecio = {};
        if (filtros.minPrecio) matchPrecio.$gte = parseFloat(filtros.minPrecio);
        if (filtros.maxPrecio) matchPrecio.$lte = parseFloat(filtros.maxPrecio);
        pipeline.push({ $match: { precioConvertido: matchPrecio } });
      }
      // Ordenamiento
      if (filtros.sort === 'precio') {
        pipeline.push({
          $sort: {
            precioConvertido: filtros.order === 'desc' ? -1 : 1,
          },
        });
      } else if (filtros.sort === 'ventas') {
        pipeline.push({
          $sort: {
            cantidadVentas: filtros.order === 'desc' ? -1 : 1,
          },
        });
      } else {
        pipeline.push({ $sort: { precio: 1 } });
      }

      // Contar el total ANTES de skip y limit
      const countPipeline = [...pipeline];
      countPipeline.push({ $count: 'total' });
      const countResult = await this.model.aggregate(countPipeline).exec();
      const total = countResult.length > 0 ? countResult[0].total : 0;

      // Agregar paginación al pipeline original
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limit });

      const productos = await this.model.aggregate(pipeline).exec();

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

    // Para otros ordenamientos (ventas o default), usar find normal
    let sortOptions = {};
    if (filtros.sort === 'ventas') {
      sortOptions.cantidadVentas = filtros.order === 'desc' ? -1 : 1;
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
