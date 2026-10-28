import Catalogo from "../components/Catalogo";

export default function Directores() {
  return (
    <Catalogo
      titulo="Directores"
      ruta="/directores"
      conEstado
      campos={[
        { nombre: "nombres", etiqueta: "Nombres", max: 120 },
        { nombre: "estado", etiqueta: "Estado", tipo: "select", opciones: ["Activo", "Inactivo"] },
      ]}
    />
  );
}
