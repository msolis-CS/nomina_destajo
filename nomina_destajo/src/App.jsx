
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import EmpleadoPage from './pages/EmpleadoPage';
import TipoMaquinaPage from './pages/TipoMaquinaPage';
import MaquinaCalibrePage from './pages/MaquinaCalibrePage';
import NominaPage from './pages/NominaPage';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
        {/*<Route path="/empleadoList" element={<EmpleadoPage />} />*/}
        <Route path="/mantenimiento/tipomaquina" element={<TipoMaquinaPage />} />
        <Route path="/mantenimiento/maquinacalibre" element={<MaquinaCalibrePage />} />
        <Route path="/procesamiento/nomina" element={<NominaPage  />} />
      </Routes>
    </Layout>
  );
};

export default App;
