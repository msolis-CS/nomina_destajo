import axios from "axios";
import { appsettings } from "../settings/ApiUrl";

const api = axios.create({
  baseURL: appsettings.apiUrl + "DetalleProduccion/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

// Subir archivo Excel
export const uploadExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await api.post("UploadExcel", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al cargar el archivo Excel:", error);
    throw new Error(error.response?.data?.message || "Error al comunicarse con el servidor.");
  }
};

// Obtener todos los detalles de producción
export const getDetallesProduccion = async () => {
  try {
    const response = await api.get("List");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los detalles de producción:", error);
    throw error;
  }
};

// Obtener un detalle de producción por ID
export const getDetalleProduccionById = async (id) => {
  try {
    const response = await api.get(`Get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el detalle de producción por ID:", error);
    throw error;
  }
};

// Obtener detalle de producción por nómina
export const getDetalleProduccionByNomina = async (nominaId, numeroNomina) => {
  try {
    const response = await api.get(`Get/${nominaId}/${numeroNomina}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el detalle de producción por nómina:", error);
    throw error;
  }
};

// Guardar un detalle de producción
export const saveDetalleProduccion = async (detalleProduccion) => {
  try {
    const response = await api.post("Save", detalleProduccion);
    return response.data;
  } catch (error) {
    console.error("Error al guardar el detalle de producción:", error);
    throw new Error(error.response?.data?.message || "Error al comunicarse con el servidor.");
  }
};

// Actualizar un detalle de producción
export const updateDetalleProduccion = async (id, detalleProduccion) => {
  try {
    const response = await api.put(`Update/${id}`, detalleProduccion);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el detalle de producción:", error);
    throw new Error(error.response?.data?.message || "Error al comunicarse con el servidor.");
  }
};

// Aplicar montos de nómina en Softland
export const updateAplicarDetalleProduccionInSoftland = async (nominaId, numeroNomina) => {
  try {
    const response = await api.put(`UpdateAplicarMontosNomina/${nominaId}/${numeroNomina}`);
    return response.data;
  } catch (error) {
    console.error("Error al aplicar montos de nómina en Softland:", error);
    throw new Error(error.response?.data?.message || "Error al comunicarse con el servidor.");
  }
};

// Desaplicar montos de nómina en Softland
export const updateDesaplicarDetalleProduccionInSoftland = async (nominaId, numeroNomina) => {
  try {
    const response = await api.put(`UpdateDesaplicarMontosNomina/${nominaId}/${numeroNomina}`);
    return response.data;
  } catch (error) {
    console.error("Error al desaplicar montos de nómina en Softland:", error);
    throw new Error(error.response?.data?.message || "Error al comunicarse con el servidor.");
  }
};

// Eliminar un detalle de producción
export const deleteDetalleProduccion = async (id) => {
  try {
    const response = await api.delete(`Delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el detalle de producción:", error);
    throw error;
  }
};

// Eliminar múltiples detalles de producción
export const deleteMultipleDetallesProduccion = async (ids) => {
  try {
    console.log(ids);
    const response = await api.delete("DeleteMultiple", {
      data: ids,
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar múltiples detalles de producción:", error);
    throw error;
  }
};
