import { useEffect, useState } from "react";
import api, { mensajeError } from "../api";
import { aviso, confirmar } from "../avisos";

function fecha(valor) {
  if (!valor) return "";
  const fechaValor = new Date(valor);
  if (Number.isNaN(fechaValor.getTime())) return valor;
  return fechaValor.toLocaleString("es-CO");
}

function formularioVacio(campos) {
  const datos = {};
  for (const campo of campos) {
    datos[campo.nombre] = campo.opciones ? campo.opciones[0] : "";
  }
  return datos;
}

export default function Catalogo({ titulo, ruta, campos, conEstado }) {
  const [filas, setFilas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [formulario, setFormulario] = useState(() => formularioVacio(campos));

  async function cargar() {
    const params = filtro ? { estado: filtro } : {};
    const respuesta = await api.get(ruta, { params });
    setFilas(respuesta.data);
  }

  useEffect(() => {
    cargar().catch((error) => aviso("error", "No se pudo listar", mensajeError(error)));
  }, [filtro]);

  function cambiar(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  }

  function nuevo() {
    setFormulario(formularioVacio(campos));
    setAbierto(true);
  }

  function editar(fila) {
    const datos = formularioVacio(campos);
    for (const campo of campos) datos[campo.nombre] = fila[campo.nombre] ?? "";
    datos.id = fila.id;
    setFormulario(datos);
    setAbierto(true);
  }

  async function guardar(evento) {
    evento.preventDefault();
    const { id, ...datos } = formulario;
    try {
      if (id) await api.put(`${ruta}/${id}`, datos);
      else await api.post(ruta, datos);
      setAbierto(false);
      await aviso("success", "Guardado", id ? "El registro se actualizó." : "El registro se creó.");
      await cargar();
    } catch (error) {
      aviso("error", "No se pudo guardar", mensajeError(error));
    }
  }

  async function eliminar(fila) {
    const aceptado = await confirmar(`Se eliminará ${fila.nombre || fila.nombres}.`);
    if (!aceptado) return;
    try {
      await api.delete(`${ruta}/${fila.id}`);
      await aviso("success", "Eliminado", "El registro se eliminó.");
      await cargar();
    } catch (error) {
      aviso("error", "No se pudo eliminar", mensajeError(error));
    }
  }

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>{titulo}</h1>
          {conEstado && (
            <select className="form-select mt-2" style={{ maxWidth: 220 }} value={filtro} onChange={(evento) => setFiltro(evento.target.value)}>
              <option value="">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          )}
        </div>
        <button className="btn btn-cobre" onClick={nuevo}>Nuevo</button>
      </div>
      <div className="table-responsive panel">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              {campos.map((campo) => <th key={campo.nombre}>{campo.etiqueta}</th>)}
              <th>Creación</th>
              <th>Actualización</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && (
              <tr><td colSpan={campos.length + 3} className="text-secondary">No hay registros.</td></tr>
            )}
            {filas.map((fila) => (
              <tr key={fila.id}>
                {campos.map((campo) => (
                  <td key={campo.nombre}>
                    {campo.nombre === "estado" ? (
                      <span className={`badge text-bg-${fila.estado === "Activo" ? "success" : "secondary"}`}>{fila.estado}</span>
                    ) : fila[campo.nombre]}
                  </td>
                ))}
                <td>{fecha(fila.fechaCreacion)}</td>
                <td>{fecha(fila.fechaActualizacion)}</td>
                <td className="text-nowrap">
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => editar(fila)}>Editar</button>
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
            <div className="modal-dialog">
              <form className="modal-content" onSubmit={guardar}>
                <div className="modal-header">
                  <h2 className="modal-title h5">{formulario.id ? "Editar" : "Nuevo"}</h2>
                  <button type="button" className="btn-close" onClick={() => setAbierto(false)}></button>
                </div>
                <div className="modal-body">
                  {campos.map((campo) => (
                    <div className="mb-3" key={campo.nombre}>
                      <label className="form-label">{campo.etiqueta}</label>
                      {campo.tipo === "select" ? (
                        <select className="form-select" name={campo.nombre} value={formulario[campo.nombre]} onChange={cambiar}>
                          {campo.opciones.map((opcion) => <option key={opcion}>{opcion}</option>)}
                        </select>
                      ) : campo.tipo === "textarea" ? (
                        <textarea className="form-control" name={campo.nombre} maxLength={campo.max} rows="3" value={formulario[campo.nombre]} onChange={cambiar} required />
                      ) : (
                        <input className="form-control" name={campo.nombre} maxLength={campo.max} value={formulario[campo.nombre]} onChange={cambiar} required />
                      )}
                    </div>
                  ))}
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
