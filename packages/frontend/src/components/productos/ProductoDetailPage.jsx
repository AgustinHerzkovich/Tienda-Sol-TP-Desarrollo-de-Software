import { useParams } from "react-router-dom";
import { productos } from "../../mock/productos";
import { useState } from "react";
import './ProductoDetailPage.css';

export default function ProductDetailPage() {
    const { id } = useParams();
    const producto = productos.find(p => p.id === parseInt(id));
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!producto) {
        return <div className='producto-detail-container'>
            <div className='producto-header'>
                <h1>Producto no encontrado</h1>
                <p>Lo sentimos, no pudimos encontrar el producto que estás buscando.</p>
            </div>
        </div>;
    }

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === producto.fotos.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? producto.fotos.length - 1 : prevIndex - 1
        );
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };
    
    return (
        <div className="producto-detail-container">
            <div className="producto-main-content">
                {/* Sección de imágenes con carousel */}
                <div className="producto-gallery">
                    <div className="main-image-container">
                        <img
                            src={producto.fotos[currentImageIndex]}
                            alt={`${producto.titulo} - Imagen ${currentImageIndex + 1}`}
                            className="main-image"
                        />
                        
                        {producto.fotos.length > 1 && (
                            <>
                                <button 
                                    className="nav-arrow nav-arrow-left" 
                                    onClick={prevImage}
                                    aria-label="Imagen anterior"
                                >
                                    ◀
                                </button>
                                <button 
                                    className="nav-arrow nav-arrow-right" 
                                    onClick={nextImage}
                                    aria-label="Siguiente imagen"
                                >
                                    ▶
                                </button>
                            </>
                        )}
                    </div>
                    
                    {/* Thumbnails */}
                    {producto.fotos.length > 1 && (
                        <div className="thumbnails-container">
                            {producto.fotos.map((foto, index) => (
                                <img
                                    key={index}
                                    src={foto}
                                    alt={`${producto.titulo} - Miniatura ${index + 1}`}
                                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => goToImage(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Información del producto */}
                <div className="producto-info">
                    <div className="producto-header">
                        <h1 className="producto-titulo">{producto.titulo}</h1>
                        <div className="producto-categories">
                            {producto.categorias.map((categoria, index) => (
                                <span key={index} className="category-badge">
                                    {categoria.nombre}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="producto-description">
                        <p>{producto.descripcion}</p>
                    </div>

                    <div className="producto-price-container">
                        <div className="producto-precio">
                            ${producto.precio?.toLocaleString('es-AR')}
                        </div>
                        <div className="price-currency">{producto.moneda === 'PESO_ARG' ? 'Pesos Argentinos' : producto.moneda}</div>
                        <div className="price-details">Impuestos incluidos • Envío gratis</div>
                    </div>

                    <div className="producto-stock-info">
                        <div className="stock-status">
                            <span className={`stock-indicator ${producto.stock > 10 ? 'in-stock' : producto.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                                {producto.stock > 10 ? '✓ En stock' : producto.stock > 0 ? `⚠ Quedan ${producto.stock}` : '✗ Sin stock'}
                            </span>
                        </div>
                    </div>

                    <div className="producto-actions">
                        <button 
                            className="btn-comprar" 
                            disabled={producto.stock === 0}
                        >
                            {producto.stock > 0 ? 'Comprar ahora' : 'Sin stock'}
                        </button>
                        <button className="btn-carrito">
                            Agregar al carrito
                        </button>
                    </div>

                    <div className="producto-features">
                        <div className="feature-item">
                            <span className="feature-icon">🚚</span>
                            <span>Envío gratis a todo el país</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🔒</span>
                            <span>Compra segura</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">↩️</span>
                            <span>30 días para devolver</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}