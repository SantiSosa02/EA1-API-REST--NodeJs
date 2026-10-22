import express from "express";
import cors from "cors";
import { pool } from "./conexion.js";
import { registrarRutas } from "./rutas/index.js";

try {
  await pool.query("SELECT 1");
} catch (error) {
  console.error("No se pudo conectar a PostgreSQL. Revisa host, usuario, contraseña y base en src/conexion.js.");
  console.error(error.message);
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.get("/api/salud", (_req, res) => {
  res.json({ ok: true, servicio: "cine-iudigital" });
});
registrarRutas(app);
app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  if (status === 500) console.error(error);
  res.status(status).json({
    error: status === 500 ? "Ocurrió un error interno." : error.message,
  });
});

const puerto = process.env.PORT || 4000;
const servidor = app.listen(puerto, () => {
  console.log(`API de Cine IUDigital en http://localhost:${puerto}`);
});

servidor.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`El puerto ${puerto} ya está en uso.`);
    process.exit(1);
  }
  throw error;
});
