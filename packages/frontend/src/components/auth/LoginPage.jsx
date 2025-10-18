import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useSession } from '../../context/SessionContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useSession();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (formData.email && formData.password.length > 3) {
      console.log('Login exitoso con:', formData);

      // Hacer login directamente
      const success = await login({ email: formData.email, password: formData.password });

      if (success) {
        // Navegar de vuelta a home
        navigate('/');
      }
    } else {
      alert(
        'Por favor ingresa un email válido y una contraseña de al menos 4 caracteres'
      );
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Lógica de login con Google
    console.log('Google login attempt');
  };

  return (
    <div className="login-page">
      <div className="login-page-container">
        <div className="login-header">
          <h1>Iniciar Sesión</h1>
          <p>Accede a tu cuenta de Tienda Sol</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ingresa tu email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <button type="submit" className="login-button-primary">
            Iniciar Sesión
          </button>
        </form>

        <div className="login-links">
          <Link to="/forgot-password" className="forgot-link">
            ¿Olvidaste tu contraseña?
          </Link>

          <div className="signup-prompt">
            <span>¿No tienes una cuenta?</span>
            <Link to="/register" className="signup-link">
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
