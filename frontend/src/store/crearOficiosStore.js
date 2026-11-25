import crearCrudStore from "./crearCrudStore";

const useOficiosStore = crearCrudStore({
  entidad: "oficios",
  endpoint: "/oficios",
  cargar: "cargarOficios",
  agregar: "agregarOficio",
  editar: "editarOficio",
  eliminar: "eliminarOficio"
});

export default useOficiosStore;
