import { ejecutar, todos, uno } from "../conexion.js";

const consulta = `
  SELECT medias.id, medias.serial, medias.titulo, medias.sinopsis, medias.url, medias.imagen,
         medias.anio_estreno AS "anioEstreno",
         medias.genero_id AS "generoId",
         medias.director_id AS "directorId",
         medias.productora_id AS "productoraId",
         medias.tipo_id AS "tipoId",
         medias.fecha_creacion AS "fechaCreacion",
         medias.fecha_actualizacion AS "fechaActualizacion",
         generos.nombre AS genero,
         generos.estado AS "generoEstado",
         directores.nombres AS director,
         directores.estado AS "directorEstado",
         productoras.nombre AS productora,
         productoras.estado AS "productoraEstado",
         tipos.nombre AS tipo
  FROM medias
  JOIN generos ON generos.id = medias.genero_id
  JOIN directores ON directores.id = medias.director_id
  JOIN productoras ON productoras.id = medias.productora_id
  JOIN tipos ON tipos.id = medias.tipo_id
`;

export async function listar() {
  return todos(`${consulta} ORDER BY medias.fecha_creacion DESC, medias.id DESC`);
}

export async function obtener(id) {
  return uno(`${consulta} WHERE medias.id = ?`, id);
}

export async function crear({ serial, titulo, sinopsis, url, imagen, anio, generoId, directorId, productoraId, tipoId }) {
  const ahora = new Date().toISOString();
  const fila = await uno(`
    INSERT INTO medias (
      serial, titulo, sinopsis, url, imagen, anio_estreno,
      genero_id, director_id, productora_id, tipo_id,
      fecha_creacion, fecha_actualizacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING id
  `, serial, titulo, sinopsis, url, imagen, anio, generoId, directorId, productoraId, tipoId, ahora, ahora);
  return obtener(fila.id);
}

export async function actualizar(id, { serial, titulo, sinopsis, url, imagen, anio, generoId, directorId, productoraId, tipoId }) {
  await ejecutar(`
    UPDATE medias
    SET serial = ?, titulo = ?, sinopsis = ?, url = ?, imagen = ?, anio_estreno = ?,
        genero_id = ?, director_id = ?, productora_id = ?, tipo_id = ?, fecha_actualizacion = ?
    WHERE id = ?
  `, serial, titulo, sinopsis, url, imagen, anio, generoId, directorId, productoraId, tipoId, new Date().toISOString(), id);
  return obtener(id);
}

export async function eliminar(id) {
  await ejecutar("DELETE FROM medias WHERE id = ?", id);
}

export async function contar() {
  const fila = await uno("SELECT COUNT(*) AS total FROM medias");
  return Number(fila.total);
}

export async function contarPorGenero(generoId) {
  const fila = await uno("SELECT COUNT(*) AS total FROM medias WHERE genero_id = ?", generoId);
  return Number(fila.total);
}

export async function contarPorDirector(directorId) {
  const fila = await uno("SELECT COUNT(*) AS total FROM medias WHERE director_id = ?", directorId);
  return Number(fila.total);
}

export async function contarPorProductora(productoraId) {
  const fila = await uno("SELECT COUNT(*) AS total FROM medias WHERE productora_id = ?", productoraId);
  return Number(fila.total);
}

export async function contarPorTipo(tipoId) {
  const fila = await uno("SELECT COUNT(*) AS total FROM medias WHERE tipo_id = ?", tipoId);
  return Number(fila.total);
}

export async function agruparPorTipo() {
  const filas = await todos(`
    SELECT tipos.nombre AS nombre, COUNT(medias.id) AS total
    FROM tipos
    LEFT JOIN medias ON medias.tipo_id = tipos.id
    GROUP BY tipos.id
    ORDER BY tipos.nombre
  `);
  return filas.map((fila) => ({ nombre: fila.nombre, total: Number(fila.total) }));
}
