import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../servicios/productoras.js";

function enviar(accion) {
  return (req, res, next) => {
    Promise.resolve(accion(req, res)).catch(next);
  };
}

export const productoras = Router();

productoras.get("/", enviar(async (req, res) => {
  res.json(await listar(req.query));
}));
productoras.get("/:id", enviar(async (req, res) => {
  res.json(await obtener(req.params.id));
}));
productoras.post("/", enviar(async (req, res) => {
  res.status(201).json(await crear(req.body));
}));
productoras.put("/:id", enviar(async (req, res) => {
  res.json(await actualizar(req.params.id, req.body));
}));
productoras.delete("/:id", enviar(async (req, res) => {
  await eliminar(req.params.id);
  res.status(204).end();
}));
