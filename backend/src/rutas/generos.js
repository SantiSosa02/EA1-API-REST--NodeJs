import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../servicios/generos.js";

function enviar(accion) {
  return (req, res, next) => {
    Promise.resolve(accion(req, res)).catch(next);
  };
}

export const generos = Router();

generos.get("/", enviar(async (req, res) => {
  res.json(await listar(req.query));
}));
generos.get("/:id", enviar(async (req, res) => {
  res.json(await obtener(req.params.id));
}));
generos.post("/", enviar(async (req, res) => {
  res.status(201).json(await crear(req.body));
}));
generos.put("/:id", enviar(async (req, res) => {
  res.json(await actualizar(req.params.id, req.body));
}));
generos.delete("/:id", enviar(async (req, res) => {
  await eliminar(req.params.id);
  res.status(204).end();
}));
