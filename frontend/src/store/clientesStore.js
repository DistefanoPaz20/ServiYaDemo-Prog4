
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useClientesStore = create(
  persist(
    (set) => ({
      clientes: [
        {
          id: 1,
          nombre: "Juan",
          apellido: "Pérez",
          email: "juan@example.com",
          telefono: "3815550101"
        },
        {
          id: 2,
          nombre: "María",
          apellido: "López",
          email: "maria@example.com",
          telefono: "3815550102"
        },
        {
          id: 3,
          nombre: "Carlos",
          apellido: "Gómez",
          email: "carlos@example.com",
          telefono: "3815550103"
        }
      ],

      agregarCliente: (cliente) =>
        set((state) => ({
          clientes: [
            ...state.clientes,
            {
              ...cliente,
              id: crypto.randomUUID()
            }
          ]
        })),

      editarCliente: (id, datos) =>
        set((state) => ({
          clientes: state.clientes.map((cliente) =>
            String(cliente.id) === String(id)
              ? { ...cliente, ...datos }
              : cliente
          )
        })),

      eliminarCliente: (id) =>
        set((state) => ({
          clientes: state.clientes.filter(
            (cliente) => String(cliente.id) !== String(id)
          )
        }))
    }),
    {
      name: "serviya-clientes"
    }
  )
);

export default useClientesStore;
