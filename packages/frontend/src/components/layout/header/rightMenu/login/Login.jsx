import './Login.css';
import { TbLogin2 } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
      <button
        className="login-button"
        title="Iniciar Sesión"
        onClick={handleLoginClick}
      >
        <TbLogin2 />
      </button>
    </div>
  );
}
