
import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePrestadoresStore = create(
  persist(
    (set) => ({
      prestadores: [
        {
          id: 1,
          oficioId: 1,
          nombre: "Roberto",
          apellido: "García",
          email: "roberto@example.com",
          telefono: "3815550201",
          experiencia: 8,
          estado: "Activo"
        },
        {
          id: 2,
          oficioId: 2,
          nombre: "Miguel",
          apellido: "Fernández",
          email: "miguel@example.com",
          telefono: "3815550202",
          experiencia: 5,
          estado: "Activo"
        },
        {
          id: 3,
          oficioId: 6,
          nombre: "Diego",
          apellido: "Martínez",
          email: "diego@example.com",
          telefono: "3815550203",
          experiencia: 10,
          estado: "Inactivo"
        }
      ],

      agregarPrestador: (prestador) =>
        set((state) => ({
          prestadores: [
            ...state.prestadores,
            {
              ...prestador,
              id: crypto.randomUUID()
            }
          ]
        })),

      editarPrestador: (id, datos) =>
        set((state) => ({
          prestadores: state.prestadores.map((prestador) =>
            String(prestador.id) === String(id)
              ? { ...prestador, ...datos }
              : prestador
          )
        })),

      eliminarPrestador: (id) =>
        set((state) => ({
          prestadores: state.prestadores.filter(
            (prestador) =>
              String(prestador.id) !== String(id)
          )
        }))
    }),
    {
      name: "serviya-prestadores"
    }
  )
);

export default usePrestadoresStore;
