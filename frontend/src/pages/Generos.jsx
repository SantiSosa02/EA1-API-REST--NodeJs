import Catalogo from "../components/Catalogo";

export default function Generos() {
  return (
    <Catalogo
      titulo="Géneros"
      ruta="/generos"
      conEstado
      campos={[
        { nombre: "nombre", etiqueta: "Nombre", max: 80 },
        { nombre: "estado", etiqueta: "Estado", tipo: "select", opciones: ["Activo", "Inactivo"] },
        { nombre: "descripcion", etiqueta: "Descripción", tipo: "textarea", max: 500 },
      ]}
    />
  );
}
