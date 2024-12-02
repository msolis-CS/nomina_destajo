import axios from 'axios';
import { appsettings } from '../settings/ApiUrl';

const api_empleado = appsettings.apiUrl+'Empleado/'

export const getEmpleados = async () => {
  try {
    const response = await axios.get(api_empleado+'List');
    return response.data;
  } catch (error) {
    console.error("Error al obtener empleados", error);
    throw error; 
  }
};
