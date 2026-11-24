
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useHogaresStore = create(
  persist(
    (set) => ({
      hogares: [
        {
          id: 1,
          clienteId: 1,
          direccion: "Av. Aconquija 1500",
          localidad: "Yerba Buena",
          tipo: "Casa",
          descripcion: "Vivienda familiar"
        },
        {
          id: 2,
          clienteId: 2,
          direccion: "San Martín 850",
          localidad: "San Miguel de Tucumán",
          tipo: "Departamento",
          descripcion: "Departamento residencial"
        },
        {
          id: 3,
          clienteId: 1,
          direccion: "Av. Perón 1200",
          localidad: "Yerba Buena",
          tipo: "Casa",
          descripcion: "Segunda propiedad"
        }
      ],

      agregarHogar: (hogar) =>
        set((state) => ({
          hogares: [
            ...state.hogares,
            {
              ...hogar,
              id: crypto.randomUUID()
            }
          ]
        })),

      editarHogar: (id, datos) =>
        set((state) => ({
          hogares: state.hogares.map((hogar) =>
            String(hogar.id) === String(id)
              ? { ...hogar, ...datos }
              : hogar
          )
        })),

      eliminarHogar: (id) =>
        set((state) => ({
          hogares: state.hogares.filter(
            (hogar) => String(hogar.id) !== String(id)
          )
        }))
    }),
    {
      name: "serviya-hogares"
    }
  )
);

export default useHogaresStore;
