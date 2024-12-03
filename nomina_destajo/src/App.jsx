// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import EmpleadoPage from './pages/EmpleadoPage';
import TipoMaquinaPage from './pages/TipoMaquinaPage';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/empleadoList" element={<EmpleadoPage />} />
        <Route path="/tipoMaquinaList" element={<TipoMaquinaPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
