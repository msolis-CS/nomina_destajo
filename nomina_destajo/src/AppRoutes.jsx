import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import TipoMaquinaPage from './pages/TipoMaquinaPage'
import MaquinaCalibrePage from './pages/MaquinaCalibrePage'
import Logout from './pages/Logout'

const AppRoutes = [
  {
    path: '/',
    element: <HomePage/>,
    requireAuth: true,
  },
  {
    path: '/logout',
    element: <Logout/>,
    requireAuth: true,
  },
  {
    path: '/mantenimiento/tipomaquina',
    element: <TipoMaquinaPage/>,
    requireAuth: true,
  },
  {
    path: '/mantenimiento/maquinacalibre',
    element: <MaquinaCalibrePage/>,
    requireAuth: true,
  },
  {
    path: '/login',
    element: <LoginPage/>,
    requireAuth: false,
  },
]

export default AppRoutes
