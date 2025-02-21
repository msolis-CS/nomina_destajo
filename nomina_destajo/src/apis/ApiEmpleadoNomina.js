import axios from "axios";
import { appsettings } from "../settings/ApiUrl";

const api = axios.create({
  baseURL: appsettings.apiUrl + "EmpleadoNomina/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getEmpleadoByNomina = async (nominaId, consecutivo) => {
  try {
    const response = await api.get(`Get/${nominaId}/${consecutivo}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Hubo un problema al obtener los empleados.");
  }
};
