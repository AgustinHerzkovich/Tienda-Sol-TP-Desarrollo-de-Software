import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import AuthFormContainer from '../common/AuthFormContainer';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import { useToast } from '../common/Toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useSession();
  const { showToast } = useToast();

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

    if (formData.email && formData.password.length > 3) {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        showToast('¡Inicio de sesión exitoso!', 'success');
        navigate('/');
      } else {
        showToast(result.error, 'error');
      }
    } else {
      showToast(
        'Por favor ingresa un email válido y una contraseña de al menos 4 caracteres',
        'error'
      );
    }
  };

  return (
    <AuthFormContainer title="Iniciar Sesión" onSubmit={handleSubmit}>
      <FormInput
        label="Correo Electrónico"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        required
        placeholder="tu@email.com"
        autoComplete="email"
      />

      <FormInput
        label="Contraseña"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        required
        placeholder="••••••••"
        autoComplete="current-password"
      />

      <Button type="submit" variant="primary" fullWidth>
        Iniciar Sesión
      </Button>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Link to="/forgot-password">
          <Button variant="link">¿Olvidaste tu contraseña?</Button>
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        ¿No tienes una cuenta?{' '}
        <Link
          to="/register"
          style={{ color: 'var(--primary-purple, #22223b)', fontWeight: 600 }}
        >
          Crear cuenta
        </Link>
      </div>
    </AuthFormContainer>
  );
}
