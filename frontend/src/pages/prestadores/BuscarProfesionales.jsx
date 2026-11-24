import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  UserRound,
  BriefcaseBusiness,
  CircleCheck,
  ArrowRight
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";

import usePrestadoresStore from "../../store/prestadoresStore";
import useOficiosStore from "../../store/crearOficiosStore";

function BuscarProfesionales() {

  const [busqueda, setBusqueda] = useState("");
  const [oficioId, setOficioId] = useState("");

  const prestadores = usePrestadoresStore(
    (state) => state.prestadores
  );

  const oficios = useOficiosStore(
    (state) => state.oficios
  );

  const profesionales = prestadores
    .filter(
      (prestador) => prestador.estado === "Activo"
    )
    .map((prestador) => {

      const oficio = oficios.find(
        (o) => String(o.id) === String(prestador.oficioId)
      );

      return {
        ...prestador,
        nombreOficio: oficio?.nombre ?? "Sin oficio"
      };
    })
    .filter((prestador) => {

      const texto = `
        ${prestador.nombre}
        ${prestador.apellido}
        ${prestador.nombreOficio}
      `.toLowerCase();

      const coincideBusqueda = texto.includes(
        busqueda.trim().toLowerCase()
      );

      const coincideOficio =
        oficioId === "" ||
        String(prestador.oficioId) === String(oficioId);

      return coincideBusqueda && coincideOficio;
    });

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Buscar profesionales"
        descripcion="Encontrá al profesional adecuado para tu hogar."
      />

      <div className="crud-toolbar">

        <div className="crud-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Buscar por nombre u oficio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

        </div>

        <select
          className="profesionales-filtro"
          aria-label="Filtrar por oficio"
          value={oficioId}
          onChange={(e) => setOficioId(e.target.value)}
        >

          <option value="">
            Todos los oficios
          </option>

          {oficios.map((oficio) => (
            <option
              key={oficio.id}
              value={oficio.id}
            >
              {oficio.nombre}
            </option>
          ))}

        </select>

        <span className="crud-counter">
          {profesionales.length} profesionales encontrados
        </span>

      </div>

      <div className="profesionales-grid">

        {profesionales.length === 0 && (
          <p className="panel-vacio">
            No se encontraron profesionales disponibles.
          </p>
        )}

        {profesionales.map((prestador) => (

          <article
            className="profesional-card"
            key={prestador.id}
          >

            <div className="profesional-avatar">
              <UserRound size={36} />
            </div>

            <h3>
              {prestador.nombre} {prestador.apellido}
            </h3>

            <span className="profesional-oficio">
              {prestador.nombreOficio}
            </span>

            <div className="profesional-info">

              <p>
                <BriefcaseBusiness size={18} />
                {prestador.experiencia} años de experiencia
              </p>

              <p>
                <CircleCheck size={18} />
                Prestador activo
              </p>

            </div>

            <Link
              className="profesional-boton"
              to={`/cliente/servicios/nuevo?prestadorId=${prestador.id}`}
            >
              Solicitar servicio
              <ArrowRight size={18} />
            </Link>

          </article>

        ))}

      </div>

    </section>
  );
}

export default BuscarProfesionales;