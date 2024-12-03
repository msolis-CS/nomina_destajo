import axios from 'axios';
import { appsettings } from '../settings/ApiUrl';

const api_tipo_maquina = appsettings.apiUrl+'TipoMaquina/'

export const getTipoMaquinas = async () => {
  try {
    const response = await axios.get(api_tipo_maquina+'List');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los tipos de maquina", error);
    throw error; 
  }
};