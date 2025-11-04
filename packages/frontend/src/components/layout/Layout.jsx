import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import Footer from './footer/Footer';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        <h1 className="sr-only">Tienda Sol - Plataforma</h1>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
