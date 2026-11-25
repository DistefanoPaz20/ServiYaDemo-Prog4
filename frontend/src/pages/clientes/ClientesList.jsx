import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/ui/DataTable";

import useClientesStore from "../../store/clientesStore";
import useHogaresStore from "../../store/hogaresStore";
import useOperacion from "../../hooks/useOperacion";

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

  const hogares = useHogaresStore(
    (state) => state.hogares
  );

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const eliminarCliente = useClientesStore(
    (state) => state.eliminarCliente
  );

  const { ejecutar, procesando, error } = useOperacion();

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
    if (!procesando) {
      navigate(`/admin/clientes/editar/${id}`);
    }
  }

  async function manejarEliminar(id) {
    if (procesando) return;

    const cliente = clientes.find(
      (c) => String(c.id) === String(id)
    );

    if (cliente?.usuarioId) {
      alert("Este cliente tiene una cuenta de usuario asociada.");
      return;
    }

    const tieneHogares = hogares.some(
      (hogar) => String(hogar.clienteId) === String(id)
    );

    if (tieneHogares) {
      alert(
        "No podés eliminar este cliente porque tiene hogares asociados."
      );
      return;
    }

    const confirmado = window.confirm(
      "¿Estás seguro de que querés eliminar este cliente?"
    );

    if (confirmado) {
      await ejecutar(() => eliminarCliente(id));
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

      {error && (
        <p className="crud-error" role="alert">
          {error}
        </p>
      )}

      {procesando && <p>Procesando operación...</p>}

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