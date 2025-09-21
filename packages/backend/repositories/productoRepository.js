import Crypto from 'crypto';

export default class productoRepository {
  constructor(ProductoModel) {
    this.productos = [];
    this.ProductoModel = ProductoModel; // Modelo de Mongoose
  }

  async guardar(producto) {
    if (producto.id === undefined) {
      producto.id = Crypto.randomUUID();
      this.productos.push(producto);
    }
    return producto;
  }

  async save(producto) {
    return this.guardar(producto);
  }

  async findById(idBuscado) {
    return this.productos.find((prod) => prod.id == idBuscado);
  }

  async findByVendedorId(vendedorId, filtros = {}, paginacion = {}) {
    // Fallback al array en memoria con filtros básicos
    let productos = this.productos.filter(
      (prod) => prod.vendedor.id === vendedorId
    );

    // Aplicar filtros básicos
    if (filtros.titulo) {
      productos = productos.filter((p) =>
        p.titulo.toLowerCase().includes(filtros.titulo.toLowerCase())
      );
    }
    if (filtros.categoria) {
      productos = productos.filter(
        (p) =>
          p.categorias &&
          p.categorias.some((cat) =>
            cat.nombre.toLowerCase().includes(filtros.categoria.toLowerCase())
          )
      );
    }
    if (filtros.minPrecio) {
      productos = productos.filter(
        (p) => p.precio >= parseFloat(filtros.minPrecio)
      );
    }
    if (filtros.maxPrecio) {
      productos = productos.filter(
        (p) => p.precio <= parseFloat(filtros.maxPrecio)
      );
    }

    // Aplicar ordenamiento básico
    if (filtros.sort === 'precio') {
      productos.sort((a, b) => {
        return filtros.order === 'desc'
          ? b.precio - a.precio
          : a.precio - b.precio;
      });
    } else if (filtros.sort === 'ventas') {
      productos.sort((a, b) => {
        return filtros.order === 'desc'
          ? b.cantidadVentas - a.cantidadVentas
          : a.cantidadVentas - b.cantidadVentas;
      });
    }

    // Aplicar paginación básica
    const page = paginacion.page;
    const limit = paginacion.limit;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(productos.length, startIndex + limit);
    const paginatedProducts = productos.slice(startIndex, endIndex);

    return {
      productos: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(productos.length / limit),
        totalItems: productos.length,
        itemsPerPage: limit,
      },
    };

    // VERSION EN BASE DE DATOS
    /*
    // Construir el filtro base para Mongoose
    const query = { 'vendedor.id': vendedorId };

    // Aplicar filtros adicionales
    if (filtros.titulo) {
      query.titulo = { $regex: filtros.titulo, $options: 'i' };
    }

    if (filtros.categoria) {
      query.categorias = { $in: [new RegExp(filtros.categoria, 'i')] };
    }

    if (filtros.descripcion) {
      query.descripcion = { $regex: filtros.descripcion, $options: 'i' };
    }

    // Filtro de rango de precios
    if (filtros.minPrecio || filtros.maxPrecio) {
      query.precio = {};
      if (filtros.minPrecio) {
        query.precio.$gte = parseFloat(filtros.minPrecio);
      }
      if (filtros.maxPrecio) {
        query.precio.$lte = parseFloat(filtros.maxPrecio);
      }
    }

    // Configurar paginación
    const page = paginacion.page || 1;
    const limit = paginacion.limit || 10;
    const skip = (page - 1) * limit;

    // Configurar ordenamiento
    let sortOptions = {};
    if (filtros.sort === 'ventas') {
      sortOptions.cantidadVendida = filtros.order === 'desc' ? -1 : 1;
    } else if (filtros.sort === 'precio') {
      sortOptions.precio = filtros.order === 'desc' ? -1 : 1;
    } else {
      sortOptions.precio = 1; // Por defecto orden por precio ascendente
    }

    // Ejecutar consulta con Mongoose
    const productos = await this.ProductoModel
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    // Contar total de documentos para paginación
    const total = await this.ProductoModel.countDocuments(query);

    return {
      productos,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    };
    */
  }
}
