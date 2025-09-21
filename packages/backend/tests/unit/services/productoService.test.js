import Producto from '../../../models/producto.js';
import Usuario from '../../../models/usuario.js';
import Categoria from '../../../models/categoria.js';
import { TipoUsuario } from '../../../models/tipoUsuario.js';
import { Moneda } from '../../../models/moneda.js';
import ProductoService from '../../../services/productoService.js';
import ProductoOutOfStockError from '../../../exceptions/productoOutOfStockError.js';

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
      save: jest.fn(),
      findByVendedorId: jest.fn(),
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
      expect(resultado).toBe(producto);
    });

    test('findById retorna undefined cuando no encuentra el producto', async () => {
      mockProductoRepository.findById.mockResolvedValue(undefined);

      const resultado = await productoService.findById(999);

      expect(mockProductoRepository.findById).toHaveBeenCalledWith(999);
      expect(resultado).toBeUndefined();
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
      mockProductoRepository.save.mockResolvedValue(productoCreado);

      const resultado = await productoService.crear(productoJSON);

      expect(mockUsuarioService.findById).toHaveBeenCalledWith(1);
      expect(mockProductoRepository.save).toHaveBeenCalledTimes(1);
      expect(resultado).toBe(productoCreado);
    });

    test('crear lanza error cuando el vendedor no existe', async () => {
      mockUsuarioService.findById.mockResolvedValue(undefined);

      await expect(productoService.crear(productoJSON)).rejects.toThrow(
        'No existe el vendedor'
      );

      expect(mockUsuarioService.findById).toHaveBeenCalledWith(1);
      expect(mockProductoRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('modificarStock', () => {
    test('modificar stock con valor positivo aumenta el stock', async () => {
      const producto = crearProducto(100);
      mockProductoRepository.save.mockResolvedValue(producto);

      await productoService.modificarStock(producto, 2);

      expect(producto.stock).toBe(102);
      expect(mockProductoRepository.save).toHaveBeenCalledWith(producto);
    });

    test('modificar stock con valor negativo reduce el stock', async () => {
      const producto = crearProducto(100);
      mockProductoRepository.save.mockResolvedValue(producto);

      await productoService.modificarStock(producto, -2);

      expect(producto.stock).toBe(98);
      expect(mockProductoRepository.save).toHaveBeenCalledWith(producto);
    });

    test('modificar stock lanza error cuando no hay stock suficiente', async () => {
      const producto = crearProducto(5);

      await expect(
        productoService.modificarStock(producto, -10)
      ).rejects.toThrow(ProductoOutOfStockError);

      expect(producto.stock).toBe(5);
      expect(mockProductoRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('aumentarVentas', () => {
    test('aumentar ventas aumenta las ventas del producto', async () => {
      const producto = crearProducto();
      mockProductoRepository.save.mockResolvedValue(producto);

      await productoService.aumentarVentas(producto, 2);

      expect(producto.cantidadVentas).toBe(2);
      expect(mockProductoRepository.save).toHaveBeenCalledWith(producto);
    });

    test('aumentar ventas guarda el producto después de la modificación', async () => {
      const producto = crearProducto();
      mockProductoRepository.save.mockResolvedValue(producto);

      await productoService.aumentarVentas(producto, 5);

      expect(mockProductoRepository.save).toHaveBeenCalledTimes(1);
      expect(mockProductoRepository.save).toHaveBeenCalledWith(producto);
    });
  });
});
