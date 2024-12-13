import axios from 'axios';
import { appsettings } from '../settings/ApiUrl';

const api_detalle_produccion = appsettings.apiUrl + 'DetalleProduccion/';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Obtener todos los detalles de producción
export const getDetallesProduccion = async () => {
  try {
    const response = await axios.get(`${api_detalle_produccion}List`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los detalles de producción:', error);
    throw error;
  }
};

// Obtener un detalle de producción por combinación de ID
export const getDetalleProduccionById = async (id) => {
  try {
    const response = await axios.get(`${api_detalle_produccion}Get/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el detalle de producción por ID:', error);
    throw error;
  }
};

export const getDetalleProduccionByNomina = async (nominaId, numeroNomina) => {
  try {
    const response = await axios.get(`${api_detalle_produccion}Get/${nominaId}/${numeroNomina}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el detalle de producción por ID:', error);
    throw error;
  }
};

// Guardar un nuevo detalle de producción
export const saveDetalleProduccion = async (detalleProduccion) => {
  try {
    const response = await axios.post(`${api_detalle_produccion}Save`, detalleProduccion, config);
    return response.data;
  } catch (error) {
    console.error('Error al guardar el detalle de producción:', error);
    throw error;
  }
};

// Actualizar un detalle de producción existente
export const updateDetalleProduccion = async (id, detalleProduccion) => {
  try {
    const response = await axios.put(`${api_detalle_produccion}Update/${id}`, detalleProduccion, config);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el detalle de producción:', error);
    throw error;
  }
};

// Eliminar un detalle de producción
export const deleteDetalleProduccion = async (id) => {
  try {
    const response = await axios.delete(`${api_detalle_produccion}Delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el detalle de producción:', error);
    throw error;
  }
};
