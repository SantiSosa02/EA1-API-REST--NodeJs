import * as directores from "../funciones/directores.js";
import { contarPorDirector } from "../funciones/medias.js";

function httpError(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  throw error;
}

function texto(valor) {
  return String(valor ?? "").trim();
}

function leer(body) {
  const nombres = texto(body?.nombres);
  const estado = texto(body?.estado);
  if (!nombres || nombres.length > 120) httpError(400, "Nombres es obligatorio y admite máximo 120 caracteres.");
  if (!["Activo", "Inactivo"].includes(estado)) httpError(400, "Estado debe ser Activo o Inactivo.");
  return { nombres, estado };
}

export async function listar(consulta = {}) {
  if (consulta.estado && !["Activo", "Inactivo"].includes(consulta.estado)) {
    httpError(400, "El estado debe ser Activo o Inactivo.");
  }
  const registros = await directores.listar(consulta.estado);
  return registros.sort((a, b) => a.nombres.localeCompare(b.nombres, "es", { sensitivity: "base" }));
}

export async function obtener(id) {
  const registro = await directores.obtener(id);
  if (!registro) httpError(404, "No se encontró el director.");
  return registro;
}

export async function crear(body) {
  return directores.crear(leer(body));
}

export async function actualizar(id, body) {
  await obtener(id);
  return directores.actualizar(id, leer(body));
}

export async function eliminar(id) {
  await obtener(id);
  if (await contarPorDirector(id) > 0) httpError(409, "No puedes eliminar este director porque tiene producciones asociadas. Márcalo como Inactivo.");
  await directores.eliminar(id);
}
