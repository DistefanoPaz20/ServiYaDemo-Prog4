import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePresupuestosStore = create(
  persist(
    (set) => ({
      presupuestos: [],

      agregarPresupuesto: (presupuesto) =>
        set((state) => ({
          presupuestos: [
            ...state.presupuestos,
            {
              ...presupuesto,
              id: crypto.randomUUID(),
              estado: "Pendiente"
            }
          ]
        })),

      cambiarEstadoPresupuesto: (id, estado) =>
        set((state) => ({
          presupuestos: state.presupuestos.map(
            (presupuesto) =>
              String(presupuesto.id) === String(id)
                ? { ...presupuesto, estado }
                : presupuesto
          )
        }))
    }),
    {
      name: "serviya-presupuestos"
    }
  )
);

export default usePresupuestosStore;