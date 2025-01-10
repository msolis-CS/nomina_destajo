import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../apis/login';
import Cookies from 'js-cookie'; 

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Por favor, ingrese ambos campos.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(username, password, rememberMe);
      if (result.success) {       
        /*const expiresIn = rememberMe ? 365 : 1; // 365 días si "Recordarme", 1 día si no
        Cookies.set('SoftlandAuth', result.token, { 
          expires: expiresIn, 
          secure: true,  // Solo sobre HTTPS
          path: '/',  // Cookie disponible para todo el sitio
        });   */
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error.message || "Hubo un problema al intentar iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2>Iniciar sesión</h2>
      <div>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Recordarme
        </label>
      </div>
      <div>
        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
