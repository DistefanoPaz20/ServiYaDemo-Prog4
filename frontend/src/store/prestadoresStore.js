import crearCrudStore from "./crearCrudStore";

const usePrestadoresStore = crearCrudStore({
  entidad: "prestadores",
  endpoint: "/prestadores",
  cargar: "cargarPrestadores",
  agregar: "agregarPrestador",
  editar: "editarPrestador",
  eliminar: "eliminarPrestador"
});

export default usePrestadoresStore;