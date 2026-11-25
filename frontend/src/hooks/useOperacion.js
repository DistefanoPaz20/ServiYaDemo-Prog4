import { useState, useRef } from "react";

function useOperacion() {
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const bloqueo = useRef(false);

  async function ejecutar(operacion) {
    if (bloqueo.current) return false;

    bloqueo.current = true;

    setProcesando(true);
    setError("");

    try {
      await operacion();

      return true;

    } catch (error) {
      setError(
        error.message || "No se pudo completar la operación."
      );

      return false;

    } finally {
      bloqueo.current = false;
      setProcesando(false);
    }
  }

  return {
    ejecutar,
    procesando,
    error
  };
}

export default useOperacion;
