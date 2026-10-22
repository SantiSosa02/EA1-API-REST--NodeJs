import { ejecutar, todos, uno } from "../conexion.js";

const consulta = `
  SELECT id, nombres, estado,
         fecha_creacion AS "fechaCreacion",
         fecha_actualizacion AS "fechaActualizacion"
  FROM directores
`;

export async function listar(estado) {
  if (estado) return todos(`${consulta} WHERE estado = ?`, estado);
  return todos(consulta);
}

export async function obtener(id) {
  return uno(`${consulta} WHERE id = ?`, id);
}

export async function crear({ nombres, estado }) {
  const ahora = new Date().toISOString();
  const fila = await uno(`
    INSERT INTO directores (nombres, estado, fecha_creacion, fecha_actualizacion)
    VALUES (?, ?, ?, ?)
    RETURNING id
  `, nombres, estado, ahora, ahora);
  return obtener(fila.id);
}

export async function actualizar(id, { nombres, estado }) {
  await ejecutar(`
    UPDATE directores
    SET nombres = ?, estado = ?, fecha_actualizacion = ?
    WHERE id = ?
  `, nombres, estado, new Date().toISOString(), id);
  return obtener(id);
}

export async function eliminar(id) {
  await ejecutar("DELETE FROM directores WHERE id = ?", id);
}

export async function contar(estado) {
  const fila = estado
    ? await uno("SELECT COUNT(*) AS total FROM directores WHERE estado = ?", estado)
    : await uno("SELECT COUNT(*) AS total FROM directores");
  return Number(fila.total);
}
