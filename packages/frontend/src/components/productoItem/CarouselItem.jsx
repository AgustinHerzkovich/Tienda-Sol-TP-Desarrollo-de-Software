import "./CarouselItem.css";
import { Link } from "react-router-dom";   
import { FaCartPlus } from "react-icons/fa";
import "../../index.css"
import { useAddToCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";

const CarouselItem = ({producto}) => {
  const addToCart = useAddToCart();
  const { formatearPrecio } = useCurrency();

  const handleAddToCart = () => {
    console.log('CarouselItem: Intentando añadir al carrito:', producto.titulo);
    addToCart(producto);
  };

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
               Precio: {formatearPrecio(producto.precio, producto.moneda)}
            </span>
          </div>
          <div className="botones-container">
            <div className="ver-detalles-container">
              <span className="ver-detalles">
                <Link to={`/productos/${producto.id}`} className="link-no-style">Ver Detalles</Link>
              </span>
            </div>
            <div className="añadir-carrito-container">
              <button className="añadir-carrito" onClick={handleAddToCart}>
                <FaCartPlus />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarouselItem