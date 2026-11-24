import {
  Users,
  Wrench,
  House,
  ClipboardList
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  Cell
} from "recharts";

import StatCard from "../../components/ui/StatCard";

import useClientesStore from "../../store/clientesStore";
import usePrestadoresStore from "../../store/prestadoresStore";
import useHogaresStore from "../../store/hogaresStore";
import useServiciosStore from "../../store/serviciosStore";
import useOficiosStore from "../../store/crearOficiosStore";

function AdminDashboard() {

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const prestadores = usePrestadoresStore(
    (state) => state.prestadores
  );

  const hogares = useHogaresStore(
    (state) => state.hogares
  );

  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const oficios = useOficiosStore(
    (state) => state.oficios
  );

  // ESTADÍSTICAS GENERALES

  const estadisticas = [
    {
      titulo: "Clientes",
      valor: clientes.length,
      icono: Users,
      color: "#0057FF"
    },
    {
      titulo: "Prestadores",
      valor: prestadores.length,
      icono: Wrench,
      color: "#16A34A"
    },
    {
      titulo: "Hogares",
      valor: hogares.length,
      icono: House,
      color: "#9333EA"
    },
    {
      titulo: "Servicios",
      valor: servicios.length,
      icono: ClipboardList,
      color: "#EA580C"
    }
  ];

  // SERVICIOS POR OFICIO

  const serviciosPorOficio = oficios.map((oficio) => {

    const cantidad = servicios.filter((servicio) => {

      const prestador = prestadores.find(
        (p) =>
          String(p.id) === String(servicio.prestadorId)
      );

      return (
        String(prestador?.oficioId) === String(oficio.id)
      );

    }).length;

    return {
      oficio: oficio.nombre,
      cantidad
    };
  });

  // ESTADOS DE LOS SERVICIOS

  const estadosServicios = [
    {
      estado: "Finalizados",
      cantidad: servicios.filter(
        (s) => s.estado === "Finalizado"
      ).length,
      color: "#16A34A"
    },
    {
      estado: "En proceso",
      cantidad: servicios.filter(
        (s) => s.estado === "En proceso"
      ).length,
      color: "#0057FF"
    },
    {
      estado: "Pendientes",
      cantidad: servicios.filter(
        (s) => s.estado === "Pendiente"
      ).length,
      color: "#F59E0B"
    },
    {
      estado: "Cancelados",
      cantidad: servicios.filter(
        (s) => s.estado === "Cancelado"
      ).length,
      color: "#DC2626"
    }
  ];

  // SERVICIOS DE LOS ÚLTIMOS 7 DÍAS

  const serviciosPorDia = Array.from(
    { length: 7 },
    (_, index) => {

      const fecha = new Date();

      fecha.setDate(
        fecha.getDate() - (6 - index)
      );

      const anio = fecha.getFullYear();

      const mes = String(
        fecha.getMonth() + 1
      ).padStart(2, "0");

      const dia = String(
        fecha.getDate()
      ).padStart(2, "0");

      const fechaISO = `${anio}-${mes}-${dia}`;

      const cantidad = servicios.filter(
        (servicio) =>
          String(servicio.fecha).slice(0, 10) === fechaISO
      ).length;

      return {
        dia: `${dia}/${mes}`,
        cantidad
      };
    }
  );

  return (
    <section className="admin-dashboard">

      {/* ENCABEZADO */}

      <div className="admin-header">
        <h2>Resumen general</h2>

        <p>
          Gestioná y supervisá la actividad de ServiYa.
        </p>

        <span className="admin-demo">
          Datos del sistema
        </span>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}

      <div className="admin-stats">

        {estadisticas.map((estadistica) => (
          <StatCard
            key={estadistica.titulo}
            titulo={estadistica.titulo}
            valor={estadistica.valor}
            icono={estadistica.icono}
            color={estadistica.color}
          />
        ))}

      </div>

      <div className="admin-charts">

        {/* GRÁFICO DE BARRAS */}

        <article className="admin-chart-card">

          <h3>Servicios por oficio</h3>

          <p>
            Cantidad de servicios por especialidad.
          </p>

          <div className="admin-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={serviciosPorOficio}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="oficio"
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={75}
                  tick={{ fontSize: 11 }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey="cantidad"
                  name="Servicios"
                  fill="#0057FF"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </article>

        {/* GRÁFICO CIRCULAR */}

        <article className="admin-chart-card">

          <h3>Estado de los servicios</h3>

          <p>
            Distribución según su estado actual.
          </p>

          <div className="admin-chart">

            {servicios.length === 0 ? (

              <p className="panel-vacio">
                Todavía no hay servicios registrados.
              </p>

            ) : (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={estadosServicios}
                    dataKey="cantidad"
                    nameKey="estado"
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >

                    {estadosServicios.map((estado) => (
                      <Cell
                        key={estado.estado}
                        fill={estado.color}
                      />
                    ))}

                  </Pie>

                  <Tooltip />
                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            )}

          </div>

        </article>

        {/* GRÁFICO DE LÍNEAS */}

        <article className="admin-chart-card admin-chart-full">

          <h3>Servicios de los últimos 7 días</h3>

          <p>
            Cantidad de servicios según su fecha programada.
          </p>

          <div className="admin-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={serviciosPorDia}
                margin={{
                  top: 15,
                  right: 20,
                  left: 0,
                  bottom: 10
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="dia"
                  tick={{ fontSize: 12 }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="cantidad"
                  name="Servicios programados"
                  stroke="#0057FF"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#0057FF",
                    stroke: "#FFFFFF",
                    strokeWidth: 2
                  }}
                  activeDot={{
                    r: 8
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </article>

      </div>

    </section>
  );
}

export default AdminDashboard;