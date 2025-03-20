import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './useAuth'; 

const ProtectedRoute = ({element}) => {
  const { isAuthenticated, loading } = useAuth(); 

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
