import Catalogo from "../components/Catalogo";

export default function Productoras() {
  return (
    <Catalogo
      titulo="Productoras"
      ruta="/productoras"
      conEstado
      campos={[
        { nombre: "nombre", etiqueta: "Nombre", max: 80 },
        { nombre: "estado", etiqueta: "Estado", tipo: "select", opciones: ["Activo", "Inactivo"] },
        { nombre: "slogan", etiqueta: "Slogan", max: 140 },
        { nombre: "descripcion", etiqueta: "Descripción", tipo: "textarea", max: 500 },
      ]}
    />
  );
}
