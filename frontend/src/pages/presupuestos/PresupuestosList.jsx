import { Link, useLocation } from "react-router-dom";
import { FileText, Plus } from "lucide-react";

import usePresupuestosStore from "../../store/presupuestosStore";
import useServiciosStore from "../../store/serviciosStore";
import useHogaresStore from "../../store/hogaresStore";

function PresupuestosList() {

  const location = useLocation();
  const rol = location.pathname.split("/")[1];

  const perfilId = 1;

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

      const servicio = servicios.find(
        (servicio) =>
          String(servicio.id) === String(presupuesto.servicioId)
      );

      if (!servicio) return false;

      if (rol === "prestador") {
        return String(servicio.prestadorId) === String(perfilId);
      }

      const hogar = hogares.find(
        (hogar) =>
          String(hogar.id) === String(servicio.hogarId)
      );

      return String(hogar?.clienteId) === String(perfilId);
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
                  {presupuesto.fecha}
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