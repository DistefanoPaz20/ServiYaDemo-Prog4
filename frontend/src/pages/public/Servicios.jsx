
import { useSearchParams } from "react-router-dom";
import {
  Droplets,
  Zap,
  LockKeyhole,
  PaintRoller,
  Snowflake,
  TreePine,
  Search
} from "lucide-react";

const oficios = [
  {
    id: 1,
    nombre: "Plomería",
    descripcion: "Reparación de cañerías, griferías y pérdidas de agua.",
    icono: Droplets,
    color: "#008CFF"
  },
  {
    id: 2,
    nombre: "Electricidad",
    descripcion: "Instalaciones eléctricas y reparaciones del hogar.",
    icono: Zap,
    color: "#F59E0B"
  },
  {
    id: 3,
    nombre: "Cerrajería",
    descripcion: "Apertura de cerraduras y reparación de accesos.",
    icono: LockKeyhole,
    color: "#7C3AED"
  },
  {
    id: 4,
    nombre: "Pintura",
    descripcion: "Pintura de interiores, exteriores y mantenimiento.",
    icono: PaintRoller,
    color: "#EF4444"
  },
  {
    id: 5,
    nombre: "Climatización",
    descripcion: "Instalación y mantenimiento de aires acondicionados.",
    icono: Snowflake,
    color: "#00A6C8"
  },
  {
    id:6,
    nombre:"Carpinteria",
    descripcion:"Creacion de muebles a medida, reparacion e innovacion de muebles antiguos de uso cotidiano",
    icono:TreePine,
    color:"#8B5a2b"

  }
];

function Servicios() {
  const [searchParams, setSearchParams] = useSearchParams();

  const busqueda = searchParams.get("buscar") || "";

  const normalizar = (texto) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const oficiosFiltrados = oficios.filter((oficio) => {
    const texto = `${oficio.nombre} ${oficio.descripcion}`;
    return normalizar(texto).includes(normalizar(busqueda.trim()));
  });

  return (
    <section className="servicios-page">
      <div className="container">

        <div className="servicios-header">
          <h1>Nuestros servicios</h1>
          <p>Profesionales verificados para tu hogar</p>
        </div>

        <div className="servicios-search">
          <Search size={20} />

          <input
            type="search"
            placeholder="Buscar un oficio..."
            aria-label="Buscar oficio"
            value={busqueda}
            onChange={(evento) => {
              const valor = evento.target.value;
              setSearchParams(valor ? { buscar: valor } : {});
            }}
          />
        </div>

        <div className="servicios-grid">
          {oficiosFiltrados.map((oficio) => {
            const Icono = oficio.icono;

            return (
              <article className="servicio-card" key={oficio.id}>
                <div
                  className="servicio-icon"
                  style={{ color: oficio.color }}
                >
                  <Icono size={36} strokeWidth={2.2} />
                </div>

                <h2>{oficio.nombre}</h2>
                <p>{oficio.descripcion}</p>
              </article>
            );
          })}
        </div>

        {oficiosFiltrados.length === 0 && (
          <div className="servicios-empty">
            <Search size={32} />
            <h2>No encontramos ese servicio</h2>
            <p>Probá con otro nombre o especialidad.</p>
          </div>
        )}

      </div>
    </section>
  );
}

export default Servicios;
