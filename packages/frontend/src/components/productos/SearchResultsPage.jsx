import './SearchResultsPage.css';
import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { getProductos } from '../../services/productoService';
import LoadingSpinner from '../common/LoadingSpinner';

export default function SearchResultsPage() {
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { formatearPrecio } = useCurrency();

  // Filtros temporales (antes de aplicar)
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [filtroDescripcion, setFiltroDescripcion] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroMinPrecio, setFiltroMinPrecio] = useState('');
  const [filtroMaxPrecio, setFiltroMaxPrecio] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('Mayor Precio'); // Opciones: 'Mayor Precio', 'Menor Precio', 'Más Vendidos', 'Menos Vendidos'

  // Filtros aplicados (los que se usan en la búsqueda)
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    minPrecio: '',
    maxPrecio: '',
  });

  const query = new URLSearchParams(location.search).get('query') || '';
  const vendedorId =
    new URLSearchParams(location.search).get('vendedorId') || '';
  const limit = 10; // Productos por página

  useEffect(() => {
    let isMounted = true;
    
    const fetchProductos = async () => {
      try {
        setLoading(true);

        // Construir parámetros de búsqueda
        const params = {
          page: currentPage,
          limit: limit,
        };

        // Si hay query de búsqueda libre, usar el parámetro 'search'
        if (query && query.trim() !== '') {
          params.search = query;
        }

        // Si hay vendedorId en la URL, agregarlo
        if (vendedorId && vendedorId.trim() !== '') {
          params.vendedorId = vendedorId;
        }

        if (ordenamiento) {
          if (ordenamiento === 'Mayor Precio') {
            params.sort = 'precio';
            params.order = 'desc';
          } else if (ordenamiento === 'Menor Precio') {
            params.sort = 'precio';
            params.order = 'asc';
          } else if (ordenamiento === 'Más Vendidos') {
            params.sort = 'ventas';
            params.order = 'desc';
          } else if (ordenamiento === 'Menos Vendidos') {
            params.sort = 'ventas';
            params.order = 'asc';
          }
        }

        // Agregar filtros aplicados (son específicos y se combinan)
        if (filtrosAplicados.titulo && filtrosAplicados.titulo.trim() !== '') {
          params.titulo = filtrosAplicados.titulo;
        }
        if (
          filtrosAplicados.descripcion &&
          filtrosAplicados.descripcion.trim() !== ''
        ) {
          params.descripcion = filtrosAplicados.descripcion;
        }
        if (
          filtrosAplicados.categoria &&
          filtrosAplicados.categoria.trim() !== ''
        ) {
          params.categoria = filtrosAplicados.categoria;
        }
        if (filtrosAplicados.minPrecio && filtrosAplicados.minPrecio !== '') {
          params.minPrecio = parseFloat(filtrosAplicados.minPrecio);
        }
        if (filtrosAplicados.maxPrecio && filtrosAplicados.maxPrecio !== '') {
          params.maxPrecio = parseFloat(filtrosAplicados.maxPrecio);
        }

        const data = await getProductos(params);

        if (isMounted) {
          setProductos(data.productos || []);
          setPagination(data.pagination || null);
        }
      } catch (error) {
        console.error('Error al buscar productos:', error);
        if (isMounted) {
          setProductos([]);
          setPagination(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductos();
    
    return () => {
      isMounted = false;
    };
  }, [
    currentPage,
    query,
    vendedorId,
    ordenamiento,
    filtrosAplicados,
  ]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && pagination && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const aplicarFiltros = () => {
    setFiltrosAplicados({
      titulo: filtroTitulo,
      descripcion: filtroDescripcion,
      categoria: filtroCategoria,
      minPrecio: filtroMinPrecio,
      maxPrecio: filtroMaxPrecio,
    });
    setCurrentPage(1); // Reiniciar a la primera página
  };

  const limpiarFiltros = () => {
    setFiltroTitulo('');
    setFiltroDescripcion('');
    setFiltroCategoria('');
    setFiltroMinPrecio('');
    setFiltroMaxPrecio('');
    setOrdenamiento('Mayor Precio');
    setFiltrosAplicados({
      titulo: '',
      descripcion: '',
      categoria: '',
      minPrecio: '',
      maxPrecio: '',
    });
    setCurrentPage(1);
  };

  const hayFiltrosActivos = () => {
    return (
      filtrosAplicados.titulo ||
      filtrosAplicados.descripcion ||
      filtrosAplicados.categoria ||
      filtrosAplicados.minPrecio ||
      filtrosAplicados.maxPrecio
    );
  };

  if (loading) {
    return <LoadingSpinner message="Cargando resultados" />;
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        {query ? (
          <h2 className="results-title">
            Resultados de búsqueda para "{query}"
          </h2>
        ) : vendedorId ? (
          <h2 className="results-title">
            {productos.length > 0 && productos[0].vendedor
              ? `Productos de ${productos[0].vendedor.nombre}`
              : 'Productos del vendedor'}
          </h2>
        ) : (
          <h2 className="results-title">Buscar Productos</h2>
        )}

        {/* Panel de Filtros */}
        <div className="filtros-panel">
          <h3 className="filtros-titulo">Filtros de búsqueda</h3>

          <div className="filtros-grid">
            {/* Filtro por Título */}
            <div className="filtro-campo">
              <label htmlFor="filtro-titulo">Título contiene:</label>
              <input
                type="text"
                id="filtro-titulo"
                placeholder="Ej: Notebook"
                value={filtroTitulo}
                onChange={(e) => setFiltroTitulo(e.target.value)}
              />
            </div>

            {/* Filtro por Descripción */}
            <div className="filtro-campo">
              <label htmlFor="filtro-descripcion">Descripción contiene:</label>
              <input
                type="text"
                id="filtro-descripcion"
                placeholder="Ej: Intel Core i7"
                value={filtroDescripcion}
                onChange={(e) => setFiltroDescripcion(e.target.value)}
              />
            </div>

            {/* Filtro por Categoría */}
            <div className="filtro-campo">
              <label htmlFor="filtro-categoria">Categoría:</label>
              <input
                type="text"
                id="filtro-categoria"
                placeholder="Ej: Electrónica"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
              />
            </div>

            {/* Filtro por Precio Mínimo */}
            <div className="filtro-campo">
              <label htmlFor="filtro-min-precio">Precio Mínimo:</label>
              <input
                type="number"
                id="filtro-min-precio"
                placeholder="$ 0"
                value={filtroMinPrecio}
                onChange={(e) => setFiltroMinPrecio(e.target.value)}
                min="0"
              />
            </div>

            {/* Filtro por Precio Máximo */}
            <div className="filtro-campo">
              <label htmlFor="filtro-max-precio">Precio Máximo:</label>
              <input
                type="number"
                id="filtro-max-precio"
                placeholder="$ 999999"
                value={filtroMaxPrecio}
                onChange={(e) => setFiltroMaxPrecio(e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="filtros-acciones">
            <button className="btn-aplicar-filtros" onClick={aplicarFiltros}>
              Aplicar Filtros
            </button>
            <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
              Limpiar Filtros
            </button>
          </div>

          {/* Indicador de filtros activos */}
          {hayFiltrosActivos() && (
            <div className="filtros-activos">
              <strong>Filtros activos:</strong>
              {filtrosAplicados.titulo && (
                <span className="filtro-badge">
                  Título: {filtrosAplicados.titulo}
                </span>
              )}
              {filtrosAplicados.descripcion && (
                <span className="filtro-badge">
                  Descripción: {filtrosAplicados.descripcion}
                </span>
              )}
              {filtrosAplicados.categoria && (
                <span className="filtro-badge">
                  Categoría: {filtrosAplicados.categoria}
                </span>
              )}
              {filtrosAplicados.minPrecio && (
                <span className="filtro-badge">
                  Precio mín: ${filtrosAplicados.minPrecio}
                </span>
              )}
              {filtrosAplicados.maxPrecio && (
                <span className="filtro-badge">
                  Precio máx: ${filtrosAplicados.maxPrecio}
                </span>
              )}
            </div>
          )}
        </div>

        {pagination && (
          <div className="divider">
            <p className="results-count">
              Mostrando {productos.length} de {pagination.totalItems} resultados
            </p>
            <div className="order-by-container">
              <label htmlFor="order-by-select">Ordenar por </label>
              <select
                id="order-by-select"
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
              >
                <option value="Mayor Precio">Mayor Precio</option>
                <option value="Menor Precio">Menor Precio</option>
                <option value="Más Vendidos">Más Vendidos</option>
                <option value="Menos Vendidos">Menos Vendidos</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {!Array.isArray(productos) || productos.length === 0 ? (
        <div className="no-results">
          <h3>No se encontraron productos que coincidan con tu búsqueda</h3>
          <p>Intenta buscar con otros términos o en otra categoría</p>
        </div>
      ) : (
        <>
          <div className="results-grid">
            {productos.map((producto) => (
              <div key={producto.id} className="product-card">
                <Link to={`/productos/${producto.id}`} className="product-link">
                  {producto.fotos && producto.fotos.length > 0 && (
                    <div className="product-image">
                      <img
                        src={producto.fotos[0]}
                        alt={producto.titulo}
                        onError={(e) => {
                          e.target.src =
                            'https://via.placeholder.com/300x200?text=Sin+Imagen';
                        }}
                      />
                    </div>
                  )}

                  <div className="product-info">
                    <h3 className="product-title">{producto.titulo}</h3>
                    <p className="product-description">
                      {producto.descripcion}
                    </p>

                    <div className="product-details">
                      <div className="product-categories">
                        {producto.categorias &&
                          producto.categorias.slice(0, 2).map((categoria) => (
                            <span
                              key={categoria.nombre}
                              className="product-category"
                            >
                              {categoria.nombre}
                            </span>
                          ))}
                        {producto.categorias &&
                          producto.categorias.length > 2 && (
                            <span className="product-category-more">
                              +{producto.categorias.length - 2} más
                            </span>
                          )}
                      </div>
                      <span className="product-stock">
                        {producto.stock > 0
                          ? `${producto.stock} disponibles`
                          : 'Sin stock'}
                      </span>
                    </div>

                    <div className="product-footer">
                      <p className="product-price">
                        {formatearPrecio(producto.precio, producto.moneda)}
                      </p>
                      {producto.cantidadVentas > 0 && (
                        <span className="product-sales">
                          {producto.cantidadVentas} vendidos
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>

              <div className="pagination-numbers">
                {/* Primera página */}
                {currentPage > 3 && (
                  <>
                    <button
                      className="pagination-number"
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="pagination-ellipsis">...</span>
                    )}
                  </>
                )}

                {/* Páginas cercanas */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === currentPage ||
                      page === currentPage - 1 ||
                      page === currentPage + 1 ||
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    );
                  })
                  .map((page) => (
                    <button
                      key={page}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                {/* Última página */}
                {currentPage < pagination.totalPages - 2 && (
                  <>
                    {currentPage < pagination.totalPages - 3 && (
                      <span className="pagination-ellipsis">...</span>
                    )}
                    <button
                      className="pagination-number"
                      onClick={() => handlePageChange(pagination.totalPages)}
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* Información de paginación */}
          {pagination && (
            <div className="pagination-info">
              <p>
                Página {pagination.currentPage} de {pagination.totalPages}{' '}
                <space></space>({pagination.totalItems} productos en total)
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
