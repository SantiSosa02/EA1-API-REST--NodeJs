import * as medias from "../funciones/medias.js";
import * as generos from "../funciones/generos.js";
import * as directores from "../funciones/directores.js";
import * as productoras from "../funciones/productoras.js";
import * as tipos from "../funciones/tipos.js";

function httpError(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  throw error;
}

function urlHttp(valor) {
  try {
    const url = new URL(valor);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function activo(registro, id, actualId, noExiste, inactivo) {
  if (!registro) httpError(400, noExiste);
  if (registro.estado !== "Activo" && Number(id) !== Number(actualId)) httpError(400, inactivo);
}

async function leer(body, actual) {
  const serial = String(body?.serial || "").trim();
  const titulo = String(body?.titulo || "").trim();
  const sinopsis = String(body?.sinopsis || "").trim();
  const url = String(body?.url || "").trim();
  const imagen = String(body?.imagen || "").trim();
  const anio = Number(body?.anioEstreno);
  const generoId = Number(body?.generoId);
  const directorId = Number(body?.directorId);
  const productoraId = Number(body?.productoraId);
  const tipoId = Number(body?.tipoId);
  const anioMaximo = new Date().getFullYear() + 1;

  if (!/^[A-Za-z0-9-]{3,30}$/.test(serial)) httpError(400, "El serial debe tener entre 3 y 30 caracteres, usando letras, números o guiones.");
  if (!titulo || titulo.length > 150) httpError(400, "El título es obligatorio y admite máximo 150 caracteres.");
  if (!sinopsis || sinopsis.length > 2000) httpError(400, "La sinopsis es obligatoria y admite máximo 2000 caracteres.");
  if (!urlHttp(url) || url.length > 300) httpError(400, "La URL de la película debe ser una dirección http o https.");
  if (imagen && (!urlHttp(imagen) || imagen.length > 300)) httpError(400, "La portada debe ser una URL http o https.");
  if (!Number.isInteger(anio) || anio < 1888 || anio > anioMaximo) httpError(400, `El año de estreno debe estar entre 1888 y ${anioMaximo}.`);
  for (const valor of [generoId, directorId, productoraId, tipoId]) {
    if (!Number.isInteger(valor) || valor <= 0) httpError(400, "Debes seleccionar género, director, productora y tipo.");
  }

  activo(await generos.obtener(generoId), generoId, actual?.generoId, "El género seleccionado no existe.", "Solo puedes elegir géneros activos.");
  activo(await directores.obtener(directorId), directorId, actual?.directorId, "El director seleccionado no existe.", "Solo puedes elegir directores activos.");
  activo(await productoras.obtener(productoraId), productoraId, actual?.productoraId, "La productora seleccionada no existe.", "Solo puedes elegir productoras activas.");
  if (!await tipos.obtener(tipoId)) httpError(400, "El tipo seleccionado no existe.");

  return { serial, titulo, sinopsis, url, imagen, anio, generoId, directorId, productoraId, tipoId };
}

function falloGuardado(error) {
  if (error.code === "23505") httpError(409, "El serial o la URL ya pertenecen a otra producción.");
  throw error;
}

export async function listar() {
  return medias.listar();
}

export async function obtener(id) {
  const registro = await medias.obtener(id);
  if (!registro) httpError(404, "No se encontró la producción.");
  return registro;
}

export async function crear(body) {
  try {
    return await medias.crear(await leer(body, null));
  } catch (error) {
    falloGuardado(error);
  }
}

export async function actualizar(id, body) {
  const actual = await medias.obtener(id);
  if (!actual) httpError(404, "No se encontró la producción.");
  try {
    return await medias.actualizar(id, await leer(body, actual));
  } catch (error) {
    falloGuardado(error);
  }
}

export async function eliminar(id) {
  const actual = await medias.obtener(id);
  if (!actual) httpError(404, "No se encontró la producción.");
  await medias.eliminar(id);
}
