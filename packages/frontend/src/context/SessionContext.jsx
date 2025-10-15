import { createContext, useContext, useState } from 'react';

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

    const login = (userData) => {
        console.log('SessionContext: Login ejecutado con:', userData);
        setUser(userData);
        console.log('SessionContext: Usuario establecido');
    };

    const logout = () => {
        console.log('SessionContext: Logout ejecutado');
        setUser(null);
    };

    const isLoggedIn = () => {
        const loggedIn = !!user;
        console.log('SessionContext: isLoggedIn verificación:', loggedIn, 'Usuario:', user);
        return loggedIn;
    };

    const value = {
        user,
        login,
        logout,
        isLoggedIn
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
};