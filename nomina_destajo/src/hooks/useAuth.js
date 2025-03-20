import { useState, useEffect } from 'react';
import { login, logout, checkLoginStatus, getCurrentUser } from '../apis/login.js';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const status = await checkLoginStatus();
        // console.log("checkLoginStatus() response:", status);
        setIsAuthenticated(!!status?.isLoggedIn);
  
        if (status?.IsLoggedIn) {
          const userResponse = await getCurrentUser();
          // console.log("getCurrentUser() response:", userResponse);
          setUser(userResponse?.UserData || null);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error en autenticación:", error);
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
      const loginResponse = await login(username, password, rememberMe);
      console.log('Login response:', loginResponse);
      setUser(loginResponse?.user || null);
      setIsAuthenticated(!!loginResponse?.user);
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
