import pg from "pg";

export const datos = {
  host: "localhost",
  port: 5433,
  user: "postgres",
  password: "Dalmata56",
  database: "cine",
};

export const pool = new pg.Pool(datos);

function sql(consulta) {
  let n = 0;
  return consulta.replaceAll("?", () => `$${++n}`);
}

export async function todos(consulta, ...parametros) {
  const { rows } = await pool.query(sql(consulta), parametros);
  return rows;
}

export async function uno(consulta, ...parametros) {
  const { rows } = await pool.query(sql(consulta), parametros);
  return rows[0] ?? null;
}

export async function ejecutar(consulta, ...parametros) {
  return pool.query(sql(consulta), parametros);
}
