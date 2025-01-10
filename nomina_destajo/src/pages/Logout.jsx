import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('SoftlandAuth'); 
    
    // Redirigir al login
    navigate('/login');
  };

  return <button onClick={handleLogout}>Cerrar sesión</button>;
};

export default Logout;
