
import { useState } from "react";
import {
  useNavigate,
  useLocation,
  Link
} from "react-router-dom";

import {
  Search,
  Wrench,
  FileText,
  CircleCheck,
  XCircle
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/ui/DataTable";

import useAuthStore from "../../store/authStore";
import useServiciosStore from "../../store/serviciosStore";
import useHogaresStore from "../../store/hogaresStore";
import usePrestadoresStore from "../../store/prestadoresStore";
import useClientesStore from "../../store/clientesStore";
import useOficiosStore from "../../store/crearOficiosStore";
import usePresupuestosStore from "../../store/presupuestosStore";

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
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const usuario = useAuthStore(
    (state) => state.usuario
  );

  const rol = usuario?.rol;
  const perfilId = usuario?.perfilId;

  const esAdmin = rol === "admin";
  const esCliente = rol === "cliente";
  const esPrestador = rol === "prestador";

  const esSolicitudes =
    location.pathname === "/prestador/solicitudes";

  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const cambiarEstadoServicio = useServiciosStore(
    (state) => state.cambiarEstadoServicio
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

  const presupuestos = usePresupuestosStore(
    (state) => state.presupuestos
  );

  const cargarPresupuestos = usePresupuestosStore(
    (state) => state.cargarPresupuestos
  );

  const serviciosDisponibles = servicios.filter((servicio) => {

    if (esAdmin) {
      return true;
    }

    if (perfilId == null) return false;

    if (esCliente) {
      return hogares.some(
        (hogar) =>
          String(hogar.id) === String(servicio.hogarId) &&
          String(hogar.clienteId) === String(perfilId)
      );
    }

    if (esPrestador) {

      const pertenece =
        String(servicio.prestadorId) === String(perfilId);

      return pertenece && (
        esSolicitudes
          ? servicio.estado === "Pendiente"
          : servicio.estado !== "Pendiente"
      );
    }

    return false;
  });

  const serviciosFiltrados = serviciosDisponibles
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

        fecha: String(servicio.fecha ?? "").slice(0, 10),

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

    if (!esAdmin) return;

    navigate(`/admin/servicios/editar/${id}`);
  }

  async function manejarEliminar(id) {

    if (!esAdmin || procesando) return;

    setError("");

    const tienePresupuestos = presupuestos.some(
      (presupuesto) =>
        String(presupuesto.servicioId) === String(id)
    );

    if (tienePresupuestos) {
      setError(
        "No podés eliminar un servicio con presupuestos asociados."
      );
      return;
    }

    if (!window.confirm(
      "¿Estás seguro de que querés eliminar este servicio?"
    )) {
      return;
    }

    setProcesando(true);

    try {

      await eliminarServicio(id);

    } catch (error) {

      setError(
        error.message || "No se pudo eliminar el servicio."
      );

    } finally {

      setProcesando(false);

    }
  }

  async function finalizarServicio(id) {

    if (procesando) return;

    const servicio = serviciosDisponibles.find(
      (s) => String(s.id) === String(id)
    );

    if (
      !esPrestador ||
      !servicio ||
      servicio.estado !== "En proceso"
    ) {
      return;
    }

    if (!window.confirm(
      "¿Confirmás que el trabajo fue finalizado?"
    )) {
      return;
    }

    setError("");
    setProcesando(true);

    try {

      await cambiarEstadoServicio(id, "Finalizado");

    } catch (error) {

      setError(
        error.message || "No se pudo finalizar el servicio."
      );

    } finally {

      setProcesando(false);

    }
  }

  async function cancelarServicio(id) {

    if (procesando) return;

    const servicio = serviciosDisponibles.find(
      (s) => String(s.id) === String(id)
    );

    if (
      !esCliente ||
      !servicio ||
      servicio.estado !== "Pendiente"
    ) {
      return;
    }

    if (!window.confirm("¿Querés cancelar esta solicitud?")) {
      return;
    }

    setError("");
    setProcesando(true);

    try {

      await cambiarEstadoServicio(id, "Cancelado");

      await cargarPresupuestos();

    } catch (error) {

      setError(
        error.message || "No se pudo completar la operación."
      );

    } finally {

      setProcesando(false);

    }
  }

  const titulo = esAdmin
    ? "Servicios"
    : esCliente
      ? "Mis servicios"
      : esSolicitudes
        ? "Solicitudes recibidas"
        : "Mis trabajos";

  const descripcion = esAdmin
    ? "Administrá los trabajos solicitados en ServiYa."
    : esCliente
      ? "Consultá y gestioná tus solicitudes de servicio."
      : esSolicitudes
        ? "Revisá las nuevas solicitudes de tus clientes."
        : "Gestioná los trabajos que tenés asignados.";

  return (
    <section className="crud-page">

      <PageHeader
        titulo={titulo}
        descripcion={descripcion}
        textoBoton={
          esAdmin
            ? "Nuevo servicio"
            : esCliente
              ? "Solicitar servicio"
              : undefined
        }
        rutaBoton={
          esAdmin
            ? "/admin/servicios/nuevo"
            : esCliente
              ? "/cliente/servicios/nuevo"
              : undefined
        }
      />

      <div className="crud-toolbar">

        <div className="crud-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Buscar servicio..."
            aria-label="Buscar servicio"
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
          />
        </div>

        <span className="crud-counter">
          {serviciosFiltrados.length} servicios encontrados
        </span>

      </div>

      {error && (
        <p className="login-message" role="alert">
          {error}
        </p>
      )}

      {procesando && (
        <p className="panel-vacio">
          Procesando operación...
        </p>
      )}

      {esAdmin ? (

        <DataTable
          columnas={columnas}
          datos={serviciosFiltrados}
          onEditar={manejarEditar}
          onEliminar={manejarEliminar}
        />

      ) : (

        <div className="servicios-cards">

          {serviciosFiltrados.length === 0 && (
            <p className="panel-vacio">
              No hay servicios para mostrar.
            </p>
          )}

          {serviciosFiltrados.map((servicio) => {

            const tienePresupuesto = presupuestos.some(
              (p) =>
                String(p.servicioId) === String(servicio.id) &&
                p.estado !== "Rechazado"
            );

            return (
              <article
                className="servicio-card"
                key={servicio.id}
              >

                <div className="servicio-card-header">

                  <div className="panel-stat-icon">
                    <Wrench size={24} />
                  </div>

                  <span className="panel-estado">
                    {servicio.estado}
                  </span>

                </div>

                <h3>{servicio.descripcion}</h3>

                <p>{servicio.oficio}</p>

                <div className="servicio-card-datos">

                  <p>
                    <strong>Dirección:</strong> {servicio.hogar}
                  </p>

                  <p>
                    <strong>
                      {esCliente ? "Profesional:" : "Cliente:"}
                    </strong>{" "}
                    {esCliente
                      ? servicio.prestador
                      : servicio.cliente}
                  </p>

                  <p>
                    <strong>Fecha:</strong> {servicio.fecha}
                  </p>

                  <p>
                    <strong>Precio:</strong>{" "}
                    {servicio.estado === "Pendiente" &&
                    Number(servicio.precio) === 0
                      ? "A presupuestar"
                      : servicio.precioTexto}
                  </p>

                </div>

                <div className="servicio-card-acciones">

                  {esPrestador &&
                    servicio.estado === "Pendiente" &&
                    !tienePresupuesto && (

                    <Link
                      className="perfil-boton"
                      to={`/prestador/presupuestos/nuevo?servicioId=${servicio.id}`}
                    >
                      <FileText size={18} />
                      Crear presupuesto
                    </Link>

                  )}

                  {esPrestador &&
                    servicio.estado === "Pendiente" &&
                    tienePresupuesto && (

                    <Link
                      className="perfil-boton"
                      to="/prestador/presupuestos"
                    >
                      <FileText size={18} />
                      Ver presupuestos
                    </Link>

                  )}

                  {esPrestador &&
                    servicio.estado === "En proceso" && (

                    <button
                      type="button"
                      className="servicio-finalizar"
                      disabled={procesando}
                      onClick={() => finalizarServicio(servicio.id)}
                    >
                      <CircleCheck size={18} />
                      Finalizar trabajo
                    </button>

                  )}

                  {esCliente && tienePresupuesto && (

                    <Link
                      className="perfil-boton"
                      to="/cliente/presupuestos"
                    >
                      <FileText size={18} />
                      Ver presupuestos
                    </Link>

                  )}

                  {esCliente &&
                    servicio.estado === "Pendiente" && (

                    <button
                      type="button"
                      className="servicio-cancelar"
                      disabled={procesando}
                      onClick={() => cancelarServicio(servicio.id)}
                    >
                      <XCircle size={18} />
                      Cancelar solicitud
                    </button>

                  )}

                </div>

              </article>
            );
          })}

        </div>

      )}

    </section>
  );
}

export default ServiciosList;
