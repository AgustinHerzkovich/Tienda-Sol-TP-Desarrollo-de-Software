import { useState, useEffect } from 'react';
import './ProductoCarousel.css';
import CarouselItem from '../productoItem/CarouselItem.jsx';
import { getProductos } from '../../services/productoService';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ProductoCarousel() {
  const [index, setIndex] = useState(0);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    const calcVisible = () => {
      const w = window.innerWidth;
      if (w <= 768) return 1; // mobile
      if (w <= 1024) return 2; // tablet
      return 3; // desktop
    };

    const update = () => setVisible(calcVisible());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const data = await getProductos({
          limit: 10,
          sort: 'precio',
          order: 'asc',
        });
        // El backend retorna { productos: [...], pagination: {...} }
        setProductos(data.productos || []);
      } catch (error) {
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Auto-play: avanza cada 3 segundos
  useEffect(() => {
    if (isPaused || productos.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        // Si llegó al final, vuelve al inicio
        if (prevIndex >= productos.length - visible) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 3000); // Cambia cada 3 segundos

    // Limpiar el intervalo cuando el componente se desmonta o cambian las dependencias
    return () => clearInterval(interval);
  }, [productos.length, visible, isPaused]);

  useEffect(() => {
    const maxIndex = Math.max(0, productos.length - visible);
    if (index > maxIndex) {
      setIndex(maxIndex);
    }
  }, [productos.length, visible, index]);

  const siguiente = () => {
    if (index < productos.length - visible) setIndex(index + 1);
  };

  const anterior = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando productos" />;
  }

  if (!Array.isArray(productos) || productos.length === 0) {
    return <p className="carousel-empty">No hay productos disponibles</p>;
  }

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h2 className="carousel-title">Ofertas de fin de semana</h2>

      <div className="carousel-wrapper">
        <div className="carousel-viewport">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${index * (100 / visible)}%)`,
            }}
          >
            {productos.map((producto) => (
              <CarouselItem producto={producto} key={producto.id} />
            ))}
          </div>
        </div>

        <button
          onClick={anterior}
          disabled={index === 0}
          className={`carousel-btn left-btn ${index === 0 ? 'disabled' : ''}`}
        >
          ◀
        </button>

        <button
          onClick={siguiente}
          disabled={index >= productos.length - visible}
          className={`carousel-btn right-btn ${
            index >= productos.length - visible ? 'disabled' : ''
          }`}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
