import React, { useState } from "react";
import "./ProductoCarousel.css";
import CarouselItem from "../productoItem/CarouselItem.jsx";
import { mockProductos } from "../../mock/productos.js";

export default function ProductoCarousel() {
  const [index, setIndex] = useState(0);
  const visible = 3;

  const siguiente = () => {
    if (index < mockProductos.length - visible) setIndex(index + 1);
  };

  const anterior = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (!Array.isArray(mockProductos) || mockProductos.length === 0) {
    return <p className="carousel-empty">No hay productos disponibles</p>;
  }

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Ofertas para el fin de semana</h2>

      <div className="carousel-wrapper">
        <div className="carousel-viewport">
          <div className="carousel-track"
          style={{
              transform: `translateX(-${index * (100 / visible)}%)`,
            }}>
            {mockProductos.map((producto) => (
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
          disabled={index >= mockProductos.length - visible}
          className={`carousel-btn right-btn ${
            index >= mockProductos.length - visible ? "disabled" : ""
          }`}
        >
          ▶
        </button>
      </div>
    </div>
  );
}