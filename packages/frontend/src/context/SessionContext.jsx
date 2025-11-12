import { createContext, useContext, useState } from 'react';
import {
  getUsuarioByEmail,
  crearUsuario,
  validarPassword,
} from '../services/usuarioService';

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

  const login = async (userData) => {
    try {
      const user = await getUsuarioByEmail(userData.email);

      // Verificar contraseña (esto debería hacerse en el backend idealmente)
      const isValid = await validarPassword(userData.email, userData.password);
      if (!isValid) {
        return { success: false, error: 'Credenciales incorrectas' };
      }

      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Error durante el login:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Error al iniciar sesión. Verifica tus credenciales.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    console.log('SessionContext: Logout ejecutado');
    setUser(null); // Limpia el user del estado y localStorage
  };

  const register = async (registerData) => {
    const newUser = {
      nombre: registerData.nombre,
      email: registerData.email,
      telefono: registerData.telefono,
      tipo: registerData.tipoUsuario,
      password: registerData.password,
    };

    try {
      const createdUser = await crearUsuario(newUser);
      // Hacer login automático tras el registro con las credenciales
      const loginResult = await login({
        email: createdUser.email,
        password: registerData.password,
      });
      return loginResult;
    } catch (error) {
      console.error('Error durante el registro:', error);

      if (Array.isArray(error.response?.data)) {
        const errorMessage =
          error.response?.data
            ?.map((element) => {
              return element.message;
            })
            .join('. \n') ||
          'Error durante el registro. Por favor, intenta de nuevo.';
        return { success: false, error: errorMessage };
      } else {
        const errorMessage =
          error.response?.data?.message ||
          'Error durante el registro. Por favor, intenta de nuevo.';
        return { success: false, error: errorMessage };
      }
    }
  };

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
