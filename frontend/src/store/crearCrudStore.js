import { create } from "zustand";
import api from "../services/api";
import useAuthStore from "./authStore";

function normalizar(registro) {
  const datos = { ...registro };

  if (typeof datos.fecha === "string") {
    datos.fecha = datos.fecha.slice(0, 10);
  }

  for (const campo of ["precio", "monto"]) {
    if (datos[campo] != null) {
      datos[campo] = Number(datos[campo]);
    }
  }

  return datos;
}

function crearCrudStore({
  entidad,
  endpoint,
  cargar,
  agregar,
  editar,
  eliminar
}) {
  return create((set) => {

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
        const resultado = await operacion(verificarSesion);

        verificarSesion();

        return resultado;

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
      [entidad]: [],
      cargando: false,
      error: null,

      [cargar]: () =>
        ejecutar(async (verificarSesion) => {
          const datos = await api(endpoint);

          verificarSesion();

          const registros = datos.map(normalizar);

          set({
            [entidad]: registros
          });

          return registros;
        }),

      [agregar]: (datos) =>
        ejecutar(async (verificarSesion) => {
          const respuesta = await api(endpoint, {
            method: "POST",
            body: JSON.stringify(datos)
          });

          verificarSesion();

          const registro = normalizar(respuesta);

          set((state) => ({
            [entidad]: [
              registro,
              ...state[entidad]
            ]
          }));

          return registro;
        }),

      [editar]: (id, datos) =>
        ejecutar(async (verificarSesion) => {
          const respuesta = await api(
            `${endpoint}/${id}`,
            {
              method: "PUT",
              body: JSON.stringify(datos)
            }
          );

          verificarSesion();

          const registro = normalizar(respuesta);

          set((state) => ({
            [entidad]: state[entidad].map((item) =>
              String(item.id) === String(id)
                ? registro
                : item
            )
          }));

          return registro;
        }),

      [eliminar]: (id) =>
        ejecutar(async (verificarSesion) => {
          const respuesta = await api(
            `${endpoint}/${id}`,
            {
              method: "DELETE"
            }
          );

          verificarSesion();

          set((state) => ({
            [entidad]: state[entidad].filter(
              (item) => String(item.id) !== String(id)
            )
          }));

          return respuesta;
        }),

      limpiar: () => {
        version++;

        set({
          [entidad]: [],
          cargando: false,
          error: null
        });
      }
    };
  });
}

export default crearCrudStore;