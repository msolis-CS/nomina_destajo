import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './useAuth'; 

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth(); 

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
