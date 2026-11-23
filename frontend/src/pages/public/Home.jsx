import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search } from "lucide-react";

import tecnico from "../../assets/images/TecnicoPrincipalServiYa.png";

function Home() {
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  function buscarServicio(evento) {
    evento.preventDefault();

    const termino = busqueda.trim();

    if (termino) {
      navigate(`/servicios?buscar=${encodeURIComponent(termino)}`);
    } else {
      navigate("/servicios");
    }
  }

  return (
    <section className="hero">
      <div className="container hero-content">

        <div className="hero-text">
          <h1>
            Encontrá el profesional que necesitás,
            <span> en tu zona.</span>
          </h1>

          <p>
            Conectamos tu hogar con profesionales
            verificados, de forma rápida y segura.
          </p>

          <form className="hero-search" onSubmit={buscarServicio}>
            <MapPin size={20} className="hero-location-icon" />

            <input
              type="text"
              placeholder="¿Qué servicio necesitás? Ej: Plomería"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              aria-label="Buscar servicio"
            />

            <button type="submit" aria-label="Buscar">
              <Search size={20} />
            </button>
          </form>

          <p className="hero-helper">
            Encontrá especialistas para tu hogar en pocos pasos.
          </p>
        </div>

        <div className="hero-image">
          <div className="hero-image-background" />

          <img
            src={tecnico}
            alt="Profesional de ServiYa"
          />
        </div>

      </div>
    </section>
  );
}

export default Home;