
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useOficiosStore = create(
  persist(
    (set) => ({
      oficios: [
        {
          id: 1,
          nombre: "Plomería",
          descripcion: "Instalación y reparación de cañerías"
        },
        {
          id: 2,
          nombre: "Electricidad",
          descripcion: "Instalaciones y reparaciones eléctricas"
        },
        {
          id: 3,
          nombre: "Cerrajería",
          descripcion: "Reparación e instalación de cerraduras"
        },
        {
          id: 4,
          nombre: "Pintura",
          descripcion: "Pintura de interiores y exteriores"
        },
        {
          id: 5,
          nombre: "Climatización",
          descripcion: "Instalación y reparación de aires acondicionados"
        },
        {
          id: 6,
          nombre: "Carpintería",
          descripcion: "Creación y reparación de muebles"
        }
      ],

      agregarOficio: (oficio) =>
        set((state) => ({
          oficios: [
            ...state.oficios,
            {
              ...oficio,
              id: crypto.randomUUID()
            }
          ]
        })),

      editarOficio: (id, datos) =>
        set((state) => ({
          oficios: state.oficios.map((oficio) =>
            String(oficio.id) === String(id)
              ? { ...oficio, ...datos }
              : oficio
          )
        })),

      eliminarOficio: (id) =>
        set((state) => ({
          oficios: state.oficios.filter(
            (oficio) => String(oficio.id) !== String(id)
          )
        }))
    }),
    {
      name: "serviya-oficios"
    }
  )
);

export default useOficiosStore;
