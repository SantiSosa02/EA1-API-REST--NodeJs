import * as generos from "../funciones/generos.js";
import { contarPorGenero } from "../funciones/medias.js";

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
  const descripcion = texto(body?.descripcion);
  if (!nombre || nombre.length > 80) httpError(400, "Nombre es obligatorio y admite máximo 80 caracteres.");
  if (!["Activo", "Inactivo"].includes(estado)) httpError(400, "Estado debe ser Activo o Inactivo.");
  if (!descripcion || descripcion.length > 500) httpError(400, "Descripción es obligatoria y admite máximo 500 caracteres.");
  return { nombre, estado, descripcion };
}

function duplicado(error) {
  if (error.code === "23505") httpError(409, "Ya existe un género con ese nombre.");
  throw error;
}

export async function listar(consulta = {}) {
  if (consulta.estado && !["Activo", "Inactivo"].includes(consulta.estado)) {
    httpError(400, "El estado debe ser Activo o Inactivo.");
  }
  const registros = await generos.listar(consulta.estado);
  return registros.sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
}

export async function obtener(id) {
  const registro = await generos.obtener(id);
  if (!registro) httpError(404, "No se encontró el género.");
  return registro;
}

export async function crear(body) {
  try {
    return await generos.crear(leer(body));
  } catch (error) {
    duplicado(error);
  }
}

export async function actualizar(id, body) {
  await obtener(id);
  try {
    return await generos.actualizar(id, leer(body));
  } catch (error) {
    duplicado(error);
  }
}

export async function eliminar(id) {
  await obtener(id);
  if (await contarPorGenero(id) > 0) httpError(409, "No puedes eliminar este género porque tiene producciones asociadas. Márcalo como Inactivo.");
  await generos.eliminar(id);
}
