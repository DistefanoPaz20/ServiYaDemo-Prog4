
import { Link } from "react-router-dom";
import { FileText, Plus } from "lucide-react";

import useAuthStore from "../../store/authStore";
import usePresupuestosStore from "../../store/presupuestosStore";
import useServiciosStore from "../../store/serviciosStore";
import useHogaresStore from "../../store/hogaresStore";

function PresupuestosList() {

  const usuario = useAuthStore(
    (state) => state.usuario
  );

  const rol = usuario?.rol;
  const perfilId = usuario?.perfilId;

  const presupuestos = usePresupuestosStore(
    (state) => state.presupuestos
  );

  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const hogares = useHogaresStore(
    (state) => state.hogares
  );

  const misPresupuestos = presupuestos.filter(
    (presupuesto) => {

      if (perfilId == null) return false;

      const servicio = servicios.find(
        (servicio) =>
          String(servicio.id) === String(presupuesto.servicioId)
      );

      if (!servicio) return false;

      if (rol === "prestador") {
        return String(servicio.prestadorId) === String(perfilId);
      }

      if (rol === "cliente") {

        const hogar = hogares.find(
          (hogar) =>
            String(hogar.id) === String(servicio.hogarId)
        );

        return (
          hogar &&
          String(hogar.clienteId) === String(perfilId)
        );
      }

      return false;
    }
  );

  return (
    <section className="perfil-page">

      <div className="perfil-header">
        <h2>Mis presupuestos</h2>
        <p>Consultá y gestioná tus presupuestos.</p>
      </div>

      {rol === "prestador" && (
        <div className="perfil-acciones">
          <Link
            to="/prestador/presupuestos/nuevo"
            className="perfil-boton"
          >
            <Plus size={18} />
            Nuevo presupuesto
          </Link>
        </div>
      )}

      {misPresupuestos.length === 0 ? (

        <article className="panel-seccion">
          <p className="panel-vacio">
            Todavía no tenés presupuestos registrados.
          </p>
        </article>

      ) : (

        <div className="presupuestos-grid">

          {misPresupuestos.map((presupuesto) => {

            const servicio = servicios.find(
              (servicio) =>
                String(servicio.id) === String(presupuesto.servicioId)
            );

            return (
              <article
                className="panel-seccion presupuesto-card"
                key={presupuesto.id}
              >

                <div className="presupuesto-header">
                  <FileText size={26} />

                  <span
                    className={`presupuesto-estado ${presupuesto.estado.toLowerCase()}`}
                  >
                    {presupuesto.estado}
                  </span>
                </div>

                <h2>{servicio?.descripcion}</h2>

                <p>{presupuesto.descripcion}</p>

                <span className="presupuesto-fecha">
                  {String(presupuesto.fecha ?? "").slice(0, 10)}
                </span>

                <h3 className="presupuesto-monto">
                  {Number(presupuesto.monto).toLocaleString(
                    "es-AR",
                    {
                      style: "currency",
                      currency: "ARS"
                    }
                  )}
                </h3>

                <Link
                  to={`/${rol}/presupuestos/${presupuesto.id}`}
                  className="perfil-boton"
                >
                  Ver presupuesto
                </Link>

              </article>
            );
          })}

        </div>

      )}

    </section>
  );
}

export default PresupuestosList;
