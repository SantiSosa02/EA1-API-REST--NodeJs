import { ejecutar, todos, uno } from "../conexion.js";

const consulta = `
  SELECT id, nombre, descripcion,
         fecha_creacion AS "fechaCreacion",
         fecha_actualizacion AS "fechaActualizacion"
  FROM tipos
`;

export async function listar() {
  return todos(consulta);
}

export async function obtener(id) {
  return uno(`${consulta} WHERE id = ?`, id);
}

export async function crear({ nombre, descripcion }) {
  const ahora = new Date().toISOString();
  const fila = await uno(`
    INSERT INTO tipos (nombre, descripcion, fecha_creacion, fecha_actualizacion)
    VALUES (?, ?, ?, ?)
    RETURNING id
  `, nombre, descripcion, ahora, ahora);
  return obtener(fila.id);
}

export async function actualizar(id, { nombre, descripcion }) {
  await ejecutar(`
    UPDATE tipos
    SET nombre = ?, descripcion = ?, fecha_actualizacion = ?
    WHERE id = ?
  `, nombre, descripcion, new Date().toISOString(), id);
  return obtener(id);
}

export async function eliminar(id) {
  await ejecutar("DELETE FROM tipos WHERE id = ?", id);
}

export async function contar() {
  const fila = await uno("SELECT COUNT(*) AS total FROM tipos");
  return Number(fila.total);
}
