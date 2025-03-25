import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../hooks/useAuth";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Auth.logout();
    navigate("/login"); 
  }, []);

  return <p>Cerrando sesión...</p>;
};

export default Logout;
