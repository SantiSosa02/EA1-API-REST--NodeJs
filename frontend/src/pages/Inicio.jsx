import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { mensajeError } from "../api";
import { aviso } from "../avisos";

const tarjetas = [
  { clave: "generos", titulo: "Géneros", ruta: "/generos", color: "#b85c38" },
  { clave: "directores", titulo: "Directores", ruta: "/directores", color: "#2f5d50" },
  { clave: "productoras", titulo: "Productoras", ruta: "/productoras", color: "#3d4f73" },
  { clave: "tipos", titulo: "Tipos", ruta: "/tipos", color: "#8a6a2f" },
  { clave: "producciones", titulo: "Producciones", ruta: "/medias", color: "#6b3f55" },
];

export default function Inicio() {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    api.get("/resumen")
      .then((respuesta) => setResumen(respuesta.data))
      .catch((error) => aviso("error", "Sin conexión", mensajeError(error)));
  }, []);

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Administración del catálogo</h1>
          <p>Géneros, directores, productoras, tipos y producciones.</p>
        </div>
      </div>
      <div className="row g-3 mb-4">
        {tarjetas.map((tarjeta) => (
          <div className="col-6 col-lg" key={tarjeta.clave}>
            <Link className="tarjeta" to={tarjeta.ruta} style={{ "--tono": tarjeta.color }}>
              <span>{tarjeta.titulo}</span>
              <strong>{resumen ? resumen.conteos[tarjeta.clave].total : "—"}</strong>
              <small>Abrir módulo</small>
            </Link>
          </div>
        ))}
      </div>
      <div className="encabezado">
        <div>
          <h1>Producciones recientes</h1>
          <p>Las últimas registradas en el catálogo.</p>
        </div>
      </div>
      <div className="row g-4">
        {resumen?.recientes?.length ? resumen.recientes.map((item) => (
          <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={item.id}>
            <article className="ficha">
              {item.imagen ? <img className="ficha-portada" src={item.imagen} alt="" /> : <div className="ficha-portada ficha-vacia">Sin portada</div>}
              <div className="ficha-cuerpo">
                <h2>{item.titulo}</h2>
                <p>{item.anioEstreno} · {item.tipo}</p>
              </div>
            </article>
          </div>
        )) : (
          <p className="text-secondary">No hay producciones para mostrar.</p>
        )}
      </div>
    </>
  );
}
