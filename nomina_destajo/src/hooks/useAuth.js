import { useState, useEffect } from 'react';
import { login, logout, checkLoginStatus, getCurrentUser } from '../apis/login.js';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const { IsLoggedIn } = await checkLoginStatus();
        setIsAuthenticated(IsLoggedIn);

        if (IsLoggedIn) {
          const { UserData } = await getCurrentUser();
          setUser(UserData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error al verificar el estado de autenticación:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthStatus();
  }, []);

  // Iniciar sesión
  const handleLogin = async (username, password, rememberMe = false) => {
    try {
      const { user } = await login(username, password, rememberMe);
      console.log(user)
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login: handleLogin,
    logout: handleLogout,
  };
};

export default useAuth;
