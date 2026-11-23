
import { Link } from "react-router-dom";
import {
  ClipboardList,
  UserRoundCheck,
  CircleCheck,
  ArrowRight
} from "lucide-react";

const pasos = [
  {
    numero: 1,
    titulo: "Solicitá un servicio",
    descripcion:
      "Elegí el oficio que necesitás y completá los datos de tu solicitud.",
    icono: ClipboardList
  },
  {
    numero: 2,
    titulo: "Te asignamos un profesional",
    descripcion:
      "Un prestador disponible podrá atender tu solicitud.",
    icono: UserRoundCheck
  },
  {
    numero: 3,
    titulo: "Seguí el trabajo y confirmá",
    descripcion:
      "Consultá el estado del servicio hasta su finalización.",
    icono: CircleCheck
  }
];

function ComoFunciona() {
  return (
    <section className="como-funciona-page">
      <div className="container">
        <div className="como-funciona-header">
          <h1>¿Cómo funciona ServiYa?</h1>
          <p>
            Encontrar ayuda para tu hogar es muy sencillo.
          </p>
        </div>

        <div className="pasos-container">
          {pasos.map((paso, index) => {
            const Icono = paso.icono;

            return (
              <div className="paso-wrapper" key={paso.numero}>
                <article className="paso-card">
                  <span className="paso-numero">
                    {paso.numero}
                  </span>

                  <div className="paso-icono">
                    <Icono size={36} />
                  </div>

                  <h2>{paso.titulo}</h2>
                  <p>{paso.descripcion}</p>
                </article>

                {index < pasos.length - 1 && (
                  <ArrowRight
                    className="paso-flecha"
                    size={26}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="como-funciona-accion">
          <h2>¿Necesitás ayuda en tu hogar?</h2>
          <p>
            Explorá nuestros oficios y encontrá el servicio
            que estás buscando.
          </p>

          <Link to="/servicios" className="btn-primary">
            Explorar servicios
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ComoFunciona;
