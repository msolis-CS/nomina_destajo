import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import TipoMaquinaPage from './pages/TipoMaquinaPage';
import MaquinaCalibrePage from './pages/MaquinaCalibrePage';
import NominaPage from './pages/NominaPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import Logout from './pages/Logout';
import ReportPage from './pages/ReportPage';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/mantenimiento/tipomaquina" element={<TipoMaquinaPage />} />
          <Route path="/mantenimiento/maquinacalibre" element={<MaquinaCalibrePage />} />
          <Route path="/procesamiento/nomina" element={<NominaPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/reportes" element={<ReportPage />} />
        </Route>
      </Routes>
    </Layout>
  );
};

export default App;
