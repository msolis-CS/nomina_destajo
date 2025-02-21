import axios from "axios";
import { appsettings } from "../settings/ApiUrl";

const api = axios.create({
  baseURL: appsettings.apiUrl + "Nomina/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getNominas = async () => {
  try {
    const response = await api.get("List");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener nóminas.");
  }
};

export const getNominaId = async (id) => {
  try {
    const response = await api.get(`Get/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener la nómina con ID ${id}.`);
  }
};

export const getConsecutivos = async (id) => {
  try {
    const response = await api.get(`GetConsecutivos/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener los consecutivos de la nómina con ID ${id}.`);
  }
};

export const updateEstadoNomina = async (nominaId) => {
  try {
    const response = await api.put(`Update?nominaId=${nominaId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al actualizar la nómina con ID ${nominaId}.`);
  }
};
