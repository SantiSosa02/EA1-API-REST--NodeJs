import { useEffect, useState } from "react";
import api, { mensajeError } from "../api";
import { aviso, confirmar } from "../avisos";

const vacio = () => ({
  serial: "",
  titulo: "",
  sinopsis: "",
  url: "",
  imagen: "",
  anioEstreno: new Date().getFullYear(),
  generoId: "",
  directorId: "",
  productoraId: "",
  tipoId: "",
});

function opcionesDe(lista, idActual, nombreActual) {
  const opciones = lista.map((item) => ({ id: item.id, nombre: item.nombre || item.nombres }));
  if (idActual && !opciones.some((item) => Number(item.id) === Number(idActual))) {
    opciones.push({ id: idActual, nombre: `${nombreActual} (inactivo)` });
  }
  return opciones;
}

export default function Medias() {
  const [filas, setFilas] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const [formulario, setFormulario] = useState(vacio());
  const [listas, setListas] = useState({ generos: [], directores: [], productoras: [], tipos: [] });

  async function cargar() {
    const respuesta = await api.get("/medias");
    setFilas(respuesta.data);
  }

  useEffect(() => {
    cargar().catch((error) => aviso("error", "No se pudo listar", mensajeError(error)));
  }, []);

  function cambiar(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  }

  async function abrir(fila) {
    try {
      const [generos, directores, productoras, tipos] = await Promise.all([
        api.get("/generos", { params: { estado: "Activo" } }),
        api.get("/directores", { params: { estado: "Activo" } }),
        api.get("/productoras", { params: { estado: "Activo" } }),
        api.get("/tipos"),
      ]);
      setListas({
        generos: opcionesDe(generos.data, fila?.generoId, fila?.genero),
        directores: opcionesDe(directores.data, fila?.directorId, fila?.director),
        productoras: opcionesDe(productoras.data, fila?.productoraId, fila?.productora),
        tipos: opcionesDe(tipos.data, fila?.tipoId, fila?.tipo),
      });
      setFormulario(fila ? {
        id: fila.id,
        serial: fila.serial,
        titulo: fila.titulo,
        sinopsis: fila.sinopsis,
        url: fila.url,
        imagen: fila.imagen || "",
        anioEstreno: fila.anioEstreno,
        generoId: fila.generoId,
        directorId: fila.directorId,
        productoraId: fila.productoraId,
        tipoId: fila.tipoId,
      } : vacio());
      setAbierto(true);
    } catch (error) {
      aviso("error", "No se pudieron cargar las listas", mensajeError(error));
    }
  }

  async function guardar(evento) {
    evento.preventDefault();
    const { id, ...datos } = formulario;
    datos.anioEstreno = Number(datos.anioEstreno);
    datos.generoId = Number(datos.generoId);
    datos.directorId = Number(datos.directorId);
    datos.productoraId = Number(datos.productoraId);
    datos.tipoId = Number(datos.tipoId);
    try {
      if (id) await api.put(`/medias/${id}`, datos);
      else await api.post("/medias", datos);
      setAbierto(false);
      await aviso("success", "Guardado", id ? "La producción se actualizó." : "La producción se creó.");
      await cargar();
    } catch (error) {
      aviso("error", "No se pudo guardar", mensajeError(error));
    }
  }

  async function eliminar(fila) {
    const aceptado = await confirmar(`Se eliminará ${fila.titulo}.`);
    if (!aceptado) return;
    try {
      await api.delete(`/medias/${fila.id}`);
      await aviso("success", "Eliminado", "La producción se eliminó.");
      await cargar();
    } catch (error) {
      aviso("error", "No se pudo eliminar", mensajeError(error));
    }
  }

  function selector(nombre, etiqueta, opciones) {
    return (
      <div className="col-md-6 mb-3">
        <label className="form-label">{etiqueta}</label>
        <select className="form-select" name={nombre} value={String(formulario[nombre] ?? "")} onChange={cambiar} required>
          <option value="">Selecciona</option>
          {opciones.map((opcion) => <option key={opcion.id} value={String(opcion.id)}>{opcion.nombre}</option>)}
        </select>
      </div>
    );
  }

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Media</h1>
          <p>Al publicar solo puedes elegir géneros, directores y productoras activos. El serial y la URL no se repiten.</p>
        </div>
        <button className="btn btn-cobre" onClick={() => abrir(null)}>Nueva</button>
      </div>
      <div className="table-responsive panel">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Portada</th>
              <th>Serial</th>
              <th>Título</th>
              <th>Año</th>
              <th>Género</th>
              <th>Director</th>
              <th>Productora</th>
              <th>Tipo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && <tr><td colSpan="9" className="text-secondary">No hay producciones.</td></tr>}
            {filas.map((fila) => (
              <tr key={fila.id}>
                <td>{fila.imagen ? <img className="portada" src={fila.imagen} alt="" /> : <span className="portada-vacia" />}</td>
                <td>{fila.serial}</td>
                <td>{fila.titulo}</td>
                <td>{fila.anioEstreno}</td>
                <td>{fila.genero}</td>
                <td>{fila.director}</td>
                <td>{fila.productora}</td>
                <td>{fila.tipo}</td>
                <td className="text-nowrap">
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => abrir(fila)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(fila)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {abierto && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <form className="modal-content" onSubmit={guardar}>
                <div className="modal-header">
                  <h2 className="modal-title h5">{formulario.id ? "Editar producción" : "Nueva producción"}</h2>
                  <button type="button" className="btn-close" onClick={() => setAbierto(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Serial</label>
                      <input className="form-control" name="serial" maxLength="30" value={formulario.serial} onChange={cambiar} required />
                    </div>
                    <div className="col-md-5 mb-3">
                      <label className="form-label">Título</label>
                      <input className="form-control" name="titulo" maxLength="150" value={formulario.titulo} onChange={cambiar} required />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Año</label>
                      <input className="form-control" name="anioEstreno" type="number" value={formulario.anioEstreno} onChange={cambiar} required />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Sinopsis</label>
                      <textarea className="form-control" name="sinopsis" maxLength="2000" rows="3" value={formulario.sinopsis} onChange={cambiar} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">URL</label>
                      <input className="form-control" name="url" maxLength="300" value={formulario.url} onChange={cambiar} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Portada (URL)</label>
                      <input className="form-control" name="imagen" maxLength="300" value={formulario.imagen} onChange={cambiar} />
                      {formulario.imagen && <img className="vista-portada" src={formulario.imagen} alt="" />}
                    </div>
                    {selector("generoId", "Género", listas.generos)}
                    {selector("directorId", "Director", listas.directores)}
                    {selector("productoraId", "Productora", listas.productoras)}
                    {selector("tipoId", "Tipo", listas.tipos)}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setAbierto(false)}>Cancelar</button>
                  <button className="btn btn-cobre">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
