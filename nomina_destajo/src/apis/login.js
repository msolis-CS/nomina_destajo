import axios from 'axios';
import { appsettings } from '../settings/ApiUrl';

const api_login = appsettings.apiUrl + 'Login/';

export const login = async (username, password, rememberMe) => {
  try {
    const response = await axios.post(
      `${api_login}`,
      { Username: username, Password: password, RememberMe: rememberMe },
      { 
        headers: { 'Content-Type': 'application/json' }, 
        withCredentials: true 
      }
    );  
    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.error || 'Error en el inicio de sesión');
    }
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw error;
  }
};

export const checkLoginStatus = async () => {
  try {
    const response = await axios.get(`${api_login}IsLoggedIn`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error verificando el estado de inicio de sesión:', error);
    throw new Error(error.response?.data?.message || 'Error al comunicarse con el servidor.');
  }
};


export const logout = async () => {
  try {
    const response = await axios.post(`${api_login}Logout`, {}, { 
      headers: { 'Content-Type': 'application/json' }, 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    console.error('Error al cerrar sesión:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al comunicarse con el servidor.');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${api_login}CurrentUser`, { 
      headers: { 'Content-Type': 'application/json' }, 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null; // Usuario no autenticado
    }
    console.error('Error al obtener el usuario actual:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al comunicarse con el servidor.');
  }
};
