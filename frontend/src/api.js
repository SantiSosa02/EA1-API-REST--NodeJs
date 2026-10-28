import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export function mensajeError(error) {
  return error?.response?.data?.error || "No se pudo completar la operación. Revisa que la API esté encendida.";
}

export default api;
