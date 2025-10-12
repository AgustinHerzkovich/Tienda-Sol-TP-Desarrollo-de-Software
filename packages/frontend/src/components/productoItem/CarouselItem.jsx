import "./CarouselItem.css";
import { Link } from "react-router-dom";   
import "../../index.css"

const CarouselItem = ({producto}) => {
  return (
    <div key={producto.id} className="carousel-card">
      <div className="producto-card">
        <img
          src={producto.fotos[0]}
          alt={producto.titulo}
          className="producto-image"
        />
        <div className="producto-info">
          <h3 className="producto-title">{producto.titulo}</h3>
          <p className="producto-description">{producto.descripcion}</p>
          <div className="producto-details">
            <span className="producto-cantidadVentas">{producto.cantidadVentas}</span>
            <span className="producto-price">
               Precio: ${producto.precio.toLocaleString("es-AR")}
            </span>
          </div>
          <div className="ver-detalles-container">
            <span className="ver-detalles glow">
              <Link to={`/productos/${producto.id}`} className="link-no-style">Ver Detalles</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarouselItem