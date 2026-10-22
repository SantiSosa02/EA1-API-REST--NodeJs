import * as generos from "../funciones/generos.js";
import * as directores from "../funciones/directores.js";
import * as productoras from "../funciones/productoras.js";
import * as tipos from "../funciones/tipos.js";
import * as medias from "../funciones/medias.js";

export async function obtener() {
  const recientes = await medias.listar();
  return {
    conteos: {
      generos: { total: await generos.contar(), activos: await generos.contar("Activo") },
      directores: { total: await directores.contar(), activos: await directores.contar("Activo") },
      productoras: { total: await productoras.contar(), activos: await productoras.contar("Activo") },
      tipos: { total: await tipos.contar() },
      producciones: { total: await medias.contar() },
    },
    porTipo: await medias.agruparPorTipo(),
    recientes: recientes.slice(0, 8),
  };
}
