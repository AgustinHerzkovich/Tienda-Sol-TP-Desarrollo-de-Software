import { useState, useEffect } from "react";
import "./ProductoCarousel.css";
import CarouselItem from "../productoItem/CarouselItem.jsx";
import axios from "axios";

export default function ProductoCarousel() {
  const [index, setIndex] = useState(0);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const visible = 3;
  const productosEndpoint = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/productos`;

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(productosEndpoint, {
          params: {
            limit: 10,
            sort: 'precio',
            order: 'asc'
          }
        });
        // El backend retorna { productos: [...], pagination: {...} }
        setProductos(response.data.productos || []);
      } catch (error) {
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [productosEndpoint]);

  const siguiente = () => {
    if (index < productos.length - visible) setIndex(index + 1);
  };

  const anterior = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (loading) {
    return <p className="carousel-empty">Cargando productos...</p>;
  }

  if (!Array.isArray(productos) || productos.length === 0) {
    return <p className="carousel-empty">No hay productos disponibles</p>;
  }

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Ofertas de fin de semana</h2>

      <div className="carousel-wrapper">
        <div className="carousel-viewport">
          <div className="carousel-track"
          style={{
              transform: `translateX(-${index * (100 / visible)}%)`,
            }}>
            {productos.map((producto) => (
              <CarouselItem producto={producto} key={producto.id}/> 
            ))}
          </div>
        </div>

        <button
          onClick={anterior}
          disabled={index === 0}
          className={`carousel-btn left-btn ${
            index === 0 ? "disabled" : ""
          }`}
        >
          ◀
        </button>

        <button
          onClick={siguiente}
          disabled={index >= productos.length - visible}
          className={`carousel-btn right-btn ${
            index >= productos.length - visible ? "disabled" : ""
          }`}
        >
          ▶
        </button>
      </div>
    </div>
  );
}