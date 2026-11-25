import useAuthStore from "../store/authStore";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

export async function api(
  endpoint,
  opciones = {}
) {
  const token = useAuthStore.getState().token;

  const {
    autenticado = true,
    headers = {},
    ...configuracion
  } = opciones;

  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}${endpoint}`, {
      ...configuracion,

      headers: {
        "Content-Type": "application/json",

        ...(autenticado && token
          ? { Authorization: `Bearer ${token}` }
          : {}),

        ...headers
      }
    });

  } catch {
    throw new Error(
      "No se pudo conectar con el servidor."
    );
  }

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    if (
      respuesta.status === 401 &&
      autenticado &&
      token &&
      useAuthStore.getState().token === token
    ) {
      useAuthStore.getState().cerrarSesion();
    }

    throw new Error(
      datos?.message ||
      `Error del servidor (${respuesta.status})`
    );
  }

  return datos;
}

export default api;