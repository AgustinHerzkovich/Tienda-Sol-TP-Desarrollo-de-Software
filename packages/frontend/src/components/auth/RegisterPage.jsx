import './RegisterPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useSession();

    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        tipoUsuario: '',
        email: '',
        password: '',
        repeatPassword: ''
    })

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
            if (formData.password !== formData.repeatPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            console.log('Registro exitoso con:', formData);

        // Hacer registro directamente
        const success = await register({ email: formData.email, password: formData.password, nombre: formData.nombre, telefono: formData.telefono, tipoUsuario: formData.tipoUsuario });

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

    const handleGoogleRegister = (e) => {
        e.preventDefault();
        // TODO: Lógica de registro con Google
        console.log('Google register attempt');
    }

    return (<div className="register-page">
        <div className="register-page-container">
            <div className="register-header">
                <h1>Registrate</h1>
                <p>Crea tu cuenta para comenzar a comprar</p>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="nombre">Nombre y Apellido</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ingresa tu nombre y apellido"
              required
                />
                </div>
                
                <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="Ingresa tu teléfono"
                        required
                    />
            </div>

            <div className="form-group">
                    <label htmlFor="tipoUsuario">Tipo de Usuario</label>
                    <select
                        id="tipoUsuario"
                        name="tipoUsuario"
                        value={formData.tipoUsuario}
                        onChange={handleInputChange}
                    >
                        <option value="">Selecciona un tipo de usuario</option>
                        <option value="COMPRADOR">COMPRADOR</option>
                        <option value="VENDEDOR">VENDEDOR</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
            </div>
            

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

            <div className="form-group">
                <label htmlFor="repeatPassword">Repetir Contraseña</label>
            <input
              type="password"
              id="repeatPassword"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleInputChange}
              placeholder="Repite tu contraseña"
              required
            />
            </div>

            <button type="submit" className="register-button-primary">
            Registrarse
          </button>

        </form>

        <div className="register-divider">
          <span>O</span>
        </div>

        <button className="google-register-button" onClick={handleGoogleRegister}>
          <svg className="google-icon" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Registrarse con Google
        </button>
        </div>
    </div>);

} 