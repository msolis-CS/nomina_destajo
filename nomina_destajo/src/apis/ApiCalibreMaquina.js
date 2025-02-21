import axios from "axios";
import { appsettings } from "../settings/ApiUrl";

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: appsettings.apiUrl + "CalibreMaquina/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getMaquinasCalibre = async () => {
  try {
    const response = await api.get("List");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener el detalle de máquinas por calibre.");
  }
};

export const getCalibresByMaquina = async (idTipoMaquina) => {
  try {
    const response = await api.get(`GetCalibres?tipoMaquinaId=${idTipoMaquina}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener los calibres de la máquina con ID ${idTipoMaquina}.`);
  }
};

export const saveMaquinaCalibre = async (MaquinaCalibre) => {
  try {
    const response = await api.post("Save", MaquinaCalibre);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al guardar el detalle de máquina por calibre.");
  }
};

export const updateMaquinaCalibre = async (idTipoMaquina, calibre, MaquinaCalibre) => {
  try {
    const response = await api.put(`Update?tipoMaquinaId=${idTipoMaquina}&calibre=${calibre}`, MaquinaCalibre);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al actualizar la máquina con ID ${idTipoMaquina} y calibre ${calibre}.`);
  }
};

export const deleteMaquinaCalibre = async (idTipoMaquina, calibre) => {
  try {
    const response = await api.delete(`Delete?tipoMaquinaId=${idTipoMaquina}&calibre=${calibre}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al eliminar la máquina con ID ${idTipoMaquina} y calibre ${calibre}.`);
  }
};
