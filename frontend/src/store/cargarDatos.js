import useClientesStore from "./clientesStore";
import useHogaresStore from "./hogaresStore";
import useOficiosStore from "./crearOficiosStore";
import usePrestadoresStore from "./prestadoresStore";
import useServiciosStore from "./serviciosStore";
import usePresupuestosStore from "./presupuestosStore";

export function limpiarDatos() {
  useClientesStore.getState().limpiar();
  useHogaresStore.getState().limpiar();
  useOficiosStore.getState().limpiar();
  usePrestadoresStore.getState().limpiar();
  useServiciosStore.getState().limpiar();
  usePresupuestosStore.getState().limpiar();
}

export async function cargarDatos(rol) {
  const tareas = [
    useOficiosStore.getState().cargarOficios(),
    usePrestadoresStore.getState().cargarPrestadores(),
    useServiciosStore.getState().cargarServicios(),
    usePresupuestosStore.getState().cargarPresupuestos()
  ];

  if (rol === "admin" || rol === "cliente") {
    tareas.push(
      useClientesStore.getState().cargarClientes(),
      useHogaresStore.getState().cargarHogares()
    );
  }

  await Promise.all(tareas);
}