export const mockUsuarios = [
  {
    id: 'user_001',
    nombre: 'Nicolás Piacentini',
    email: 'nicolas@hotmail.com',
    telefono: '0987654321',
    tipo: 'COMPRADOR',
  },
  {
    id: 'user_002',
    nombre: 'Tadeo Sorrentino',
    email: 'tadeo@gmail.com',
    telefono: '1234567890',
    tipo: 'VENDEDOR',
  },
  {
    id: 'user_003',
    nombre: 'María González',
    email: 'maria.gonzalez@gmail.com',
    telefono: '1122334455',
    tipo: 'COMPRADOR',
  },
  {
    id: 'user_004',
    nombre: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@outlook.com',
    telefono: '5544332211',
    tipo: 'VENDEDOR',
  },
  {
    id: 'user_005',
    nombre: 'Ana López',
    email: 'ana.lopez@yahoo.com',
    telefono: '6677889900',
    tipo: 'COMPRADOR',
  },
  {
    id: 'user_006',
    nombre: 'Roberto Silva',
    email: 'roberto.silva@gmail.com',
    telefono: '9988776655',
    tipo: 'VENDEDOR',
  },
];

export const getUsuarioById = (id) => {
  return mockUsuarios.find((usuario) => usuario.id === id);
};

export const getUsuariosByTipo = (tipo) => {
  return mockUsuarios.filter((usuario) => usuario.tipo === tipo);
};
