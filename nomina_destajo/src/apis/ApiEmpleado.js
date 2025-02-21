import axios from "axios";
import { appsettings } from "../settings/ApiUrl";

const api = axios.create({
  baseURL: appsettings.apiUrl + "Empleado/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getEmpleados = async () => {
  try {
    const response = await api.get("List");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Hubo un problema al obtener los empleados.");
  }
};
