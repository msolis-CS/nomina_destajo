import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = () => {
  const token = Cookies.get('SoftlandAuth');
  console.log(token)
  if (!token) {
   // return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;

