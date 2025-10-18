import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import AuthFormContainer from '../common/AuthFormContainer';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import { useToast } from '../common/Toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useSession();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    tipoUsuario: '',
    email: '',
    password: '',
    repeatPassword: ''
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
      if (formData.password !== formData.repeatPassword) {
        showToast('Las contraseñas no coinciden', 'error');
        return;
      }

      const result = await register({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        telefono: formData.telefono,
        tipoUsuario: formData.tipoUsuario
      });

      if (result.success) {
        showToast('¡Registro exitoso! Bienvenido', 'success');
        navigate('/');
      } else {
        showToast(result.error, 'error');
      }
    } else {
      showToast('Por favor ingresa un email válido y una contraseña de al menos 4 caracteres', 'error');
    }
  };

  return (
    <AuthFormContainer title="Registrate" onSubmit={handleSubmit}>
      <FormInput
        label="Nombre y Apellido"
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={handleInputChange}
        required
        placeholder="Tu nombre completo"
      />

      <FormInput
        label="Teléfono"
        type="tel"
        name="telefono"
        value={formData.telefono}
        onChange={handleInputChange}
        required
        placeholder="Tu número de teléfono"
      />

      <div className="form-input-group">
        <label htmlFor="tipoUsuario">Tipo de Usuario</label>
        <select
          id="tipoUsuario"
          name="tipoUsuario"
          value={formData.tipoUsuario}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecciona un tipo</option>
          <option value="COMPRADOR">Comprador</option>
          <option value="VENDEDOR">Vendedor</option>
        </select>
      </div>

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
        autoComplete="new-password"
      />

      <FormInput
        label="Repetir Contraseña"
        type="password"
        name="repeatPassword"
        value={formData.repeatPassword}
        onChange={handleInputChange}
        required
        placeholder="••••••••"
        autoComplete="new-password"
      />

      <Button type="submit" variant="primary" fullWidth>
        Registrarse
      </Button>

      <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" style={{ color: 'var(--primary-purple, #22223b)', fontWeight: 600 }}>
          Iniciar sesión
        </Link>
      </div>
    </AuthFormContainer>
  );
}