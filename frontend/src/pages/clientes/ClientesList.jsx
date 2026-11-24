
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/ui/DataTable";
import useClientesStore from "../../store/clientesStore";

const columnas = [
  { campo: "id", titulo: "ID" },
  { campo: "nombre", titulo: "Nombre" },
  { campo: "apellido", titulo: "Apellido" },
  { campo: "email", titulo: "Correo electrónico" },
  { campo: "telefono", titulo: "Teléfono" }
];

function ClientesList() {
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const eliminarCliente = useClientesStore(
    (state) => state.eliminarCliente
  );

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = `
      ${cliente.nombre}
      ${cliente.apellido}
      ${cliente.email}
      ${cliente.telefono}
    `.toLowerCase();

    return texto.includes(busqueda.trim().toLowerCase());
  });

  function manejarEditar(id) {
    navigate(`/admin/clientes/editar/${id}`);
  }

  function manejarEliminar(id) {
    const confirmado = window.confirm(
      "¿Estás seguro de que querés eliminar este cliente?"
    );

    if (confirmado) {
      eliminarCliente(id);
    }
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Clientes"
        descripcion="Administrá los clientes registrados en ServiYa."
        textoBoton="Nuevo cliente"
        rutaBoton="/admin/clientes/nuevo"
      />

      <div className="crud-toolbar">

        <div className="crud-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Buscar cliente..."
            aria-label="Buscar cliente"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <span className="crud-counter">
          {clientesFiltrados.length} clientes encontrados
        </span>

      </div>

      <DataTable
        columnas={columnas}
        datos={clientesFiltrados}
        onEditar={manejarEditar}
        onEliminar={manejarEliminar}
      />

    </section>
  );
}

export default ClientesList;
