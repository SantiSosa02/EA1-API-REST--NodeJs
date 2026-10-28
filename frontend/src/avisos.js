import Swal from "sweetalert2";

export function confirmar(texto) {
  return Swal.fire({
    title: "¿Eliminar?",
    text: texto,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#b85c38",
  }).then((resultado) => resultado.isConfirmed);
}

export function aviso(icono, titulo, texto) {
  return Swal.fire({
    icon: icono,
    title: titulo,
    text: texto,
    confirmButtonText: "Aceptar",
  });
}
