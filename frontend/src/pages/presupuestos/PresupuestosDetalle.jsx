
import { useState } from "react";
import {
  useParams,
  Link
} from "react-router-dom";

import useAuthStore from "../../store/authStore";
import usePresupuestosStore from "../../store/presupuestosStore";
import useServiciosStore from "../../store/serviciosStore";
import useHogaresStore from "../../store/hogaresStore";

function PresupuestoDetalle() {

  const { id } = useParams();

  const usuario = useAuthStore(
    (state) => state.usuario
  );

  const rol = usuario?.rol;
  const perfilId = usuario?.perfilId;

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const presupuestos = usePresupuestosStore(
    (state) => state.presupuestos
  );

  const cambiarEstadoPresupuesto = usePresupuestosStore(
    (state) => state.cambiarEstadoPresupuesto
  );

  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const hogares = useHogaresStore(
    (state) => state.hogares
  );

  const presupuesto = presupuestos.find(
    (presupuesto) => String(presupuesto.id) === String(id)
  );

  const servicio = servicios.find(
    (servicio) =>
      String(servicio.id) === String(presupuesto?.servicioId)
  );

  const hogar = hogares.find(
    (hogar) =>
      String(hogar.id) === String(servicio?.hogarId)
  );

  const autorizado =
    perfilId != null &&
    (
      rol === "cliente"
        ? hogar &&
          String(hogar.clienteId) === String(perfilId)
        : rol === "prestador" &&
          servicio &&
          String(servicio.prestadorId) === String(perfilId)
    );

  if (!presupuesto || !servicio || !autorizado) {
    return <p>Presupuesto no disponible.</p>;
  }

  const puedeResponder =
    rol === "cliente" &&
    presupuesto.estado === "Pendiente" &&
    servicio.estado === "Pendiente";

  async function responderPresupuesto(estado) {

    if (!puedeResponder || procesando) return;

    if (!["Aceptado", "Rechazado"].includes(estado)) {
      return;
    }

    const mensaje = estado === "Aceptado"
      ? "¿Confirmás que querés aceptar este presupuesto?"
      : "¿Confirmás que querés rechazar este presupuesto?";

    if (!window.confirm(mensaje)) return;

    setError("");
    setProcesando(true);

    try {

      await cambiarEstadoPresupuesto(
        presupuesto.id,
        estado
      );

    } catch (error) {

      setError(
        error.message || "No se pudo responder el presupuesto."
      );

    } finally {

      setProcesando(false);

    }
  }

  return (
    <section className="perfil-page">

      <div className="perfil-header">
        <h2>Detalle del presupuesto</h2>
        <p>Consultá la información de la propuesta.</p>
      </div>

      <article className="panel-seccion">

        <div className="presupuesto-header">

          <h2>{servicio.descripcion}</h2>

          <span
            className={`presupuesto-estado ${presupuesto.estado.toLowerCase()}`}
          >
            {presupuesto.estado}
          </span>

        </div>

        <div className="perfil-grid">

          <div className="perfil-dato">
            <span>Descripción</span>
            <strong>{presupuesto.descripcion}</strong>
          </div>

          <div className="perfil-dato">
            <span>Fecha</span>
            <strong>
              {String(presupuesto.fecha ?? "").slice(0, 10)}
            </strong>
          </div>

          <div className="perfil-dato">
            <span>Monto total</span>
            <strong>
              {Number(presupuesto.monto).toLocaleString(
                "es-AR",
                {
                  style: "currency",
                  currency: "ARS"
                }
              )}
            </strong>
          </div>

          <div className="perfil-dato">
            <span>Estado del servicio</span>
            <strong>{servicio.estado}</strong>
          </div>

        </div>

        {error && (
          <p className="login-message" role="alert">
            {error}
          </p>
        )}

        {procesando && (
          <p className="panel-vacio">
            Procesando respuesta...
          </p>
        )}

        <div className="crud-form-actions">

          <Link to={`/${rol}/presupuestos`}>
            Volver
          </Link>

          {puedeResponder && (
            <>
              <button
                type="button"
                className="presupuesto-rechazar"
                disabled={procesando}
                onClick={() =>
                  responderPresupuesto("Rechazado")
                }
              >
                Rechazar
              </button>

              <button
                type="button"
                className="perfil-boton"
                disabled={procesando}
                onClick={() =>
                  responderPresupuesto("Aceptado")
                }
              >
                Aceptar presupuesto
              </button>
            </>
          )}

        </div>

      </article>

    </section>
  );
}

export default PresupuestoDetalle;
