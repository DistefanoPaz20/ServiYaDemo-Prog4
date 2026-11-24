import { Link } from "react-router-dom";
import {
  House,
  Wrench,
  FileText,
  CircleCheck,
  Plus,
  Search
} from "lucide-react";

import  useHogaresStore  from "../../store/hogaresStore";
import useServiciosStore  from "../../store/serviciosStore";

function ClienteDashboard() {

  // Cliente provisional hasta implementar la autenticación
  const clienteId = 1;

  const hogares = useHogaresStore((state) => state.hogares);
  const servicios = useServiciosStore((state) => state.servicios);

  const misHogares = hogares.filter(
    (hogar) => String(hogar.clienteId) === String(clienteId)
  );

  const misServicios = servicios.filter(
    (servicio) =>
      misHogares.some(
        (hogar) => String(hogar.id) === String(servicio.hogarId)
      )
  );

  const serviciosActivos = misServicios.filter(
    (servicio) =>
      servicio.estado === "Pendiente" ||
      servicio.estado === "En proceso"
  );

  const serviciosFinalizados = misServicios.filter(
    (servicio) => servicio.estado === "Finalizado"
  );

  const estadisticas = [
    {
      titulo: "Mis hogares",
      valor: misHogares.length,
      icono: House
    },
    {
      titulo: "Servicios activos",
      valor: serviciosActivos.length,
      icono: Wrench
    },
    {
      titulo: "Presupuestos pendientes",
      valor: 0,
      icono: FileText
    },
    {
      titulo: "Servicios finalizados",
      valor: serviciosFinalizados.length,
      icono: CircleCheck
    }
  ];

  return (
    <section className="cliente-dashboard">

      <div className="panel-bienvenida">
        <h2>¡Bienvenido a ServiYa!</h2>
        <p>
          Gestioná tus hogares y servicios desde un solo lugar.
        </p>
      </div>

      <div className="panel-estadisticas">
        {estadisticas.map((estadistica) => {
          const Icono = estadistica.icono;

          return (
            <article
              className="panel-stat-card"
              key={estadistica.titulo}
            >
              <div className="panel-stat-icon">
                <Icono size={24} />
              </div>

              <p>{estadistica.titulo}</p>
              <h3>{estadistica.valor}</h3>
            </article>
          );
        })}
      </div>

      <section className="panel-seccion">
        <h2>Acciones rápidas</h2>

        <div className="panel-acciones">

          <Link to="/cliente/servicios/nuevo">
            <Plus size={22} />
            Solicitar servicio
          </Link>

          <Link to="/cliente/profesionales">
            <Search size={22} />
            Buscar profesionales
          </Link>

          <Link to="/cliente/hogares/nuevo">
            <House size={22} />
            Registrar hogar
          </Link>

        </div>
      </section>

      <section className="panel-seccion">
        <h2>Mis servicios recientes</h2>

        {misServicios.length === 0 ? (
          <p className="panel-vacio">
            Todavía no tenés servicios registrados.
          </p>
        ) : (
          <div className="panel-servicios">

            {misServicios.slice(-5).reverse().map((servicio) => (
              <article
                className="panel-servicio"
                key={servicio.id}
              >
                <div>
                  <h3>{servicio.descripcion}</h3>
                  <p>{servicio.fecha}</p>
                </div>

                <span className="panel-estado">
                  {servicio.estado}
                </span>
              </article>
            ))}

          </div>
        )}
      </section>

    </section>
  );
}

export default ClienteDashboard;