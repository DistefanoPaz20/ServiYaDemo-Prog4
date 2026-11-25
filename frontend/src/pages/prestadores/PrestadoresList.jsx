import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/ui/DataTable";

import usePrestadoresStore from "../../store/prestadoresStore";
import useOficiosStore from "../../store/crearOficiosStore";
import useServiciosStore from "../../store/serviciosStore";
import useOperacion from "../../hooks/useOperacion";

function PrestadoresList() {
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();

  const prestadores = usePrestadoresStore(
    (state) => state.prestadores
  );

  const oficios = useOficiosStore(
    (state) => state.oficios
  );

  const eliminarPrestador = usePrestadoresStore(
    (state) => state.eliminarPrestador
  );

  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const { ejecutar, procesando, error } = useOperacion();

  function obtenerOficio(oficioId) {
    const oficio = oficios.find(
      (o) => String(o.id) === String(oficioId)
    );

    return oficio?.nombre ?? "Oficio no encontrado";
  }

  const columnas = [
    { campo: "id", titulo: "ID" },
    { campo: "nombre", titulo: "Nombre" },
    { campo: "apellido", titulo: "Apellido" },
    { campo: "oficio", titulo: "Oficio" },
    { campo: "telefono", titulo: "Teléfono" },
    { campo: "experienciaTexto", titulo: "Experiencia" },
    { campo: "estado", titulo: "Estado" }
  ];

  const prestadoresFiltrados = prestadores
    .map((prestador) => ({
      ...prestador,
      oficio: obtenerOficio(prestador.oficioId),
      experienciaTexto: `${prestador.experiencia} años`
    }))
    .filter((prestador) => {
      const texto = `
        ${prestador.nombre}
        ${prestador.apellido}
        ${prestador.oficio}
        ${prestador.email}
        ${prestador.telefono}
        ${prestador.estado}
      `.toLowerCase();

      return texto.includes(
        busqueda.trim().toLowerCase()
      );
    });

  function manejarEditar(id) {
    if (!procesando) {
      navigate(`/admin/prestadores/editar/${id}`);
    }
  }

  async function manejarEliminar(id) {
    if (procesando) return;

    const prestador = prestadores.find(
      (p) => String(p.id) === String(id)
    );

    if (prestador?.usuarioId) {
      alert("Este prestador tiene una cuenta de usuario asociada.");
      return;
    }

    const tieneServicios = servicios.some(
      (servicio) =>
        String(servicio.prestadorId) === String(id)
    );

    if (tieneServicios) {
      alert(
        "No podés eliminar este prestador porque tiene servicios asociados."
      );
      return;
    }

    const confirmado = window.confirm(
      "¿Estás seguro de que querés eliminar este prestador?"
    );

    if (confirmado) {
      await ejecutar(() => eliminarPrestador(id));
    }
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Prestadores"
        descripcion="Administrá los profesionales registrados en ServiYa."
        textoBoton="Nuevo prestador"
        rutaBoton="/admin/prestadores/nuevo"
      />

      <div className="crud-toolbar">

        <div className="crud-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Buscar prestador..."
            aria-label="Buscar prestador"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <span className="crud-counter">
          {prestadoresFiltrados.length} prestadores encontrados
        </span>

      </div>

      {error && (
        <p className="crud-error" role="alert">
          {error}
        </p>
      )}

      {procesando && <p>Procesando operación...</p>}

      <DataTable
        columnas={columnas}
        datos={prestadoresFiltrados}
        onEditar={manejarEditar}
        onEliminar={manejarEliminar}
      />

    </section>
  );
}

export default PrestadoresList;