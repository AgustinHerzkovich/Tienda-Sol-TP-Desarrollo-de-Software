import './RegisterPage.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

        <div className="register-footer">
                    <p>
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="back-to-login-link">
                            Volver al inicio de sesión
                        </Link>
                    </p>
                </div>

        </div>
    </div>);

} 