import axios from "axios";
import { appsettings } from "../settings/ApiUrl";

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: appsettings.apiUrl + "TipoMaquina/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTipoMaquinas = async () => {
  try {
    const response = await api.get("List");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener los tipos de máquina.");
  }
};

export const getTipoMaquinasActivas = async () => {
  try {
    const response = await api.get("ListActive");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener los tipos de máquina activas.");
  }
};

export const getTipoMaquinaById = async (id) => {
  try {
    const response = await api.get(`Get?id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener el tipo de máquina con ID ${id}.`);
  }
};

export const saveTipoMaquina = async (tipoMaquina) => {
  try {
    const response = await api.post("Save", tipoMaquina);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al guardar el tipo de máquina.");
  }
};

export const updateTipoMaquina = async (id, tipoMaquina) => {
  try {
    const response = await api.put(`Update?id=${id}`, tipoMaquina);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al actualizar el tipo de máquina con ID ${id}.`);
  }
};

export const deleteTipoMaquina = async (id) => {
  try {
    const response = await api.delete(`Delete?id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al eliminar el tipo de máquina con ID ${id}.`);
  }
};
