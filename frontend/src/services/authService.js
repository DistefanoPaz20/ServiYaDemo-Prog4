import api from "./api";

export function login(datos) {
  return api("/auth/login", {
    method: "POST",
    autenticado: false,
    body: JSON.stringify(datos)
  });
}

export function registro(datos) {
  return api("/auth/registro", {
    method: "POST",
    autenticado: false,
    body: JSON.stringify(datos)
  });
}

export function obtenerUsuario() {
  return api("/auth/me");
}

export default {
  login,
  registro,
  obtenerUsuario
};