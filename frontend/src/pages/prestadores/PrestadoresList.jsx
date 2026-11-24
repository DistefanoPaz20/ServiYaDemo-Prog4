
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/ui/DataTable";

import usePrestadoresStore from "../../store/prestadoresStore";
import useOficiosStore from "../../store/crearOficiosStore";

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

  function obtenerOficio(oficioId) {
    const oficio = oficios.find(
      (oficio) => String(oficio.id) === String(oficioId)
    );

    return oficio
      ? oficio.nombre
      : "Oficio no encontrado";
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
    navigate(`/admin/prestadores/editar/${id}`);
  }

  function manejarEliminar(id) {
    const confirmado = window.confirm(
      "¿Estás seguro de que querés eliminar este prestador?"
    );

    if (confirmado) {
      eliminarPrestador(id);
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
