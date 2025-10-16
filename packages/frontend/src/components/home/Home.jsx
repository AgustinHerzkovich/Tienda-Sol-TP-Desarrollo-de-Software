import ProductoCarousel from '../productos/ProductoCarousel';
import './Home.css';

export default function Home() {
  return (
    <>
      <div className="home-body"></div>
      <div>
        <ProductoCarousel />
      </div>
    </>
  );
}
