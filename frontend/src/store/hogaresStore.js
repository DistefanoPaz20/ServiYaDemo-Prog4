import crearCrudStore from "./crearCrudStore";

const useHogaresStore = crearCrudStore({
  entidad: "hogares",
  endpoint: "/hogares",
  cargar: "cargarHogares",
  agregar: "agregarHogar",
  editar: "editarHogar",
  eliminar: "eliminarHogar"
});

export default useHogaresStore;
