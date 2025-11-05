import './PedidosPage.css';



export default function PedidoPaginacion({
    totalPages, 
    currentPage, 
    setCurrentPage})
    {
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    return <>
      {totalPages > 1 && (
          <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            >
            ◀ Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            >
            Siguiente ▶
          </button>
        </div>
      )}
      </>
    }