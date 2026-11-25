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
import usePrestadoresStore from "../../store/prestadoresStore";
import useAuthStore from "../../store/authStore";
import state  from "../../../../backend/src/config/db";

function PrestadorDashboard() {

  const usuario=useAuthStore(
    (state)=>state.usuario
  )
  const prestadorId=usuario?.perfilId
  
  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const prestadores = usePrestadoresStore(
    (state) => state.prestadores
  );

  const prestador = prestadores.find(
    (p) => String(p.id) === String(prestadorId)
  );

  // SERVICIOS DEL PRESTADOR

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

  // IMPORTE DE TRABAJOS FINALIZADOS

  const ingresos = trabajosFinalizados.reduce(
    (total, servicio) => {

      const precio = Number(servicio.precio);

      return total + (
        Number.isFinite(precio) && precio >= 0
          ? precio
          : 0
      );

    },
    0
  );

  const ingresosFormateados = ingresos.toLocaleString(
    "es-AR",
    {
      style: "currency",
      currency: "ARS"
    }
  );

  // ESTADÍSTICAS

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
      titulo: "Importe de trabajos finalizados",
      valor: ingresosFormateados,
      icono: Wallet
    }
  ];

  return (
    <section className="prestador-dashboard">

      <div className="panel-bienvenida">

        <h2>
        ¡Bienvenido, {usuario?.nombre ?? "profesional"}!
        </h2>

        <p>
          Gestioná tus solicitudes, trabajos y presupuestos
          desde un solo lugar.
        </p>

      </div>

      {/* ESTADÍSTICAS */}

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

      {/* AVISO DE SOLICITUDES */}

      {solicitudes.length > 0 && (

        <section className="panel-seccion">

          <h2>Solicitudes pendientes</h2>

          <p className="panel-vacio">
            Tenés {solicitudes.length} solicitud(es)
            pendientes de gestionar.
          </p>

          <div className="perfil-acciones">

            <Link
              to="/prestador/solicitudes"
              className="perfil-boton"
            >
              <ClipboardList size={18} />
              Revisar solicitudes
            </Link>

          </div>

        </section>

      )}

      {/* ACCIONES RÁPIDAS */}

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

      {/* ACTIVIDAD RECIENTE */}

      <section className="panel-seccion">

        <h2>Mi actividad reciente</h2>

        {misServicios.length === 0 ? (

          <p className="panel-vacio">
            Todavía no tenés trabajos asignados.
          </p>

        ) : (

          <div className="panel-servicios">

            {misServicios
             .splice(0,5)
              .map((servicio) => (

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