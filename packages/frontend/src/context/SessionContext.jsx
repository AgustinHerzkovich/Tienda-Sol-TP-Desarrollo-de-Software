import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession debe ser usado dentro de un SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const usuariosEndpoint = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/usuarios`;

  const login = async (userData) => {
    try {
      const response = await axios.get(`${usuariosEndpoint}`, {
        params: { email: userData.email }
      });
      setUser(response.data);
      return true; // Éxito
    } catch (error) {
      console.error('Error durante el login:', error);
      alert('Error al iniciar sesión. Usuario no encontrado.');
      return false; // Error
    }
  };

  const logout = () => {
    console.log('SessionContext: Logout ejecutado');
    setUser(null);
  };

  const register = async (registerData) => {
    const newUser = {
      nombre: registerData.nombre,
      email: registerData.email,
      telefono: registerData.telefono,
      tipo: registerData.tipoUsuario
    }
    
    try {
      const response = await axios.post(usuariosEndpoint, newUser);
      const createdUser = response.data;
      await login(createdUser); // Hacer login automático tras el registro
      return true; // Éxito
    } catch (error) {
      console.error('Error durante el registro:', error);
      alert('Error durante el registro. Por favor, intenta de nuevo.');
      return false; // Error
    }
  }

  const isLoggedIn = () => {
    const loggedIn = !!user;
    console.log(
      'SessionContext: isLoggedIn verificación:',
      loggedIn,
      'Usuario:',
      user
    );
    return loggedIn;
  };

  const value = {
    user,
    login,
    logout,
    register,
    isLoggedIn,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
