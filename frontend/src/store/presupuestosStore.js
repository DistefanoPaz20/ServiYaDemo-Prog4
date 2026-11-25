import { create } from "zustand";
import api from "../services/api";
import useAuthStore from "./authStore";
import useServiciosStore from "./serviciosStore";

const usePresupuestosStore = create((set, get) => {

  let version = 0;

  async function ejecutar(operacion) {
    const token = useAuthStore.getState().token;
    const versionActual = version;

    set({
      cargando: true,
      error: null
    });

    function verificarSesion() {
      if (
        token !== useAuthStore.getState().token ||
        versionActual !== version
      ) {
        throw new Error("La sesión ha cambiado.");
      }
    }

    try {
      return await operacion(verificarSesion);

    } catch (error) {
      if (
        token === useAuthStore.getState().token &&
        versionActual === version
      ) {
        set({ error: error.message });
      }

      throw error;

    } finally {
      if (
        token === useAuthStore.getState().token &&
        versionActual === version
      ) {
        set({ cargando: false });
      }
    }
  }

  return {
    presupuestos: [],
    cargando: false,
    error: null,

    cargarPresupuestos: () =>
      ejecutar(async (verificarSesion) => {
        const datos = await api("/presupuestos");

        verificarSesion();

        const presupuestos = datos.map((p) => ({
          ...p,
          monto: Number(p.monto),
          fecha: String(p.fecha).slice(0, 10)
        }));

        set({ presupuestos });

        return presupuestos;
      }),

    agregarPresupuesto: (datos) =>
      ejecutar(async (verificarSesion) => {
        const presupuesto = await api("/presupuestos", {
          method: "POST",
          body: JSON.stringify(datos)
        });

        verificarSesion();

        await get().cargarPresupuestos();

        return presupuesto;
      }),

    cambiarEstadoPresupuesto: (id, estado) =>
      ejecutar(async (verificarSesion) => {
        const presupuesto = await api(
          `/presupuestos/${id}/estado`,
          {
            method: "PATCH",
            body: JSON.stringify({ estado })
          }
        );

        verificarSesion();

        await Promise.all([
          get().cargarPresupuestos(),
          useServiciosStore.getState().cargarServicios()
        ]);

        return presupuesto;
      }),

    limpiar: () => {
      version++;

      set({
        presupuestos: [],
        cargando: false,
        error: null
      });
    }
  };
});

export default usePresupuestosStore;