import './ForgotPasswordPage.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const usuariosEndpoint = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/usuarios`;

    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
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
        if (!formData.email) {
            alert('Por favor ingresa tu email');
            return;
        }

        if (formData.newPassword.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            // Primero obtener el usuario por email para conseguir su ID
            // No enviamos password para que solo busque por email sin validar contraseña
            const responseGet = await axios.get(usuariosEndpoint, {
                params: { 
                    email: formData.email
                    // Sin password = solo búsqueda por email para recuperación de contraseña
                }
            });

            // Si no existe el usuario, el backend devolverá 404
            const usuario = responseGet.data;
            
            // Ahora hacer PATCH para actualizar la contraseña
            await axios.patch(`${usuariosEndpoint}/${usuario.id}`, {
                password: formData.newPassword
            });

            alert('¡Contraseña actualizada exitosamente!');
            navigate('/login');
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            
            if (error.response?.status === 404) {
                alert('No se encontró un usuario con ese email');
            } else if (error.response?.status === 401) {
                alert('Email no encontrado en el sistema');
            } else if (error.response?.status === 400) {
                const mensaje = error.response?.data?.message || 'La contraseña no cumple con los requisitos de seguridad';
                alert(mensaje);
            } else {
                alert('Error al cambiar la contraseña. Por favor, intenta de nuevo.');
            }
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-page-container">
                <div className="forgot-password-header">
                    <h1>Recuperar Contraseña</h1>
                    <p>Ingresa tu email y tu nueva contraseña</p>
                </div>

                <form className="forgot-password-form" onSubmit={handleSubmit}>
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
                        <label htmlFor="newPassword">Nueva Contraseña</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu nueva contraseña"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirma tu nueva contraseña"
                            required
                        />
                    </div>

                    <button type="submit" className="forgot-password-button-primary">
                        Cambiar Contraseña
                    </button>
                </form>

                <div className="forgot-password-footer">
                    <p>
                        ¿Recordaste tu contraseña?{' '}
                        <Link to="/login" className="back-to-login-link">
                            Volver al inicio de sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}