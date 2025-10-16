import './NewProduct.css';
import { FiPlus } from "react-icons/fi";

export default function NewProduct() {
  const handleNewProductClick = () => {
    console.log('Nuevo producto');
  };

  return (
    <div className="newproduct-container">
      <button className="newproduct-button" title="Nuevo Producto" onClick={handleNewProductClick}>
        <FiPlus />
      </button>
    </div>
  );
}