import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../servicios/medias.js";

function enviar(accion) {
  return (req, res, next) => {
    Promise.resolve(accion(req, res)).catch(next);
  };
}

export const medias = Router();

medias.get("/", enviar(async (_req, res) => {
  res.json(await listar());
}));
medias.get("/:id", enviar(async (req, res) => {
  res.json(await obtener(req.params.id));
}));
medias.post("/", enviar(async (req, res) => {
  res.status(201).json(await crear(req.body));
}));
medias.put("/:id", enviar(async (req, res) => {
  res.json(await actualizar(req.params.id, req.body));
}));
medias.delete("/:id", enviar(async (req, res) => {
  await eliminar(req.params.id);
  res.status(204).end();
}));
