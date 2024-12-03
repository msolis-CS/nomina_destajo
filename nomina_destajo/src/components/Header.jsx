
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-dark text-white p-3">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">Mi Aplicación</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">Inicio</Link>
              </li>
              <li className="nav-item dropdown">
                <Link to="/mantenimiento" className="nav-link dropdown-toggle" id="empleadoDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Mantenimiento
                </Link>
                <ul className="dropdown-menu" aria-labelledby="empleadoDropdown">
                  <li><Link to="/tipoMaquinaList" className="dropdown-item">Tipo de Máquina</Link></li>
                  <li><Link to="/calibreMaquinaList" className="dropdown-item">Calibre por Máquina</Link></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <Link to="/empleado" className="nav-link dropdown-toggle" id="empleadoDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Empleado
                </Link>
                <ul className="dropdown-menu" aria-labelledby="empleadoDropdown">
                  <li><Link to="/empleadoList" className="dropdown-item">Listado de Empleados</Link></li>
                  <li><Link to="/empleado/nuevo" className="dropdown-item">Registrar Empleado</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">Acerca de</Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Inicio Sesión</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;