import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../servicios/directores.js";

function enviar(accion) {
  return (req, res, next) => {
    Promise.resolve(accion(req, res)).catch(next);
  };
}

export const directores = Router();

directores.get("/", enviar(async (req, res) => {
  res.json(await listar(req.query));
}));
directores.get("/:id", enviar(async (req, res) => {
  res.json(await obtener(req.params.id));
}));
directores.post("/", enviar(async (req, res) => {
  res.status(201).json(await crear(req.body));
}));
directores.put("/:id", enviar(async (req, res) => {
  res.json(await actualizar(req.params.id, req.body));
}));
directores.delete("/:id", enviar(async (req, res) => {
  await eliminar(req.params.id);
  res.status(204).end();
}));
