import axios from 'axios';
import { appsettings } from '../settings/ApiUrl';

const api_maquina_calibre = appsettings.apiUrl + 'CalibreMaquina/';

const config = {
  headers: {
    'Content-Type': 'application/json',
  }
}

export const getMaquinasCalibre = async () => {
  try {
    const response = await axios.get(`${api_maquina_calibre}List`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el detalle de maquinas por calibre:', error);
    throw error;
  }
};

export const getCalibresByMaquina = async (idTipoMaquina) => {
  try {
    const response = await axios.get(`${api_maquina_calibre}GetCalibres/${idTipoMaquina}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el detalle de maquina por calibre`, error);
    throw error;
  }
};

export const saveMaquinaCalibre = async (MaquinaCalibre) => {
  try {
    const response = await axios.post(`${api_maquina_calibre}Save`, MaquinaCalibre);
    return response.data;
  } catch (error) {
    console.error('Error al guardar el detalle de maquina por calibre:', error);
    throw error;
  }
};

export const updateMaquinaCalibre = async (idTipoMaquina, calibre, MaquinaCalibre) => {
  try {
    const response = await axios.put(`${api_maquina_calibre}Update/${idTipoMaquina}/${calibre}`, MaquinaCalibre, config
    );
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el detalle de maquina por calibre`, error);
    throw error;
  }
};

export const deleteMaquinaCalibre = async (idTipoMaquina, calibre) => {
  try {
    const response = await axios.delete(`${api_maquina_calibre}Delete/${idTipoMaquina}/${calibre}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el detalle de maquinas por calibre:`, error);
    throw error;
  }
};
