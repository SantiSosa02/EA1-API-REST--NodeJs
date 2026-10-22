import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../servicios/tipos.js";

function enviar(accion) {
  return (req, res, next) => {
    Promise.resolve(accion(req, res)).catch(next);
  };
}

export const tipos = Router();

tipos.get("/", enviar(async (_req, res) => {
  res.json(await listar());
}));
tipos.get("/:id", enviar(async (req, res) => {
  res.json(await obtener(req.params.id));
}));
tipos.post("/", enviar(async (req, res) => {
  res.status(201).json(await crear(req.body));
}));
tipos.put("/:id", enviar(async (req, res) => {
  res.json(await actualizar(req.params.id, req.body));
}));
tipos.delete("/:id", enviar(async (req, res) => {
  await eliminar(req.params.id);
  res.status(204).end();
}));
