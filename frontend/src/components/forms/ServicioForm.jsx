
import { useState } from "react";
import {
  useNavigate,
  useSearchParams
} from "react-router-dom";

import { Save, ArrowLeft } from "lucide-react";

import FormField from "./FormField";
import Button from "../ui/Button";

import useAuthStore from "../../store/authStore";
import useHogaresStore from "../../store/hogaresStore";
import usePrestadoresStore from "../../store/prestadoresStore";
import useClientesStore from "../../store/clientesStore";
import useOficiosStore from "../../store/crearOficiosStore";

function ServicioForm({
  servicioInicial,
  onGuardar,
  textoBoton
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const usuario = useAuthStore((state) => state.usuario);

  const rol = usuario?.rol;
  const esCliente = rol === "cliente";
  const clienteId = usuario?.perfilId;

  const rutaBase = `/${rol}/servicios`;

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

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [formulario, setFormulario] = useState({
    hogarId: servicioInicial?.hogarId ?? "",
    prestadorId:
      servicioInicial?.prestadorId ??
      searchParams.get("prestadorId") ??
      "",
    descripcion: servicioInicial?.descripcion ?? "",
    fecha: servicioInicial?.fecha?.slice(0, 10) ?? "",
    precio: servicioInicial?.precio ?? (esCliente ? 0 : ""),
    estado: servicioInicial?.estado ?? "Pendiente"
  });

  const hogaresDisponibles = esCliente
    ? hogares.filter(
        (hogar) =>
          String(hogar.clienteId) === String(clienteId)
      )
    : rol === "admin"
      ? hogares
      : [];

  const opcionesHogares = hogaresDisponibles.map((hogar) => {
    const cliente = clientes.find(
      (c) => String(c.id) === String(hogar.clienteId)
    );

    return {
      valor: hogar.id,
      texto: esCliente
        ? hogar.direccion
        : `${hogar.direccion} - ${
            cliente
              ? `${cliente.nombre} ${cliente.apellido}`
              : "Sin propietario"
          }`
    };
  });

  const opcionesPrestadores = prestadores
    .filter(
      (prestador) =>
        prestador.estado === "Activo" ||
        (
          !esCliente &&
          String(prestador.id) ===
            String(servicioInicial?.prestadorId)
        )
    )
    .map((prestador) => {
      const oficio = oficios.find(
        (o) => String(o.id) === String(prestador.oficioId)
      );

      return {
        valor: prestador.id,
        texto: `${prestador.nombre} ${prestador.apellido} - ${
          oficio?.nombre ?? "Sin oficio"
        }`
      };
    });

  const opcionesEstados = [
    { valor: "Pendiente", texto: "Pendiente" },
    { valor: "En proceso", texto: "En proceso" },
    { valor: "Finalizado", texto: "Finalizado" },
    { valor: "Cancelado", texto: "Cancelado" }
  ];

  function manejarCambio(e) {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function manejarSubmit(e) {
    e.preventDefault();

    if (guardando) return;

    setError("");

    if (rol !== "admin" && rol !== "cliente") {
      setError("No tenés permiso para realizar esta operación.");
      return;
    }

    const hogar = hogaresDisponibles.find(
      (hogar) =>
        String(hogar.id) === String(formulario.hogarId)
    );

    const prestador = opcionesPrestadores.find(
      (prestador) =>
        String(prestador.valor) ===
        String(formulario.prestadorId)
    );

    if (!hogar || !prestador) {
      setError("Seleccioná un hogar y un prestador válidos.");
      return;
    }

    const precio = esCliente
      ? 0
      : Number(formulario.precio);

    if (
      (!esCliente && String(formulario.precio).trim() === "") ||
      !Number.isFinite(precio) ||
      precio < 0 ||
      precio > 9999999999.99
    ) {
      setError("Ingresá un precio válido.");
      return;
    }

    if (!formulario.descripcion.trim()) {
      setError("Ingresá una descripción del servicio.");
      return;
    }

    if (!formulario.fecha) {
      setError("Seleccioná una fecha.");
      return;
    }

    const estado = esCliente
      ? "Pendiente"
      : formulario.estado;

    if (!opcionesEstados.some((e) => e.valor === estado)) {
      setError("Seleccioná un estado válido.");
      return;
    }

    setGuardando(true);

    try {

      await onGuardar({
        hogarId: hogar.id,
        prestadorId: prestador.valor,
        descripcion: formulario.descripcion.trim(),
        fecha: formulario.fecha,
        precio,
        estado
      });

    } catch (error) {

      setError(
        error.message || "No se pudo guardar el servicio."
      );

    } finally {

      setGuardando(false);

    }
  }

  return (
    <form
      className="crud-form"
      onSubmit={manejarSubmit}
    >

      {esCliente && hogaresDisponibles.length === 0 && (
        <p className="panel-vacio">
          Primero debés registrar un hogar para solicitar un servicio.
        </p>
      )}

      <div className="crud-form-grid">

        <FormField
          label="Hogar"
          nombre="hogarId"
          tipo="select"
          opciones={opcionesHogares}
          valor={formulario.hogarId}
          onChange={manejarCambio}
          requerido
        />

        <FormField
          label="Prestador"
          nombre="prestadorId"
          tipo="select"
          opciones={opcionesPrestadores}
          valor={formulario.prestadorId}
          onChange={manejarCambio}
          requerido
        />

        <FormField
          label="Fecha del servicio"
          nombre="fecha"
          tipo="date"
          valor={formulario.fecha}
          onChange={manejarCambio}
          requerido
        />

        {!esCliente && (
          <>
            <FormField
              label="Precio ($)"
              nombre="precio"
              tipo="number"
              valor={formulario.precio}
              onChange={manejarCambio}
              requerido
            />

            <FormField
              label="Estado"
              nombre="estado"
              tipo="select"
              opciones={opcionesEstados}
              valor={formulario.estado}
              onChange={manejarCambio}
              requerido
            />
          </>
        )}

        <div className="crud-form-full">

          <FormField
            label="Descripción del servicio"
            nombre="descripcion"
            tipo="textarea"
            valor={formulario.descripcion}
            onChange={manejarCambio}
            placeholder="Describí el trabajo solicitado..."
            requerido
          />

        </div>

      </div>

      {esCliente && (
        <p className="panel-vacio">
          El profesional evaluará tu solicitud y enviará
          un presupuesto para que puedas aceptarlo o rechazarlo.
        </p>
      )}

      {error && (
        <p className="login-message" role="alert">
          {error}
        </p>
      )}

      <div className="crud-form-actions">

        <Button
          tipo="button"
          variante="secondary"
          icono={ArrowLeft}
          onClick={() => navigate(rutaBase)}
        >
          Cancelar
        </Button>

        <Button
          tipo="submit"
          icono={Save}
          disabled={
            guardando ||
            hogaresDisponibles.length === 0 ||
            opcionesPrestadores.length === 0
          }
        >
          {guardando ? "Guardando..." : textoBoton}
        </Button>

      </div>

    </form>
  );
}

export default ServicioForm;
