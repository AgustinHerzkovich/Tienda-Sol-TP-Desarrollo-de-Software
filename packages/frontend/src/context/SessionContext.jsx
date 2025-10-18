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
  const [user, setUserState] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });


  const setUser = (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setUserState(user);
    } else {
      localStorage.removeItem('user');
      setUserState(null);
    }
  };

  const usuariosEndpoint = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/usuarios`;

  const login = async (userData) => {
    try {
      const response = await axios.get(`${usuariosEndpoint}`, {
        params: { 
          email: userData.email,
          password: userData.password 
        }
      });
      setUser(response.data);
      return { success: true }; // Éxito
    } catch (error) {
      console.error('Error durante el login:', error);
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      return { success: false, error: errorMessage }; // Error con mensaje
    }
  };

  const logout = () => {
    console.log('SessionContext: Logout ejecutado');
    localStorage.clear(); // Borra todo el localStorage
    window.location.reload() // Recarga la pagina
  };

  const register = async (registerData) => {
    const newUser = {
      nombre: registerData.nombre,
      email: registerData.email,
      telefono: registerData.telefono,
      tipo: registerData.tipoUsuario,
      password: registerData.password
    }
    
    try {
      const response = await axios.post(usuariosEndpoint, newUser);
      const createdUser = response.data;
      // Hacer login automático tras el registro con las credenciales
      const loginResult = await login({ email: createdUser.email, password: registerData.password });
      return loginResult; // Retorna el resultado del login
    } catch (error) {
      console.error('Error durante el registro:', error);
      const errorMessage = error.response?.data?.message || 'Error durante el registro. Por favor, intenta de nuevo.';
      return { success: false, error: errorMessage }; // Error con mensaje
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
