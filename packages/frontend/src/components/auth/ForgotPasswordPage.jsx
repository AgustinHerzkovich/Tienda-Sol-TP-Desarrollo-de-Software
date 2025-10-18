import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthFormContainer from '../common/AuthFormContainer';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import { useToast } from '../common/Toast';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
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
            showToast('Por favor ingresa tu email', 'error');
            return;
        }

        if (formData.newPassword.length < 8) {
            showToast('La contraseña debe tener al menos 8 caracteres', 'error');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            showToast('Las contraseñas no coinciden', 'error');
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

            showToast('¡Contraseña actualizada exitosamente!', 'success');
            navigate('/login');
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            
            if (error.response?.status === 404) {
                showToast('No se encontró un usuario con ese email', 'error');
            } else if (error.response?.status === 401) {
                showToast('Email no encontrado en el sistema', 'error');
            } else if (error.response?.status === 400) {
                const mensaje = error.response?.data?.message || 'La contraseña no cumple con los requisitos de seguridad';
                showToast(mensaje, 'error');
            } else {
                showToast('Error al cambiar la contraseña. Por favor, intenta de nuevo.', 'error');
            }
        }
    };

    return (
        <AuthFormContainer title="Recuperar Contraseña" onSubmit={handleSubmit}>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
                Ingresa tu email y tu nueva contraseña
            </p>

            <FormInput
                label="Correo Electrónico"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Ingresa tu email"
                required
                autoComplete="email"
            />

            <FormInput
                label="Nueva Contraseña"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Ingresa tu nueva contraseña"
                required
                autoComplete="new-password"
            />

            <FormInput
                label="Confirmar Contraseña"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirma tu nueva contraseña"
                required
                autoComplete="new-password"
            />

            <Button type="submit" variant="primary" fullWidth>
                Cambiar Contraseña
            </Button>

            <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                ¿Recordaste tu contraseña?{' '}
                <Link to="/login" style={{ color: 'var(--primary-purple, #22223b)', fontWeight: 600 }}>
                    Iniciar sesión
                </Link>
            </div>
        </AuthFormContainer>
    );
}