import axios from 'axios';
import { appsettings } from '../settings/ApiUrl';

const api_detalle_produccion = appsettings.apiUrl + 'DetalleProduccion/';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const uploadExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axios.post(`${api_detalle_produccion}UploadExcel`, formData,
     {
      headers: {
        'Content-Type': 'multipart/form-data',
     },
    });
    return response.data;
  } catch (error) {
    console.error('Error al cargar el archivo Excel:', error);
    throw new Error(error.response?.data?.message || 'Error al comunicarse con el servidor.');
  }
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

export const saveDetalleProduccion = async (detalleProduccion) => {
  try {
    const response = await axios.post(`${api_detalle_produccion}Save`, detalleProduccion, config);
    return response.data;

    
  } catch (error) {
    console.error('Error al guardar el detalle de producción:', error);
    throw new Error(error.response?.data?.message || 'Error al comunicarse con el servidor.');
  }
};

// Actualizar un detalle de producción existente
export const updateDetalleProduccion = async (id, detalleProduccion) => {
  try {
    const response = await axios.put(`${api_detalle_produccion}Update/${id}`, detalleProduccion, config);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el detalle de producción:', error);
    throw new Error(error.response?.data?.message || 'Error al comunicarse con el servidor.');
  }
};

export const updateAplicarDetalleProduccionInSoftland = async (nominaId, numeroNomina) => {
  try {
    const response = await axios.put(`${api_detalle_produccion}UpdateAplicarMontosNomina/${nominaId}/${numeroNomina}`);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el detalle de producción en Softland:', error);
    throw new Error(error.response?.data?.message || 'Error al comunicarse con el servidor.');
  }
};

export const updateDesaplicarDetalleProduccionInSoftland = async (nominaId, numeroNomina) => {
  try {
    const response = await axios.put(`${api_detalle_produccion}UpdateDesaplicarMontosNomina/${nominaId}/${numeroNomina}`);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el detalle de producción en Softland:', error);
    throw new Error(error.response?.data?.message || 'Error al comunicarse con el servidor.');
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
