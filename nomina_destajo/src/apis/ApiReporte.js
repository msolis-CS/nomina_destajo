import axios from 'axios';
import { appsettings } from '../settings/ApiUrl';

const apiReportes = appsettings.apiUrl + 'Reportes/';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const getReporte = async (tipoReporte) => {
  try {
    const response = await axios.get(`${apiReportes}PrintReport/${tipoReporte}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el reporte:', error);
    throw new Error('Hubo un problema al obtener el reporte.');
  }
};
