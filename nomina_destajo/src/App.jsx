import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './hooks/ProtectedRoute.jsx';
import AppRoutes from './AppRoutes.jsx';

const App = () => {
  return (
    <Layout>

      <Routes>
        {
          AppRoutes.map((route, index) => {
            const { element, requireAuth, ...rest } = route
            return <Route key={index} {...rest}
              element={requireAuth ? <ProtectedRoute {...rest} element={element} /> : element} />
          })
        }
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
