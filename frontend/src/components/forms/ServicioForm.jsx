import { useState } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams
} from "react-router-dom";

import { Save, ArrowLeft } from "lucide-react";

import FormField from "./FormField";
import Button from "../ui/Button";

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
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const rol = location.pathname.split("/")[1];
  const esCliente = rol === "cliente";
  const clienteId = 1;

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

  const [formulario, setFormulario] = useState({
    hogarId: servicioInicial?.hogarId ?? "",
    prestadorId:
      servicioInicial?.prestadorId ??
      searchParams.get("prestadorId") ??
      "",
    descripcion: servicioInicial?.descripcion ?? "",
    fecha: servicioInicial?.fecha ?? "",
    precio: servicioInicial?.precio ?? (esCliente ? 0 : ""),
    estado: servicioInicial?.estado ?? "Pendiente"
  });

  const hogaresDisponibles = esCliente
    ? hogares.filter(
        (hogar) =>
          String(hogar.clienteId) === String(clienteId)
      )
    : hogares;

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

  function manejarSubmit(e) {
    e.preventDefault();

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
      alert("Seleccioná un hogar y un prestador válidos.");
      return;
    }

    const precio = esCliente
      ? 0
      : Number(formulario.precio);

    if (
      (!esCliente && String(formulario.precio).trim() === "") ||
      !Number.isFinite(precio) ||
      precio < 0
    ) {
      alert("Ingresá un precio válido.");
      return;
    }

    if (!formulario.descripcion.trim()) {
      alert("Ingresá una descripción del servicio.");
      return;
    }

    if (!formulario.fecha) {
      alert("Seleccioná una fecha.");
      return;
    }

    const estado = esCliente
      ? "Pendiente"
      : formulario.estado;

    if (!opcionesEstados.some((e) => e.valor === estado)) {
      alert("Seleccioná un estado válido.");
      return;
    }

    onGuardar({
      ...formulario,
      hogarId: hogar.id,
      prestadorId: prestador.valor,
      descripcion: formulario.descripcion.trim(),
      precio,
      estado
    });
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
        >
          {textoBoton}
        </Button>

      </div>

    </form>
  );
}

export default ServicioForm;