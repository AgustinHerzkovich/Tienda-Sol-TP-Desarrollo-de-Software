import './Pagination.css';

/**
 * Componente de paginación reutilizable
 * @param {Object} props
 * @param {number} props.currentPage - Página actual
 * @param {number} props.totalPages - Total de páginas
 * @param {number} props.totalItems - Total de items
 * @param {Function} props.onPageChange - Callback cuando cambia la página
 */
export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (totalPages <= 1) return null;

  return (
    <>
      {/* Paginación */}
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
          {Array.from({ length: totalPages }, (_, i) => i + 1)
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
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="pagination-ellipsis">...</span>
              )}
              <button
                className="pagination-number"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente →
        </button>
      </div>

      {/* Información de paginación */}
      <div className="pagination-info">
        <p>
          Página {currentPage} de {totalPages} ({totalItems}{' '}
          {totalItems === 1 ? 'resultado' : 'resultados'} en total)
        </p>
      </div>
    </>
  );
}
