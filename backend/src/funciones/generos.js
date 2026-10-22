import { ejecutar, todos, uno } from "../conexion.js";

const consulta = `
  SELECT id, nombre, estado, descripcion,
         fecha_creacion AS "fechaCreacion",
         fecha_actualizacion AS "fechaActualizacion"
  FROM generos
`;

export async function listar(estado) {
  if (estado) return todos(`${consulta} WHERE estado = ?`, estado);
  return todos(consulta);
}

export async function obtener(id) {
  return uno(`${consulta} WHERE id = ?`, id);
}

export async function crear({ nombre, estado, descripcion }) {
  const ahora = new Date().toISOString();
  const fila = await uno(`
    INSERT INTO generos (nombre, estado, descripcion, fecha_creacion, fecha_actualizacion)
    VALUES (?, ?, ?, ?, ?)
    RETURNING id
  `, nombre, estado, descripcion, ahora, ahora);
  return obtener(fila.id);
}

export async function actualizar(id, { nombre, estado, descripcion }) {
  await ejecutar(`
    UPDATE generos
    SET nombre = ?, estado = ?, descripcion = ?, fecha_actualizacion = ?
    WHERE id = ?
  `, nombre, estado, descripcion, new Date().toISOString(), id);
  return obtener(id);
}

export async function eliminar(id) {
  await ejecutar("DELETE FROM generos WHERE id = ?", id);
}

export async function contar(estado) {
  const fila = estado
    ? await uno("SELECT COUNT(*) AS total FROM generos WHERE estado = ?", estado)
    : await uno("SELECT COUNT(*) AS total FROM generos");
  return Number(fila.total);
}
