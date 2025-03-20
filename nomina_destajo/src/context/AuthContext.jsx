import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRoute, setLastRoute] = useState("/"); // Guarda la última ruta antes del login

  useEffect(() => {
    // Simulación de verificación de sesión
    const userSession = localStorage.getItem("user");
    if (userSession) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, lastRoute, setLastRoute }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
