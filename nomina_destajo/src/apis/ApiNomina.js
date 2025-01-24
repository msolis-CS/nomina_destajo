import axios from 'axios';
import { appsettings } from '../settings/ApiUrl';

const api_nomina = appsettings.apiUrl+'Nomina/'

export const getNominas = async () => {
  try {
    const response = await axios.get(`${api_nomina}List`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener nominas", error);
    throw error; 
  }
};

export const getNominaId = async (id) => {
  try {
    const response = await axios.get(`${api_nomina}Get/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la nómina ${id}:`, error);
    throw error;
  }
};

export const getConsecutivos = async (id) => {
  try {
    const response = await axios.get(`${api_nomina}GetConsecutivos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener los consecutivos ${id}:`, error);
    throw error;
  }
};


export const updateEstadoNomina = async (nominaId) => {
  try {
    const url = `${api_nomina}Update?nominaId=${nominaId}`;
    const response = await axios.put(url);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la nómina con ID ${nominaId}:`, error);
    throw new Error(error.response?.data?.message || 'Error al comunicarse con el servidor.');
  }
};
