import { Link } from "react-router-dom";
import {
  ClipboardList,
  Wrench,
  CircleCheck,
  Wallet,
  FileText,
  UserRound
} from "lucide-react";

import useServiciosStore from "../../store/serviciosStore";

function PrestadorDashboard() {

  // Prestador provisional hasta implementar JWT
  const prestadorId = 1;

  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const misServicios = servicios.filter(
    (servicio) =>
      String(servicio.prestadorId) === String(prestadorId)
  );

  const solicitudes = misServicios.filter(
    (servicio) => servicio.estado === "Pendiente"
  );

  const trabajosActivos = misServicios.filter(
    (servicio) => servicio.estado === "En proceso"
  );

  const trabajosFinalizados = misServicios.filter(
    (servicio) => servicio.estado === "Finalizado"
  );

  const ingresos = trabajosFinalizados.reduce(
    (total, servicio) => total + Number(servicio.precio),
    0
  );

  const ingresosFormateados = ingresos.toLocaleString(
    "es-AR",
    {
      style: "currency",
      currency: "ARS"
    }
  );

  const estadisticas = [
    {
      titulo: "Solicitudes pendientes",
      valor: solicitudes.length,
      icono: ClipboardList
    },
    {
      titulo: "Trabajos activos",
      valor: trabajosActivos.length,
      icono: Wrench
    },
    {
      titulo: "Trabajos finalizados",
      valor: trabajosFinalizados.length,
      icono: CircleCheck
    },
    {
      titulo: "Ingresos por servicios",
      valor: ingresosFormateados,
      icono: Wallet
    }
  ];

  return (
    <section className="prestador-dashboard">

      <div className="panel-bienvenida">
        <h2>¡Bienvenido a tu panel profesional!</h2>
        <p>
          Gestioná tus solicitudes, trabajos y presupuestos
          desde un solo lugar.
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

          <Link to="/prestador/solicitudes">
            <ClipboardList size={22} />
            Ver solicitudes
          </Link>

          <Link to="/prestador/presupuestos">
            <FileText size={22} />
            Mis presupuestos
          </Link>

          <Link to="/prestador/perfil">
            <UserRound size={22} />
            Mi perfil
          </Link>

        </div>
      </section>

      <section className="panel-seccion">
        <h2>Mis trabajos recientes</h2>

        {misServicios.length === 0 ? (
          <p className="panel-vacio">
            Todavía no tenés trabajos asignados.
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

export default PrestadorDashboard;