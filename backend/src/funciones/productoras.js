import { ejecutar, todos, uno } from "../conexion.js";

const consulta = `
  SELECT id, nombre, estado, slogan, descripcion,
         fecha_creacion AS "fechaCreacion",
         fecha_actualizacion AS "fechaActualizacion"
  FROM productoras
`;

export async function listar(estado) {
  if (estado) return todos(`${consulta} WHERE estado = ?`, estado);
  return todos(consulta);
}

export async function obtener(id) {
  return uno(`${consulta} WHERE id = ?`, id);
}

export async function crear({ nombre, estado, slogan, descripcion }) {
  const ahora = new Date().toISOString();
  const fila = await uno(`
    INSERT INTO productoras (nombre, estado, slogan, descripcion, fecha_creacion, fecha_actualizacion)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING id
  `, nombre, estado, slogan, descripcion, ahora, ahora);
  return obtener(fila.id);
}

export async function actualizar(id, { nombre, estado, slogan, descripcion }) {
  await ejecutar(`
    UPDATE productoras
    SET nombre = ?, estado = ?, slogan = ?, descripcion = ?, fecha_actualizacion = ?
    WHERE id = ?
  `, nombre, estado, slogan, descripcion, new Date().toISOString(), id);
  return obtener(id);
}

export async function eliminar(id) {
  await ejecutar("DELETE FROM productoras WHERE id = ?", id);
}

export async function contar(estado) {
  const fila = estado
    ? await uno("SELECT COUNT(*) AS total FROM productoras WHERE estado = ?", estado)
    : await uno("SELECT COUNT(*) AS total FROM productoras");
  return Number(fila.total);
}
