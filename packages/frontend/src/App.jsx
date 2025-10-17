import { useState, useEffect } from 'react';
import './App.css';
import Home from './components/home/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProductDetailPage from './components/productos/ProductoDetailPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import CartPage from './components/cartPage/CartPage';
import { CartProvider } from './context/CartContext';
import { SessionProvider } from './context/SessionContext';
import { CurrencyProvider } from './context/CurrencyContext';
import SearchResultsPage from './components/productos/SearchResultsPage';
import PedidosPage from './components/pedidos/PedidosPage';

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/health`)
      .then((response) => response.json())
      .then((data) => setMessage(data.status))
      .catch((error) => console.error('Error cargando health.', error));
  }, []);

  if (!message) {
    return (
      <div className="error">
        <p>NO ANDA EL SERVIDOR</p>
        <p>Pero hey, al menos tenés esto mientras esperás...</p>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
  return (
    <div className="App">
      <SessionProvider>
        <CurrencyProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="productos/:id" element={<ProductDetailPage />} />
                  <Route path="productos" element={<SearchResultsPage />} />
                  <Route path="pedidos" element={<PedidosPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </CurrencyProvider>
      </SessionProvider>
    </div>
  );
}
