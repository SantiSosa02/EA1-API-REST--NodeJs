import * as productoras from "../funciones/productoras.js";
import { contarPorProductora } from "../funciones/medias.js";

function httpError(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  throw error;
}

function texto(valor) {
  return String(valor ?? "").trim();
}

function leer(body) {
  const nombre = texto(body?.nombre);
  const estado = texto(body?.estado);
  const slogan = texto(body?.slogan);
  const descripcion = texto(body?.descripcion);
  if (!nombre || nombre.length > 80) httpError(400, "Nombre de la productora es obligatorio y admite máximo 80 caracteres.");
  if (!["Activo", "Inactivo"].includes(estado)) httpError(400, "Estado debe ser Activo o Inactivo.");
  if (!slogan || slogan.length > 140) httpError(400, "Slogan es obligatorio y admite máximo 140 caracteres.");
  if (!descripcion || descripcion.length > 500) httpError(400, "Descripción es obligatoria y admite máximo 500 caracteres.");
  return { nombre, estado, slogan, descripcion };
}

function duplicado(error) {
  if (error.code === "23505") httpError(409, "Ya existe una productora con ese nombre.");
  throw error;
}

export async function listar(consulta = {}) {
  if (consulta.estado && !["Activo", "Inactivo"].includes(consulta.estado)) {
    httpError(400, "El estado debe ser Activo o Inactivo.");
  }
  const registros = await productoras.listar(consulta.estado);
  return registros.sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
}

export async function obtener(id) {
  const registro = await productoras.obtener(id);
  if (!registro) httpError(404, "No se encontró la productora.");
  return registro;
}

export async function crear(body) {
  try {
    return await productoras.crear(leer(body));
  } catch (error) {
    duplicado(error);
  }
}

export async function actualizar(id, body) {
  await obtener(id);
  try {
    return await productoras.actualizar(id, leer(body));
  } catch (error) {
    duplicado(error);
  }
}

export async function eliminar(id) {
  await obtener(id);
  if (await contarPorProductora(id) > 0) httpError(409, "No puedes eliminar esta productora porque tiene producciones asociadas. Cambia su estado a Inactivo.");
  await productoras.eliminar(id);
}
