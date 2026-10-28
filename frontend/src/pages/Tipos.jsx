import Catalogo from "../components/Catalogo";

export default function Tipos() {
  return (
    <Catalogo
      titulo="Tipos"
      ruta="/tipos"
      campos={[
        { nombre: "nombre", etiqueta: "Nombre", max: 80 },
        { nombre: "descripcion", etiqueta: "Descripción", tipo: "textarea", max: 500 },
      ]}
    />
  );
}
