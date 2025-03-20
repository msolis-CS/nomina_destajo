import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation(); 

  if (loading) {
    return <div>Cargando...</div>;
  }
  console.log(location)
  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
