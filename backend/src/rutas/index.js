import { generos } from "./generos.js";
import { directores } from "./directores.js";
import { productoras } from "./productoras.js";
import { tipos } from "./tipos.js";
import { medias } from "./medias.js";
import { obtener } from "../servicios/resumen.js";

function enviar(accion) {
  return (req, res, next) => {
    Promise.resolve(accion(req, res)).catch(next);
  };
}

export function registrarRutas(app) {
  app.use("/api/generos", generos);
  app.use("/api/directores", directores);
  app.use("/api/productoras", productoras);
  app.use("/api/tipos", tipos);
  app.use("/api/medias", medias);
  app.get("/api/resumen", enviar(async (_req, res) => {
    res.json(await obtener());
  }));
}
