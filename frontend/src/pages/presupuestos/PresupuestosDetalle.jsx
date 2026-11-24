import {
  useParams,
  useLocation,
  Link
} from "react-router-dom";

import usePresupuestosStore from "../../store/presupuestosStore";
import useServiciosStore from "../../store/serviciosStore";
import useHogaresStore from "../../store/hogaresStore";

function PresupuestoDetalle() {

  const { id } = useParams();
  const location = useLocation();

  const rol = location.pathname.split("/")[1];
  const perfilId = 1;

  const presupuestos = usePresupuestosStore(
    (state) => state.presupuestos
  );

  const cambiarEstadoPresupuesto = usePresupuestosStore(
    (state) => state.cambiarEstadoPresupuesto
  );

  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const editarServicio = useServiciosStore(
    (state) => state.editarServicio
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

  const autorizado = rol === "cliente"
    ? String(hogar?.clienteId) === String(perfilId)
    : String(servicio?.prestadorId) === String(perfilId);

  if (!presupuesto || !servicio || !autorizado) {
    return <p>Presupuesto no disponible.</p>;
  }

  const puedeResponder =
    rol === "cliente" &&
    presupuesto.estado === "Pendiente" &&
    servicio.estado === "Pendiente";

  function responderPresupuesto(estado) {

    if (!puedeResponder) return;

    if (estado === "Aceptado") {

      editarServicio(servicio.id, {
        precio: presupuesto.monto,
        estado: "En proceso"
      });
    }

    cambiarEstadoPresupuesto(
      presupuesto.id,
      estado
    );
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
            <strong>{presupuesto.fecha}</strong>
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

        <div className="crud-form-actions">

          <Link to={`/${rol}/presupuestos`}>
            Volver
          </Link>

          {puedeResponder && (
            <>
              <button
                type="button"
                className="presupuesto-rechazar"
                onClick={() =>
                  responderPresupuesto("Rechazado")
                }
              >
                Rechazar
              </button>

              <button
                type="button"
                className="perfil-boton"
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