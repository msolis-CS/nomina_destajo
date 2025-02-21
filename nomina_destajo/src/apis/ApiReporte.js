import axios from "axios";
import { appsettings } from "../settings/ApiUrl";

const api = axios.create({
  baseURL: appsettings.apiUrl + "Reportes/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getReporte = async (tipoReporte) => {
  try {
    const response = await api.get(`PrintReport?tipoReporte=${tipoReporte}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Hubo un problema al obtener el reporte.");
  }
};
