import axios from 'axios';
import { appsettings } from '../settings/ApiUrl';

const api_empleado_nomina = appsettings.apiUrl + 'EmpleadoNomina/';

export const getEmpleadoByNomina = async (nominaId,consecutivo) => {
  try {
    const response = await axios.get(`${api_empleado_nomina}Get/${nominaId}/${consecutivo}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener los empleados`, error);
    throw error;
  }
};

