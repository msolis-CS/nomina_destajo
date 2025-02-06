
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-dark text-white p-3">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">

            <img src="/LOGO INCASA.png" alt="Logo" className="img-fluid me-2" style={{ width: "80px", height: "auto" }} />

            <span className="text-white">Nómina Destajo</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link text-white">Inicio</Link>
              </li>

              <li className="nav-item dropdown">
                <Link to="/procesamiento" className="nav-link dropdown-toggle text-white" id="procesamientoDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Procesamiento
                </Link>
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="procesamientoDropdown">
                  <li><Link to="/procesamiento/nomina" className="dropdown-item text-white">Nómina</Link></li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <Link to="/mantenimiento" className="nav-link dropdown-toggle text-white" id="mantenimientoDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Mantenimiento
                </Link>
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="mantenimientoDropdown">
                  <li><Link to="/mantenimiento/tipomaquina" className="dropdown-item text-white">Tipo de Máquina</Link></li>
                  <li><Link to="/mantenimiento/maquinacalibre" className="dropdown-item text-white">Calibre por Máquina</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link to="/reportes" className="nav-link text-white">Reportes</Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link text-white">Inicio Sesión</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

  );
};

export default Header;