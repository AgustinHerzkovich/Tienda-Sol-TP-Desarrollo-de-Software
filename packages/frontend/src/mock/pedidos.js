export const mockPedidos = [
  {
    id: 'pedido_001',
    compradorId: 'user_001',
    items: [
      {
        productoId: 'prod_001',
        cantidad: 1,
        precio: 850000,
      },
    ],
    moneda: 'PESO_ARG',
    total: 850000,
    estado: 'PENDIENTE',
    fechaCreacion: '2024-01-15T10:30:00Z',
    direccionEntrega: {
      calle: 'Av. Corrientes',
      altura: '1234',
      piso: '5',
      departamento: 'A',
      codigoPostal: '1043',
      ciudad: 'CABA',
      provincia: 'Buenos Aires',
      pais: 'Argentina',
      lat: '-34.6037',
      lon: '-58.3816',
    },
  },
  {
    id: 'pedido_002',
    compradorId: 'user_003',
    items: [
      {
        productoId: 'prod_004',
        cantidad: 2,
        precio: 320000,
      },
      {
        productoId: 'prod_008',
        cantidad: 1,
        precio: 8500,
      },
    ],
    moneda: 'PESO_ARG',
    total: 648500,
    estado: 'CONFIRMADO',
    fechaCreacion: '2024-01-14T14:20:00Z',
    direccionEntrega: {
      calle: 'San Martín',
      altura: '567',
      piso: '2',
      departamento: 'B',
      codigoPostal: '1636',
      ciudad: 'Olivos',
      provincia: 'Buenos Aires',
      pais: 'Argentina',
      lat: '-34.5089',
      lon: '-58.4934',
    },
  },
  {
    id: 'pedido_003',
    compradorId: 'user_005',
    items: [
      {
        productoId: 'prod_006',
        cantidad: 1,
        precio: 180000,
      },
    ],
    moneda: 'PESO_ARG',
    total: 180000,
    estado: 'ENVIADO',
    fechaCreacion: '2024-01-13T09:15:00Z',
    direccionEntrega: {
      calle: 'Rivadavia',
      altura: '8900',
      piso: null,
      departamento: null,
      codigoPostal: '1407',
      ciudad: 'CABA',
      provincia: 'Buenos Aires',
      pais: 'Argentina',
      lat: '-34.6425',
      lon: '-58.5064',
    },
  },
];

export const getPedidoById = (id) => {
  return mockPedidos.find((pedido) => pedido.id === id);
};

export const getPedidosByComprador = (compradorId) => {
  return mockPedidos.filter((pedido) => pedido.compradorId === compradorId);
};

export const getPedidosByEstado = (estado) => {
  return mockPedidos.filter((pedido) => pedido.estado === estado);
};

export const getEstadosPedido = () => {
  return ['PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];
};
