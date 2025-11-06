import Producto from '../../../models/producto.js';
import Usuario from '../../../models/usuario.js';
import Categoria from '../../../models/categoria.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import { Moneda } from '../../../models/moneda.js';
import ProductoService from '../../../services/productoService.js';
import ProductoOutOfStockError from '../../../error/productoOutOfStockError.js';
import NotFoundError from '../../../error/notFoundError.js';
import { jest } from '@jest/globals';

describe('Tests unitarios de productoService', () => {
  let vendedor;
  let productoService;
  let mockProductoRepository;
  let mockUsuarioService;

  beforeAll(() => {
    vendedor = new Usuario(
      'Carlos',
      'carlos@test.com',
      '123456789',
      TipoUsuario.VENDEDOR
    );
    vendedor.id = 1;
  });

  beforeEach(() => {
    // Configurar mocks limpios para cada test
    mockProductoRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    };

    mockUsuarioService = {
      findById: jest.fn(),
    };

    productoService = new ProductoService(
      mockProductoRepository,
      mockUsuarioService
    );

    // Limpiar mocks
    jest.clearAllMocks();
  });

  const crearProducto = (stock = 100) => {
    return new Producto(
      vendedor,
      'Producto Test',
      'descripcion test',
      [new Categoria('inmueble')],
      5000,
      Moneda.PESO_ARG,
      stock,
      ['http://localhost:8000/api-docs'],
      true
    );
  };
  describe('findById', () => {
    test('findById llama correctamente al repositorio y devuelve el producto', async () => {
      const producto = crearProducto();
      producto.id = 1;
      mockProductoRepository.findById.mockResolvedValue(producto);

      const resultado = await productoService.findById(1);

      expect(mockProductoRepository.findById).toHaveBeenCalledWith(1);
      expect(resultado.id).toBe(1);
    });

    test('findById tira error cuando no encuentra el producto', async () => {
      mockProductoRepository.findById.mockResolvedValue(undefined);

      await expect(productoService.findById(999)).rejects.toThrow(
        NotFoundError
      );

      expect(mockProductoRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('crear', () => {
    const productoJSON = {
      vendedorId: 1,
      titulo: 'Nuevo Producto',
      descripcion: 'Descripción del producto',
      categorias: [new Categoria('test')],
      precio: 1000,
      moneda: Moneda.PESO_ARG,
      stock: 50,
      fotos: ['http://test.com/foto.jpg'],
      activo: true,
    };

    test('crear producto correctamente cuando el vendedor existe', async () => {
      const productoCreado = crearProducto();
      productoCreado.id = 1;

      mockUsuarioService.findById.mockResolvedValue(vendedor);
      mockProductoRepository.create.mockResolvedValue(productoCreado);

      const resultado = await productoService.crear(productoJSON);

      expect(mockUsuarioService.findById).toHaveBeenCalledWith(1);
      expect(mockProductoRepository.create).toHaveBeenCalledTimes(1);
    });

    test('crear lanza error cuando el vendedor no existe', async () => {
      mockUsuarioService.findById.mockRejectedValue(
        new NotFoundError('Usuario con id: 1 no encontrado')
      );
      await expect(productoService.crear(productoJSON)).rejects.toThrow(
        NotFoundError
      );

      expect(mockUsuarioService.findById).toHaveBeenCalledWith(1);
      expect(mockProductoRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('modificarStock', () => {
    test('modificar stock con valor positivo aumenta el stock', async () => {
      const producto = crearProducto(100);
      mockProductoRepository.update.mockResolvedValue(producto);

      await productoService.modificarStock(producto, 2);

      expect(producto.stock).toBe(102);
      expect(mockProductoRepository.update).toHaveBeenCalledTimes(1);
    });

    test('modificar stock con valor negativo reduce el stock', async () => {
      const producto = crearProducto(100);
      mockProductoRepository.update.mockResolvedValue(producto);

      await productoService.modificarStock(producto, -2);

      expect(producto.stock).toBe(98);
      expect(mockProductoRepository.update).toHaveBeenCalledTimes(1);
    });

    test('modificar stock lanza error cuando no hay stock suficiente', async () => {
      const producto = crearProducto(5);

      await expect(
        productoService.modificarStock(producto, -10)
      ).rejects.toThrow(ProductoOutOfStockError);

      expect(producto.stock).toBe(5);
      expect(mockProductoRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('aumentarVentas', () => {
    test('aumentar ventas aumenta las ventas del producto', async () => {
      const producto = crearProducto();
      mockProductoRepository.update.mockResolvedValue(producto);

      await productoService.aumentarVentas(producto, 2);

      expect(producto.cantidadVentas).toBe(2);
      expect(mockProductoRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    const mockProductos = [
      { id: 1, titulo: 'Producto 1', precio: 100, cantidadVendida: 10 },
      { id: 2, titulo: 'Producto 2', precio: 200, cantidadVendida: 5 },
      { id: 3, titulo: 'Producto 3', precio: 150, cantidadVendida: 15 },
    ];
    const mockPagination = {
      currentPage: 1,
      totalPages: 1,
      totalItems: 3,
      itemsPerPage: 10,
    };

    beforeEach(() => {
      mockProductoRepository.findAll = jest.fn();
    });

    test('busca todos los productos sin filtros y retorna estructura con productos y paginación', async () => {
      const mockResponse = {
        productos: mockProductos,
        pagination: mockPagination,
      };

      mockProductoRepository.findAll.mockResolvedValue(mockResponse);

      const resultado = await productoService.findAll({}, {});

      expect(mockProductoRepository.findAll).toHaveBeenCalledWith({}, {});
      expect(resultado).toHaveProperty('productos');
      expect(resultado).toHaveProperty('pagination');
      expect(resultado.productos).toHaveLength(3);
      expect(resultado.pagination).toEqual(mockPagination);
    });

    test('filtra productos por vendedorId específico', async () => {
      const filtros = {
        vendedorId: '507f1f77bcf86cd799439011',
        sort: 'precio',
        order: 'asc',
      };
      const paginacion = { page: 1, limit: 10 };

      const mockResponse = {
        productos: [mockProductos[0]],
        pagination: { ...mockPagination, totalItems: 1 },
      };

      mockProductoRepository.findAll.mockResolvedValue(mockResponse);

      const resultado = await productoService.findAll(filtros, paginacion);

      expect(mockProductoRepository.findAll).toHaveBeenCalledWith(
        filtros,
        paginacion
      );
      expect(resultado.productos).toHaveLength(1);
    });

    test('aplica filtros de búsqueda por título sin vendedor específico', async () => {
      const filtros = {
        titulo: 'iPhone',
        sort: 'precio',
        order: 'asc',
      };
      const paginacion = { page: 1, limit: 10 };

      const mockResponse = {
        productos: [mockProductos[0]],
        pagination: { ...mockPagination, totalItems: 1 },
      };

      mockProductoRepository.findAll.mockResolvedValue(mockResponse);

      const resultado = await productoService.findAll(filtros, paginacion);

      expect(mockProductoRepository.findAll).toHaveBeenCalledWith(
        filtros,
        paginacion
      );
      expect(resultado.productos).toHaveLength(1);
    });

    test('aplica múltiples filtros combinados incluyendo vendedorId', async () => {
      const filtros = {
        vendedorId: '507f1f77bcf86cd799439011',
        titulo: 'Smart',
        categoria: 'Electrodomésticos',
        descripcion: 'TV',
        minPrecio: 100,
        maxPrecio: 500,
        sort: 'precio',
        order: 'desc',
      };
      const paginacion = { page: 1, limit: 20 };

      const mockResponse = {
        productos: [mockProductos[1]],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 20,
        },
      };

      mockProductoRepository.findAll.mockResolvedValue(mockResponse);

      const resultado = await productoService.findAll(filtros, paginacion);

      expect(mockProductoRepository.findAll).toHaveBeenCalledWith(
        filtros,
        paginacion
      );
      expect(resultado.productos).toHaveLength(1);
      expect(resultado.pagination.totalItems).toBe(1);
    });

    test('aplica paginación correctamente', async () => {
      const filtros = {};
      const paginacion = { page: 2, limit: 5 };

      const mockResponse = {
        productos: mockProductos.slice(0, 2), // Simula página 2
        pagination: {
          currentPage: 2,
          totalPages: 3,
          totalItems: 12,
          itemsPerPage: 5,
        },
      };

      mockProductoRepository.findAll.mockResolvedValue(mockResponse);

      const resultado = await productoService.findAll(filtros, paginacion);

      expect(mockProductoRepository.findAll).toHaveBeenCalledWith(
        filtros,
        paginacion
      );
      expect(resultado.pagination.currentPage).toBe(2);
      expect(resultado.pagination.itemsPerPage).toBe(5);
    });

    test('aplica ordenamiento por ventas descendente', async () => {
      const filtros = {
        sort: 'ventas',
        order: 'desc',
      };

      const mockResponse = {
        productos: [mockProductos[2], mockProductos[0], mockProductos[1]], // Ordenados por ventas desc (15, 10, 5)
        pagination: mockPagination,
      };

      mockProductoRepository.findAll.mockResolvedValue(mockResponse);

      await productoService.findAll(filtros, {});

      expect(mockProductoRepository.findAll).toHaveBeenCalledWith(filtros, {});
    });

    test('retorna array vacío cuando no hay productos', async () => {
      const mockResponse = {
        productos: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
        },
      };

      mockProductoRepository.findAll.mockResolvedValue(mockResponse);

      const resultado = await productoService.findAll({}, {});

      expect(resultado.productos).toHaveLength(0);
      expect(resultado.pagination.totalItems).toBe(0);
    });

    test('convierte productos a DTO correctamente', async () => {
      const mockResponse = {
        productos: mockProductos,
        pagination: mockPagination,
      };

      mockProductoRepository.findAll.mockResolvedValue(mockResponse);

      // Spy en toDTO para verificar que se llama
      const toDTOSpy = jest.spyOn(productoService, 'toDTO');

      await productoService.findAll({}, {});

      expect(toDTOSpy).toHaveBeenCalledTimes(3); // Una vez por cada producto
      expect(toDTOSpy).toHaveBeenCalledWith(mockProductos[0]);
      expect(toDTOSpy).toHaveBeenCalledWith(mockProductos[1]);
      expect(toDTOSpy).toHaveBeenCalledWith(mockProductos[2]);

      toDTOSpy.mockRestore();
    });

    test('funciona sin filtro de vendedor para obtener productos de todos los vendedores', async () => {
      const filtros = {
        categoria: 'Tecnología',
        minPrecio: 100,
        sort: 'precio',
        order: 'asc',
        // Sin vendedorId - busca en todos los vendedores
      };

      const mockResponse = {
        productos: mockProductos,
        pagination: mockPagination,
      };

      mockProductoRepository.findAll.mockResolvedValue(mockResponse);

      const resultado = await productoService.findAll(filtros, {});

      expect(mockProductoRepository.findAll).toHaveBeenCalledWith(filtros, {});
      expect(resultado.productos).toHaveLength(3);
      // Verificar que no se pasó vendedorId en los filtros
      expect(filtros.vendedorId).toBeUndefined();
    });
  });
});
