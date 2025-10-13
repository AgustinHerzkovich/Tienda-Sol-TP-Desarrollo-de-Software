export const productos = [
  {
    id: 1,
    titulo: 'PlayStation 5',
    descripcion:
      'Consola de videojuegos de nueva generación con gráficos 4K y SSD ultrarrápido',
    categorias: [{ nombre: 'Tecnología' }, { nombre: 'Gaming' }],
    precio: 850000,
    moneda: 'PESO_ARG',
    stock: 15,
    fotos: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=300&fit=crop',
    ],
    activo: true,
    vendedorId: 'user_002',
  },
  {
    id: 2,
    titulo: 'iPhone 14 Pro',
    descripcion:
      'Smartphone Apple con pantalla Super Retina XDR y chip A16 Bionic',
    categorias: [{ nombre: 'Tecnología' }, { nombre: 'Smartphones' }],
    precio: 1200000,
    moneda: 'PESO_ARG',
    stock: 25,
    fotos: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    ],
    activo: true,
    vendedorId: 'user_004',
  },
  {
    id: 3,
    titulo: 'MacBook Pro M2',
    descripcion:
      'Laptop profesional con chip M2 de Apple, 16GB RAM y pantalla Retina de 14 pulgadas',
    categorias: [{ nombre: 'Computación' }, { nombre: 'Laptops' }],
    precio: 2500000,
    moneda: 'PESO_ARG',
    stock: 8,
    fotos: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    ],
    activo: true,
    vendedorId: 'user_002',
  },
  {
    id: 4,
    titulo: 'AirPods Pro 2da Gen',
    descripcion:
      'Auriculares inalámbricos con cancelación de ruido activa y audio espacial',
    categorias: [{ nombre: 'Audio' }, { nombre: 'Tecnología' }],
    precio: 320000,
    moneda: 'PESO_ARG',
    stock: 40,
    fotos: [
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1590658165737-15a047b4799a?w=400&h=300&fit=crop',
    ],
    activo: true,
    vendedorId: 'user_006',
  },
  {
    id: 5,
    titulo: 'Cafetera Nespresso Vertuo',
    descripcion:
      'Máquina de café automática con sistema de cápsulas Vertuo y espumador',
    categorias: [{ nombre: 'Electrodomésticos' }, { nombre: 'Cocina' }],
    precio: 85000,
    moneda: 'PESO_ARG',
    stock: 30,
    fotos: [
      'https://images.unsplash.com/photo-1495774856032-8b90bbb32b32?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1442411210769-175659e34839?w=400&h=300&fit=crop',
    ],
    activo: true,
    vendedorId: 'user_004',
  },
  {
    id: 6,
    titulo: 'Nike Air Jordan 1',
    descripcion:
      'Zapatillas deportivas clásicas de básquet con diseño icónico y comodidad premium',
    categorias: [{ nombre: 'Deportes' }, { nombre: 'Calzado' }],
    precio: 180000,
    moneda: 'PESO_ARG',
    stock: 60,
    fotos: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    ],
    activo: true,
    vendedorId: 'user_002',
  },
  {
    id: 7,
    titulo: 'Smart TV Samsung 65" QLED',
    descripcion:
      'Televisor QLED 4K con tecnología Quantum Dot y sistema operativo Tizen',
    categorias: [{ nombre: 'Electrodomésticos' }, { nombre: 'TV y Video' }],
    precio: 650000,
    moneda: 'PESO_ARG',
    stock: 12,
    fotos: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1601944177325-f8867652837f?w=400&h=300&fit=crop',
    ],
    activo: true,
    vendedorId: 'user_006',
  },
  {
    id: 8,
    titulo: 'Cien Años de Soledad',
    descripcion:
      'Obra maestra de Gabriel García Márquez - Edición especial conmemorativa',
    categorias: [{ nombre: 'Libros' }, { nombre: 'Literatura' }],
    precio: 8500,
    moneda: 'PESO_ARG',
    stock: 150,
    fotos: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    ],
    activo: true,
    vendedorId: 'user_004',
  },
  {
    id: 9,
    titulo: 'Bicicleta Mountain Bike Specialized',
    descripcion:
      'Mountain bike profesional con suspensión completa y frenos de disco hidráulicos',
    categorias: [{ nombre: 'Deportes' }, { nombre: 'Ciclismo' }],
    precio: 450000,
    moneda: 'PESO_ARG',
    stock: 8,
    fotos: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    ],
    activo: true,
    vendedorId: 'user_002',
  },
  {
    id: 10,
    titulo: 'Perfume Chanel No. 5',
    descripcion: 'Fragancia femenina icónica con notas florales y aldeídos',
    categorias: [{ nombre: 'Perfumería' }, { nombre: 'Belleza' }],
    precio: 95000,
    moneda: 'PESO_ARG',
    stock: 45,
    fotos: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=300&fit=crop',
    ],
    activo: true,
    vendedorId: 'user_006',
  },
  {
    id: 11,
    titulo: 'Microondas LG Smart Inverter',
    descripcion:
      'Horno microondas con tecnología Smart Inverter y función grill integrada',
    categorias: [{ nombre: 'Electrodomésticos' }, { nombre: 'Cocina' }],
    precio: 75000,
    moneda: 'PESO_ARG',
    stock: 35,
    fotos: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1556185781-a47769abb7aa?w=400&h=300&fit=crop',
    ],
    activo: true,
    vendedorId: 'user_004',
  },
  {
    id: 12,
    titulo: 'Cámara Canon EOS R6',
    descripcion: 'Cámara mirrorless full frame con sensor de 20.1MP y video 4K',
    categorias: [{ nombre: 'Fotografía' }, { nombre: 'Tecnología' }],
    precio: 920000,
    moneda: 'PESO_ARG',
    stock: 6,
    fotos: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop',
    ],
    activo: true,
    vendedorId: 'user_002',
  },
];

export const getProductoById = (id) => {
  return productos.find((producto) => producto.id === id);
};

export const getProductosByCategoria = (categoria) => {
  return productos.filter((producto) =>
    producto.categorias.some((cat) =>
      cat.nombre.toLowerCase().includes(categoria.toLowerCase())
    )
  );
};

export const getProductosByVendedor = (vendedorId) => {
  return productos.filter((producto) => producto.vendedorId === vendedorId);
};

export const getProductosActivos = () => {
  return productos.filter(
    (producto) => producto.activo && producto.stock > 0
  );
};

export const formatPrice = (precio, moneda = 'PESO_ARG') => {
  const formatters = {
    PESO_ARG: new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }),
    USD: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
  };

  return formatters[moneda]?.format(precio) || `$${precio}`;
};
