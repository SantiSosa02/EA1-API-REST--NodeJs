import * as tipos from "../funciones/tipos.js";
import { contarPorTipo } from "../funciones/medias.js";

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
  const descripcion = texto(body?.descripcion);
  if (!nombre || nombre.length > 80) httpError(400, "Nombre es obligatorio y admite máximo 80 caracteres.");
  if (!descripcion || descripcion.length > 500) httpError(400, "Descripción es obligatoria y admite máximo 500 caracteres.");
  return { nombre, descripcion };
}

function duplicado(error) {
  if (error.code === "23505") httpError(409, "Ya existe un tipo con ese nombre.");
  throw error;
}

export async function listar() {
  const registros = await tipos.listar();
  return registros.sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
}

export async function obtener(id) {
  const registro = await tipos.obtener(id);
  if (!registro) httpError(404, "No se encontró el tipo.");
  return registro;
}

export async function crear(body) {
  try {
    return await tipos.crear(leer(body));
  } catch (error) {
    duplicado(error);
  }
}

export async function actualizar(id, body) {
  await obtener(id);
  try {
    return await tipos.actualizar(id, leer(body));
  } catch (error) {
    duplicado(error);
  }
}

export async function eliminar(id) {
  await obtener(id);
  if (await contarPorTipo(id) > 0) httpError(409, "No puedes eliminar este tipo porque tiene producciones asociadas.");
  await tipos.eliminar(id);
}
