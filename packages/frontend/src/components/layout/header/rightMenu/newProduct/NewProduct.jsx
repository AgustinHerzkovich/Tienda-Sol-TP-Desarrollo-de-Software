import './NewProduct.css';
import { FiPlus } from "react-icons/fi";
import { useState } from 'react';
import { useSession } from '../../../../../context/SessionContext';
import { FaTimes, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useToast } from '../../../../common/Toast';

export default function NewProduct() {
  const { user } = useSession();
  const { showToast } = useToast();
  const productosEndpoint = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/productos`;

  // Estado para modal de nuevo producto
  const [showModal, setShowModal] = useState(false);
  const [producto, setProducto] = useState({
    titulo: '',
    descripcion: '',
    categorias: [{ nombre: '' }],
    precio: 0,
    moneda: 'PESO_ARG',
    stock: 0,
    fotos: [''],
    activo: true
  });

  const handleProductoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoriaChange = (index, value) => {
    const newCategorias = [...producto.categorias];
    newCategorias[index] = { nombre: value };
    setProducto((prev) => ({
      ...prev,
      categorias: newCategorias,
    }));
  };

  const handleAddCategoria = () => {
    setProducto((prev) => ({
      ...prev,
      categorias: [...prev.categorias, { nombre: '' }],
    }));
  };

  const handleRemoveCategoria = (index) => {
    if (producto.categorias.length > 1) {
      const newCategorias = producto.categorias.filter((_, i) => i !== index);
      setProducto((prev) => ({
        ...prev,
        categorias: newCategorias,
      }));
    }
  };

  const handleFotoChange = (index, value) => {
    const newFotos = [...producto.fotos];
    newFotos[index] = value;
    setProducto((prev) => ({
      ...prev,
      fotos: newFotos,
    }));
  };

  const handleAddFoto = () => {
    setProducto((prev) => ({
      ...prev,
      fotos: [...prev.fotos, ''],
    }));
  };

  const handleRemoveFoto = (index) => {
    if (producto.fotos.length > 1) {
      const newFotos = producto.fotos.filter((_, i) => i !== index);
      setProducto((prev) => ({
        ...prev,
        fotos: newFotos,
      }));
    }
  };

  const handleConfirmarProducto = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!producto.titulo.trim()) {
      showToast('El título es obligatorio', 'error');
      return;
    }

    if (producto.precio <= 0) {
      showToast('El precio debe ser mayor a 0', 'error');
      return;
    }

    if (producto.stock < 0) {
      showToast('El stock no puede ser negativo', 'error');
      return;
    }

    // Filtrar categorías y fotos vacías
    const categoriasValidas = producto.categorias.filter(c => c.nombre.trim() !== '');
    const fotosValidas = producto.fotos.filter(f => f.trim() !== '');

    if (categoriasValidas.length === 0) {
      showToast('Debe agregar al menos una categoría', 'error');
      return;
    }

    if (fotosValidas.length === 0) {
      showToast('Debe agregar al menos una foto', 'error');
      return;
    }

    try {
      const nuevoProducto = {
        ...producto,
        categorias: categoriasValidas,
        fotos: fotosValidas,
        vendedorId: user.id,
        precio: parseFloat(producto.precio),
        stock: parseInt(producto.stock)
      };

      await axios.post(productosEndpoint, nuevoProducto);
      
      showToast('¡Producto creado exitosamente!', 'success');
      
      // Resetear formulario
      setProducto({
        titulo: '',
        descripcion: '',
        categorias: [{ nombre: '' }],
        precio: 0,
        moneda: 'PESO_ARG',
        stock: 0,
        fotos: [''],
        activo: true
      });
      
      setShowModal(false);
    } catch (error) {
      console.error('Error al crear producto:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear el producto. Por favor, intenta de nuevo.';
      showToast(errorMessage, 'error');
    }
  };

  const handleNewProductClick = () => {
    setShowModal(true);
  };

  return (
    <div className="newproduct-container">
      <button className="newproduct-button" title="Nuevo Producto" onClick={handleNewProductClick}>
        <FiPlus />
      </button>

      {/* Modal de producto */}
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title-newproduct">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="modal-title-newproduct">Nuevo Producto</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Cerrar modal"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleConfirmarProducto} className="producto-form">
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="titulo">Título *</label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={producto.titulo}
                    onChange={handleProductoChange}
                    required
                    placeholder="Ej: Notebook Lenovo IdeaPad 3"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="descripcion">Descripción *</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={producto.descripcion}
                    onChange={handleProductoChange}
                    required
                    placeholder="Describe las características del producto..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="precio">Precio *</label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={producto.precio}
                    onChange={handleProductoChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="moneda">Moneda *</label>
                  <select
                    id="moneda"
                    name="moneda"
                    value={producto.moneda}
                    onChange={handleProductoChange}
                    required
                  >
                    <option value="PESO_ARG">Peso Argentino (ARS)</option>
                    <option value="DOLAR_USA">Dólar Americano (USD)</option>
                    <option value="REAL">Real Brasileño (BRL)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stock">Stock *</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={producto.stock}
                    onChange={handleProductoChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="activo">
                    <input
                      type="checkbox"
                      id="activo"
                      name="activo"
                      checked={producto.activo}
                      onChange={handleProductoChange}
                      style={{ width: 'auto', marginRight: '8px' }}
                    />
                    Producto activo
                  </label>
                </div>
              </div>

              {/* Categorías */}
              <div className="form-section">
                <div className="section-header">
                  <label>Categorías *</label>
                  <button
                    type="button"
                    onClick={handleAddCategoria}
                    className="btn-add-item"
                  >
                    <FiPlus /> Agregar categoría
                  </button>
                </div>
                {producto.categorias.map((categoria, index) => (
                  <div key={index} className="form-row">
                    <div className="form-group full-width">
                      <input
                        type="text"
                        value={categoria.nombre}
                        onChange={(e) => handleCategoriaChange(index, e.target.value)}
                        placeholder="Ej: Electrónica, Computadoras"
                        required
                      />
                    </div>
                    {producto.categorias.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCategoria(index)}
                        className="btn-remove-item"
                        title="Eliminar categoría"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Fotos */}
              <div className="form-section">
                <div className="section-header">
                  <label>Fotos (URLs) *</label>
                  <button
                    type="button"
                    onClick={handleAddFoto}
                    className="btn-add-item"
                  >
                    <FiPlus /> Agregar foto
                  </button>
                </div>
                {producto.fotos.map((foto, index) => (
                  <div key={index} className="form-row">
                    <div className="form-group full-width">
                      <input
                        type="url"
                        value={foto}
                        onChange={(e) => handleFotoChange(index, e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        required
                      />
                    </div>
                    {producto.fotos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFoto(index)}
                        className="btn-remove-item"
                        title="Eliminar foto"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-cancelar"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-confirmar">
                  <FiPlus />
                  Crear Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}