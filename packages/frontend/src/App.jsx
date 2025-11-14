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
import { ToastProvider } from './context/ToastContext';

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/health`)
      .then((response) => response.json())
      .then((data) => setMessage(data.status))
      .catch((error) => console.error('Error cargando health.', error));
  }, []);

  if (!message) {
    return (
      <div className="server-down">
        <div className="server-down-card">
          <img
            src={`${process.env.PUBLIC_URL || ''}/favicon.ico`}
            alt="Tienda Sol logo"
            className="server-logo"
          />
          <h2>Servidor no disponible</h2>
          <p>
            Estamos teniendo problemas para conectarnos con el servidor. Por
            favor, intentá recargar la página en unos minutos.
          </p>
          <div className="server-actions">
            <button
              className="btn-retry"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="App">
      <ToastProvider>
        <SessionProvider>
          <CurrencyProvider>
            <CartProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route
                      path="productos/:id"
                      element={<ProductDetailPage />}
                    />
                    <Route path="productos" element={<SearchResultsPage />} />
                    <Route path="pedidos" element={<PedidosPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </CurrencyProvider>
        </SessionProvider>
      </ToastProvider>
    </div>
  );
}
