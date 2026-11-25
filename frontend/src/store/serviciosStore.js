import crearCrudStore from "./crearCrudStore";
import api from "../services/api";
import useAuthStore from "./authStore";

const useServiciosStore = crearCrudStore({
  entidad: "servicios",
  endpoint: "/servicios",
  cargar: "cargarServicios",
  agregar: "agregarServicio",
  editar: "editarServicio",
  eliminar: "eliminarServicio"
});

useServiciosStore.setState({

  cambiarEstadoServicio: async (id, estado) => {
    const token = useAuthStore.getState().token;

    useServiciosStore.setState({
      cargando: true,
      error: null
    });

    try {
      const servicio = await api(
        `/servicios/${id}/estado`,
        {
          method: "PATCH",
          body: JSON.stringify({ estado })
        }
      );

      if (token !== useAuthStore.getState().token) {
        throw new Error("La sesión ha cambiado.");
      }

      await useServiciosStore.getState().cargarServicios();

      return servicio;

    } catch (error) {
      if (token === useAuthStore.getState().token) {
        useServiciosStore.setState({
          error: error.message
        });
      }

      throw error;

    } finally {
      if (token === useAuthStore.getState().token) {
        useServiciosStore.setState({
          cargando: false
        });
      }
    }
  }
});

export default useServiciosStore;