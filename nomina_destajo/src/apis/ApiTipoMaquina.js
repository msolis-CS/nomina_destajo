import axios from 'axios';
import { appsettings } from '../settings/ApiUrl';

const api_tipo_maquina = appsettings.apiUrl + 'TipoMaquina/';

const config = {
  headers: {
    'Content-Type': 'application/json',
  }
}

export const getTipoMaquinas = async () => {
  try {
    const response = await axios.get(`${api_tipo_maquina}List`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los tipos de máquina:', error);
    throw error;
  }
};

export const getTipoMaquinasActivas = async () => {
  try {
    const response = await axios.get(`${api_tipo_maquina}ListActive`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los tipos de máquina:', error);
    throw error;
  }
};


export const getTipoMaquinaById = async (id) => {
  try {
    const response = await axios.get(`${api_tipo_maquina}Get?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el tipo de máquina con ID ${id}:`, error);
    throw error;
  }
};

export const saveTipoMaquina = async (tipoMaquina) => {
  try {
    const response = await axios.post(`${api_tipo_maquina}Save`, tipoMaquina);
    return response.data;
  } catch (error) {
    console.error('Error al guardar el tipo de máquina:', error);
    throw new Error(error.response?.data?.message || 'Error al comunicarse con el servidor.');
  }
};

export const updateTipoMaquina = async (id, tipoMaquina) => {
  try {
    const url = `${api_tipo_maquina}Update?id=${id}`;
    const response = await axios.put(url, tipoMaquina, config);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el tipo de máquina con ID ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Error al comunicarse con el servidor.');
  }
};

export const deleteTipoMaquina = async (id) => {
  try {
    const response = await axios.delete(`${api_tipo_maquina}Delete?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el tipo de máquina:', error);
    throw new Error(error.response?.data?.message || 'Error al comunicarse con el servidor.');
  }
};
