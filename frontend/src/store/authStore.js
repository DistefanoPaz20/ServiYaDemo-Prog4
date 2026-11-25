import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      autenticado: false,

      iniciarSesion: (usuario, token) =>
        set({
          usuario,
          token,
          autenticado: true
        }),

      actualizarUsuario: (datos) =>
        set((state) => ({
          usuario: state.usuario
            ? { ...state.usuario, ...datos }
            : null
        })),

      cerrarSesion: () =>
        set({
          usuario: null,
          token: null,
          autenticado: false
        })
    }),

    {
      name: "serviya-auth",

      storage: createJSONStorage(
        () => sessionStorage
      ),

      partialize: (state) => ({
        usuario: state.usuario,
        token: state.token,
        autenticado: state.autenticado
      })
    }
  )
);

export default useAuthStore;