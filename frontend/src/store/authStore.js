import { create } from "zustand";

const useAuthStore = create((set) => ({
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
}));

export default useAuthStore;