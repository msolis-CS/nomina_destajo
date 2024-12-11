import axios from 'axios';
import { appsettings } from '../settings/ApiUrl';

const api_detalle_produccion = appsettings.apiUrl + 'DetalleProduccion/';

const config = {
  headers: {
    'Content-Type': 'application/json',
  }
};

export const getDetallesProduccion = async () => {
  try {
    const response = await axios.get(`${api_detalle_produccion}List`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los detalles de producción:', error);
    throw error;
  }
};

export const getDetalleProduccionById = async (nominaId, numeroNomina) => {
  try {
    const response = await axios.get(`${api_detalle_produccion}Get/${nominaId}/${numeroNomina}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el detalle de producción por ID:', error);
    throw error;
  }
};

export const saveDetalleProduccion = async (detalleProduccion) => {
  try {
    const response = await axios.post(`${api_detalle_produccion}Save`, detalleProduccion, config);
    return response.data;
  } catch (error) {
    console.error('Error al guardar el detalle de producción:', error);
    throw error;
  }
};

export const updateDetalleProduccion = async (nominaId, numeroNomina, empleadoId, tipoMaquinaId, calibre, diaFecha, detalleProduccion) => {
  try {
    const response = await axios.put(`${api_detalle_produccion}Update/${nominaId}/${numeroNomina}/${empleadoId}/${tipoMaquinaId}/${calibre}/${diaFecha}`, detalleProduccion, config);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el detalle de producción:', error);
    throw error;
  }
};

export const deleteDetalleProduccion = async (nominaId, numeroNomina, empleadoId, tipoMaquinaId, calibre, diaFecha) => {
  try {
    const response = await axios.delete(`${api_detalle_produccion}Delete/${nominaId}/${numeroNomina}/${empleadoId}/${tipoMaquinaId}/${calibre}/${diaFecha}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el detalle de producción:', error);
    throw error;
  }
};
