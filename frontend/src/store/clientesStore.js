import crearCrudStore from "./crearCrudStore";

const useClientesStore = crearCrudStore({
  entidad: "clientes",
  endpoint: "/clientes",
  cargar: "cargarClientes",
  agregar: "agregarCliente",
  editar: "editarCliente",
  eliminar: "eliminarCliente"
});

export default useClientesStore;
