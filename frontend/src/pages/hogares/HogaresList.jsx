import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/ui/DataTable";

import useHogaresStore from "../../store/hogaresStore";
import useClientesStore from "../../store/clientesStore";
import useServiciosStore from "../../store/serviciosStore";

function HogaresList() {
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const rol = location.pathname.split("/")[1];
  const esCliente = rol === "cliente";
  const clienteId = 1;

  const rutaBase = `/${rol}/hogares`;

  const hogares = useHogaresStore(
    (state) => state.hogares
  );

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const eliminarHogar = useHogaresStore(
    (state) => state.eliminarHogar
  );

  function obtenerPropietario(clienteId) {
    const cliente = clientes.find(
      (cliente) =>
        String(cliente.id) === String(clienteId)
    );

    return cliente
      ? `${cliente.nombre} ${cliente.apellido}`
      : "Cliente no encontrado";
  }

  const columnas = [
    {
      campo: "id",
      titulo: "ID"
    },
    {
      campo: "clienteId",
      titulo: "Propietario",
      render: (hogar) =>
        obtenerPropietario(hogar.clienteId)
    },
    {
      campo: "direccion",
      titulo: "Dirección"
    },
    {
      campo: "localidad",
      titulo: "Localidad"
    },
    {
      campo: "tipo",
      titulo: "Tipo de hogar"
    }
  ];

  const hogaresDisponibles = esCliente
    ? hogares.filter(
        (hogar) =>
          String(hogar.clienteId) === String(clienteId)
      )
    : hogares;

  const hogaresFiltrados = hogaresDisponibles.filter(
    (hogar) => {
      const texto = `
        ${obtenerPropietario(hogar.clienteId)}
        ${hogar.direccion}
        ${hogar.localidad}
        ${hogar.tipo}
      `.toLowerCase();

      return texto.includes(
        busqueda.trim().toLowerCase()
      );
    }
  );

  function manejarEditar(id) {
    navigate(`${rutaBase}/editar/${id}`);
  }

  function manejarEliminar(id) {

    const hogarAutorizado = hogaresDisponibles.some(
      (hogar) => String(hogar.id) === String(id)
    );

    if (!hogarAutorizado) {
      alert("No podés eliminar este hogar.");
      return;
    }

    const tieneServicios = servicios.some(
      (servicio) =>
        String(servicio.hogarId) === String(id)
    );

    if (tieneServicios) {
      alert(
        "No podés eliminar este hogar porque tiene servicios asociados."
      );
      return;
    }

    const confirmado = window.confirm(
      "¿Estás seguro de que querés eliminar este hogar?"
    );

    if (confirmado) {
      eliminarHogar(id);
    }
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo={esCliente ? "Mis hogares" : "Hogares"}
        descripcion={
          esCliente
            ? "Administrá tus propiedades registradas."
            : "Administrá las propiedades registradas en ServiYa."
        }
        textoBoton="Nuevo hogar"
        rutaBoton={`${rutaBase}/nuevo`}
      />

      <div className="crud-toolbar">

        <div className="crud-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Buscar hogar..."
            aria-label="Buscar hogar"
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
          />
        </div>

        <span className="crud-counter">
          {hogaresFiltrados.length} hogares encontrados
        </span>

      </div>

      <DataTable
        columnas={
          esCliente
            ? columnas.filter(
                (columna) => columna.campo !== "clienteId"
              )
            : columnas
        }
        datos={hogaresFiltrados}
        onEditar={manejarEditar}
        onEliminar={manejarEliminar}
      />

    </section>
  );
}

export default HogaresList;