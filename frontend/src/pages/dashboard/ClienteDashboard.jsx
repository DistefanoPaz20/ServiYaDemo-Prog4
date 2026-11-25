import { Link } from "react-router-dom";

import {
  House,
  Wrench,
  FileText,
  CircleCheck,
  Plus,
  Search
} from "lucide-react";

import useHogaresStore from "../../store/hogaresStore";
import useServiciosStore from "../../store/serviciosStore";
import usePresupuestosStore from "../../store/presupuestosStore";
import useClientesStore from "../../store/clientesStore";
import useAuthStore from "../../store/authStore";

function ClienteDashboard() {


  const usuario=useAuthStore(
    (state)=> state.usuario
  );

  const clienteId= usuario?.perfilId


  const hogares = useHogaresStore(
    (state) => state.hogares
  );

  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const presupuestos = usePresupuestosStore(
    (state) => state.presupuestos
  );

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const cliente = clientes.find(
    (c) => String(c.id) === String(clienteId)
  );

  // HOGARES DEL CLIENTE

  const misHogares = hogares.filter(
    (hogar) =>
      String(hogar.clienteId) === String(clienteId)
  );

  // SERVICIOS DEL CLIENTE

  const misServicios = servicios.filter(
    (servicio) =>
      misHogares.some(
        (hogar) =>
          String(hogar.id) === String(servicio.hogarId)
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

  // PRESUPUESTOS PENDIENTES DEL CLIENTE

  const presupuestosPendientes = presupuestos.filter(
    (presupuesto) =>
      presupuesto.estado === "Pendiente" &&
      misServicios.some(
        (servicio) =>
          String(servicio.id) ===
            String(presupuesto.servicioId) &&
          servicio.estado === "Pendiente"
      )
  );

  // ESTADÍSTICAS

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
      valor: presupuestosPendientes.length,
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

        <h2>
      ¡Bienvenido, {usuario?.nombre ?? "cliente"}!
          </h2>

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

      {/* PRESUPUESTOS POR RESPONDER */}

      {presupuestosPendientes.length > 0 && (

        <section className="panel-seccion">

          <h2>Tenés presupuestos pendientes</h2>

          <p className="panel-vacio">
            Tenés {presupuestosPendientes.length} presupuesto(s)
            esperando tu respuesta.
          </p>

          <div className="perfil-acciones">

            <Link
              to="/cliente/presupuestos"
              className="perfil-boton"
            >
              <FileText size={18} />
              Revisar presupuestos
            </Link>

          </div>

        </section>

      )}

      {/* ACCIONES RÁPIDAS */}

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

      {/* SERVICIOS RECIENTES */}

      <section className="panel-seccion">

        <h2>Mis servicios recientes</h2>

        {misServicios.length === 0 ? (

          <p className="panel-vacio">
            Todavía no tenés servicios registrados.
          </p>

        ) : (

          <div className="panel-servicios">

            {misServicios
              .slice(0,5)
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

export default ClienteDashboard;