
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/ui/DataTable";
import useOficiosStore from "../../store/crearOficiosStore";
import usePrestadoresStore from "../../store/prestadoresStore";

const columnas = [
  { campo: "id", titulo: "ID" },
  { campo: "nombre", titulo: "Oficio" },
  { campo: "descripcion", titulo: "Descripción" }
];

function OficiosList() {
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();

  const oficios = useOficiosStore(
    (state) => state.oficios
  );

  const eliminarOficio = useOficiosStore(
    (state) => state.eliminarOficio
  );

  const oficiosFiltrados = oficios.filter((oficio) => {
    const texto = `
      ${oficio.nombre}
      ${oficio.descripcion}
    `.toLowerCase();

    return texto.includes(
      busqueda.trim().toLowerCase()
    );
  });
  const prestadores=usePrestadoresStore(
    (state)=>state.prestadores
  )

  function manejarEditar(id) {
    navigate(`/admin/oficios/editar/${id}`);
  }
function manejarEliminar(id) {
  const tienePrestadores = prestadores.some(
    (prestador) =>
      String(prestador.oficioId) === String(id)
  );

  if (tienePrestadores) {
    alert(
      "No podés eliminar este oficio porque tiene prestadores asociados."
    );
    return;
  }

  const confirmado = window.confirm(
    "¿Estás seguro de que querés eliminar este oficio?"
  );

  if (confirmado) {
    eliminarOficio(id);
  }
}

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Oficios"
        descripcion="Administrá las especialidades disponibles en ServiYa."
        textoBoton="Nuevo oficio"
        rutaBoton="/admin/oficios/nuevo"
      />

      <div className="crud-toolbar">

        <div className="crud-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Buscar oficio..."
            aria-label="Buscar oficio"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <span className="crud-counter">
          {oficiosFiltrados.length} oficios encontrados
        </span>

      </div>

      <DataTable
        columnas={columnas}
        datos={oficiosFiltrados}
        onEditar={manejarEditar}
        onEliminar={manejarEliminar}
      />

    </section>
  );
}

export default OficiosList;
