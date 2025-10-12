//import React, { useState, useEffect } from 'react';
import ProductoCarousel from '../productos/ProductoCarousel';
import './Home.css';
//import { getAllCategorias, getProductosByCategoria, formatPrice } from '../../mock';
/*
export default function Home() {
    const [categorias, setCategorias] = useState([]);
    const [productosPorCategoria, setProductosPorCategoria] = useState({});

    useEffect(() => {
        // Cargar categorías
        const categoriasData = getAllCategorias();
        setCategorias(categoriasData);

        // Cargar productos por categoría
        const productosData = {};
        categoriasData.forEach(categoria => {
            const productos = getProductosByCategoria(categoria.nombre);
            if (productos.length > 0) {
                productosData[categoria.nombre] = productos.slice(0, 5); // Máximo 5 productos por categoría
            }
        });
        setProductosPorCategoria(productosData);
    }, []);

    return (
        <div className="home">
            <div className="home-header">
                <h1>Productos por Categoría</h1>
            </div>
            
            <div className="categorias-container">
                {Object.entries(productosPorCategoria).map(([categoria, productos]) => (
                    <div key={categoria} className="categoria-section">
                        <h2 className="categoria-title">{categoria}</h2>
                        <div className="carousel-container">
                            <div className="productos-carousel">
                                {productos.map(producto => (
                                    <div key={producto.id} className="producto-card">
                                        <div className="producto-image">
                                            <img 
                                                src={producto.fotos[0]} 
                                                alt={producto.titulo}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                                }}
                                            />
                                        </div>
                                        <div className="producto-info">
                                            <h3 className="producto-titulo">{producto.titulo}</h3>
                                            <p className="producto-precio">
                                                {formatPrice(producto.precio, producto.moneda)}
                                            </p>
                                            <div className="producto-stock">
                                                Stock: {producto.stock}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
    */

export default function Home() {
    return (
      <>
      <div className="home-body">
      </div>
      <div>
        <ProductoCarousel />
      </div>
      </>
    )
};