export const mockCategorias = [
  { id: "cat_001", nombre: "Tecnología" },
  { id: "cat_002", nombre: "Gaming" },
  { id: "cat_003", nombre: "Smartphones" },
  { id: "cat_004", nombre: "Computación" },
  { id: "cat_005", nombre: "Laptops" },
  { id: "cat_006", nombre: "Audio" },
  { id: "cat_007", nombre: "Electrodomésticos" },
  { id: "cat_008", nombre: "Cocina" },
  { id: "cat_009", nombre: "Deportes" },
  { id: "cat_010", nombre: "Calzado" },
  { id: "cat_011", nombre: "TV y Video" },
  { id: "cat_012", nombre: "Libros" },
  { id: "cat_013", nombre: "Literatura" },
  { id: "cat_014", nombre: "Ciclismo" },
  { id: "cat_015", nombre: "Perfumería" },
  { id: "cat_016", nombre: "Belleza" },
  { id: "cat_017", nombre: "Fotografía" }
];

export const getCategoriaById = (id) => {
  return mockCategorias.find(categoria => categoria.id === id);
};

export const getAllCategorias = () => {
  return mockCategorias;
};