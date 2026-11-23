
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

// Estadísticas generales

const estadisticas = [
  {
    titulo: "Clientes",
    valor: 25,
    icono: Users,
    color: "#0057FF"
  },
  {
    titulo: "Prestadores",
    valor: 15,
    icono: Wrench,
    color: "#16A34A"
  },
  {
    titulo: "Hogares",
    valor: 30,
    icono: House,
    color: "#9333EA"
  },
  {
    titulo: "Servicios",
    valor: 48,
    icono: ClipboardList,
    color: "#EA580C"
  }
];

// Datos del gráfico de barras

const serviciosPorOficio = [
  { oficio: "Plomería", cantidad: 12 },
  { oficio: "Electricidad", cantidad: 10 },
  { oficio: "Cerrajería", cantidad: 5 },
  { oficio: "Pintura", cantidad: 8 },
  { oficio: "Climatización", cantidad: 7 },
  { oficio: "Carpintería", cantidad: 6 }
];

// Datos del gráfico circular

const estadosServicios = [
  { estado: "Finalizados", cantidad: 28 },
  { estado: "En proceso", cantidad: 12 },
  { estado: "Pendientes", cantidad: 8 }
];

// Datos del gráfico de líneas

const serviciosPorDia = [
  { dia: "Lunes", cantidad: 4 },
  { dia: "Martes", cantidad: 6 },
  { dia: "Miércoles", cantidad: 5 },
  { dia: "Jueves", cantidad: 8 },
  { dia: "Viernes", cantidad: 7 },
  { dia: "Sábado", cantidad: 11 },
  { dia: "Domingo", cantidad: 7 }
];

const colores = [
  "#16A34A",
  "#0057FF",
  "#F59E0B"
];

function AdminDashboard() {
  return (
    <section className="admin-dashboard">

      {/* Encabezado */}

      <div className="admin-header">
        <h2>Resumen general</h2>
        <p>
          Gestioná y supervisá la actividad de ServiYa.
        </p>

        <span className="admin-demo">
          Datos de demostración
        </span>
      </div>

      {/* Tarjetas de estadísticas */}

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

      {/* Contenedor general de gráficos */}

      <div className="admin-charts">

        {/* GRÁFICO 1: BARRAS */}

        <article className="admin-chart-card">
          <h3>Servicios por oficio</h3>
          <p>Cantidad de servicios por especialidad.</p>

          <div className="admin-chart">
            <ResponsiveContainer width="100%" height="100%">
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

        {/* GRÁFICO 2: CIRCULAR */}

        <article className="admin-chart-card">
          <h3>Estado de los servicios</h3>
          <p>Distribución según su estado actual.</p>

          <div className="admin-chart">
            <ResponsiveContainer width="100%" height="100%">
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
                  {estadosServicios.map((estado, index) => (
                    <Cell
                      key={estado.estado}
                      fill={colores[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* GRÁFICO 3: LÍNEAS */}

        <article className="admin-chart-card admin-chart-full">
          <h3>Evolución semanal de servicios</h3>

          <p>
            Cantidad de solicitudes recibidas por día.
          </p>

          <div className="admin-chart">
            <ResponsiveContainer width="100%" height="100%">

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
                  name="Solicitudes recibidas"
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
