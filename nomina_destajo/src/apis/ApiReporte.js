import axios from "axios";
import { appsettings } from "../settings/ApiUrl";

const api = axios.create({
  baseURL: appsettings.apiUrl + "Reportes/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getReporte2 = async (tipoReporte) => {
  try {
    const response = await api.get(`PrintReport?tipoReporte=${tipoReporte}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Hubo un problema al obtener el reporte.");
  }
};

export const getReporte = async (tipoReporte, fechaInicio, fechaFin, nomina, numeroNomina, tipoMaquina, empleado) => {
  try {
    const params = new URLSearchParams();

    if (tipoReporte) params.append("tipoReporte", tipoReporte);
    if (fechaInicio) params.append("fi", fechaInicio);
    if (fechaFin) params.append("ff", fechaFin);
    if (tipoMaquina) params.append("tipoMaquina", tipoMaquina);
    if (nomina) params.append("nomina", nomina);
    if (numeroNomina) params.append("numeronomina", numeroNomina);
    if (empleado) params.append("empleado", empleado);

    const response = await api.get(`PrintReport?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Hubo un problema al obtener el reporte.");
  }
};

