
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useServiciosStore = create(
  persist(
    (set) => ({
      servicios: [],

      agregarServicio: (servicio) =>
        set((state) => ({
          servicios: [
            ...state.servicios,
            {
              ...servicio,
              id: crypto.randomUUID()
            }
          ]
        })),

      editarServicio: (id, datos) =>
        set((state) => ({
          servicios: state.servicios.map((servicio) =>
            String(servicio.id) === String(id)
              ? { ...servicio, ...datos }
              : servicio
          )
        })),

      eliminarServicio: (id) =>
        set((state) => ({
          servicios: state.servicios.filter(
            (servicio) =>
              String(servicio.id) !== String(id)
          )
        }))
    }),
    {
      name: "serviya-servicios"
    }
  )
);

export default useServiciosStore;
