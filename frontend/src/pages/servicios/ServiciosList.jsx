
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/ui/DataTable";

import useServiciosStore from "../../store/serviciosStore";
import useHogaresStore from "../../store/hogaresStore";
import usePrestadoresStore from "../../store/prestadoresStore";
import useClientesStore from "../../store/clientesStore";
import useOficiosStore from "../../store/crearOficiosStore";

const columnas = [
  { campo: "cliente", titulo: "Cliente" },
  { campo: "hogar", titulo: "Dirección" },
  { campo: "prestador", titulo: "Prestador" },
  { campo: "oficio", titulo: "Oficio" },
  { campo: "fecha", titulo: "Fecha" },
  { campo: "precioTexto", titulo: "Precio" },
  { campo: "estado", titulo: "Estado" }
];

function ServiciosList() {
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();

  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const eliminarServicio = useServiciosStore(
    (state) => state.eliminarServicio
  );

  const hogares = useHogaresStore(
    (state) => state.hogares
  );

  const prestadores = usePrestadoresStore(
    (state) => state.prestadores
  );

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const oficios = useOficiosStore(
    (state) => state.oficios
  );

  const serviciosFiltrados = servicios
    .map((servicio) => {
      const hogar = hogares.find(
        (h) => String(h.id) === String(servicio.hogarId)
      );

      const prestador = prestadores.find(
        (p) => String(p.id) === String(servicio.prestadorId)
      );

      const cliente = clientes.find(
        (c) => String(c.id) === String(hogar?.clienteId)
      );

      const oficio = oficios.find(
        (o) => String(o.id) === String(prestador?.oficioId)
      );

      return {
        ...servicio,

        hogar: hogar?.direccion ?? "No encontrado",

        cliente: cliente
          ? `${cliente.nombre} ${cliente.apellido}`
          : "No encontrado",

        prestador: prestador
          ? `${prestador.nombre} ${prestador.apellido}`
          : "No encontrado",

        oficio: oficio?.nombre ?? "No encontrado",

        precioTexto: Number(servicio.precio).toLocaleString(
          "es-AR",
          {
            style: "currency",
            currency: "ARS"
          }
        )
      };
    })
    .filter((servicio) => {
      const texto = `
        ${servicio.cliente}
        ${servicio.hogar}
        ${servicio.prestador}
        ${servicio.oficio}
        ${servicio.descripcion}
        ${servicio.fecha}
        ${servicio.estado}
      `.toLowerCase();

      return texto.includes(
        busqueda.trim().toLowerCase()
      );
    });

  function manejarEditar(id) {
    navigate(`/admin/servicios/editar/${id}`);
  }

  function manejarEliminar(id) {
    const confirmado = window.confirm(
      "¿Estás seguro de que querés eliminar este servicio?"
    );

    if (confirmado) {
      eliminarServicio(id);
    }
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Servicios"
        descripcion="Administrá los trabajos solicitados en ServiYa."
        textoBoton="Nuevo servicio"
        rutaBoton="/admin/servicios/nuevo"
      />

      <div className="crud-toolbar">

        <div className="crud-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Buscar servicio..."
            aria-label="Buscar servicio"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <span className="crud-counter">
          {serviciosFiltrados.length} servicios encontrados
        </span>

      </div>

      <DataTable
        columnas={columnas}
        datos={serviciosFiltrados}
        onEditar={manejarEditar}
        onEliminar={manejarEliminar}
      />

    </section>
  );
}

export default ServiciosList;
