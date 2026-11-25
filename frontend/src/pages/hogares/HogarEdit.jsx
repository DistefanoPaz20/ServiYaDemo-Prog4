
import { useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import { Save, ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";

import useAuthStore from "../../store/authStore";
import useHogaresStore from "../../store/hogaresStore";
import useClientesStore from "../../store/clientesStore";
import useServiciosStore from "../../store/serviciosStore";

function HogarEdit() {

  const { id } = useParams();

  const navigate = useNavigate();

  const usuario = useAuthStore(
    (state) => state.usuario
  );

  const rol = usuario?.rol;
  const esCliente = rol === "cliente";
  const clienteId = usuario?.perfilId;

  const rutaBase = `/${rol}/hogares`;

  const hogar = useHogaresStore((state) =>
    state.hogares.find(
      (hogar) => String(hogar.id) === String(id)
    )
  );

  const autorizado =
    hogar &&
    (
      rol === "admin" ||
      (
        esCliente &&
        String(hogar.clienteId) === String(clienteId)
      )
    );

  if (!autorizado) {
    return (
      <section className="crud-page">

        <PageHeader
          titulo="Hogar no disponible"
          descripcion="La propiedad no existe o no tenés acceso a ella."
        />

        <Button
          tipo="button"
          variante="secondary"
          icono={ArrowLeft}
          onClick={() => navigate(rutaBase)}
        >
          Volver al listado
        </Button>

      </section>
    );
  }

  return (
    <FormularioHogar
      key={`${rol}-${clienteId}-${hogar.id}`}
      hogar={hogar}
      esCliente={esCliente}
      clienteId={clienteId}
      rutaBase={rutaBase}
    />
  );
}

function FormularioHogar({
  hogar,
  esCliente,
  clienteId,
  rutaBase
}) {

  const navigate = useNavigate();

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const editarHogar = useHogaresStore(
    (state) => state.editarHogar
  );

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [formulario, setFormulario] = useState({
    clienteId: hogar.clienteId,
    direccion: hogar.direccion ?? "",
    localidad: hogar.localidad ?? "",
    tipo: hogar.tipo ?? "",
    descripcion: hogar.descripcion ?? ""
  });

  const opcionesClientes = clientes.map((cliente) => ({
    valor: cliente.id,
    texto: `${cliente.nombre} ${cliente.apellido}`
  }));

  const opcionesTipos = [
    { valor: "Casa", texto: "Casa" },
    { valor: "Departamento", texto: "Departamento" },
    { valor: "Duplex", texto: "Dúplex" },
    { valor: "Otro", texto: "Otro" }
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

    if (
      esCliente &&
      String(hogar.clienteId) !== String(clienteId)
    ) {
      setError("No tenés acceso a este hogar.");
      return;
    }

    const propietarioId = Number(
      esCliente ? clienteId : formulario.clienteId
    );

    if (
      !Number.isSafeInteger(propietarioId) ||
      propietarioId <= 0
    ) {
      setError("Seleccioná un cliente válido.");
      return;
    }

    if (
      !esCliente &&
      !clientes.some(
        (cliente) =>
          String(cliente.id) === String(propietarioId)
      )
    ) {
      setError("Seleccioná un cliente válido.");
      return;
    }

    if (
      !formulario.direccion.trim() ||
      !formulario.localidad.trim() ||
      !opcionesTipos.some(
        (tipo) => tipo.valor === formulario.tipo
      )
    ) {
      setError(
        "Completá correctamente todos los campos obligatorios."
      );
      return;
    }

    const cambioPropietario =
      String(propietarioId) !== String(hogar.clienteId);

    const tieneServicios = servicios.some(
      (servicio) =>
        String(servicio.hogarId) === String(hogar.id)
    );

    if (cambioPropietario && tieneServicios) {
      setError(
        "No podés cambiar el propietario de un hogar con servicios asociados."
      );
      return;
    }

    setGuardando(true);

    try {

      await editarHogar(hogar.id, {
        clienteId: propietarioId,
        direccion: formulario.direccion.trim(),
        localidad: formulario.localidad.trim(),
        tipo: formulario.tipo,
        descripcion: formulario.descripcion.trim()
      });

      navigate(rutaBase);

    } catch (error) {

      setError(
        error.message || "No se pudo actualizar el hogar."
      );

    } finally {

      setGuardando(false);

    }
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Editar hogar"
        descripcion="Modificá los datos de la propiedad seleccionada."
      />

      <form
        className="crud-form"
        onSubmit={manejarSubmit}
      >

        <div className="crud-form-grid">

          {!esCliente && (
            <FormField
              label="Propietario"
              nombre="clienteId"
              tipo="select"
              valor={formulario.clienteId}
              opciones={opcionesClientes}
              onChange={manejarCambio}
              requerido
            />
          )}

          <FormField
            label="Tipo de hogar"
            nombre="tipo"
            tipo="select"
            valor={formulario.tipo}
            opciones={opcionesTipos}
            onChange={manejarCambio}
            requerido
          />

          <FormField
            label="Dirección"
            nombre="direccion"
            valor={formulario.direccion}
            onChange={manejarCambio}
            requerido
          />

          <FormField
            label="Localidad"
            nombre="localidad"
            valor={formulario.localidad}
            onChange={manejarCambio}
            requerido
          />

          <div className="crud-form-full">

            <FormField
              label="Descripción"
              nombre="descripcion"
              tipo="textarea"
              valor={formulario.descripcion}
              onChange={manejarCambio}
            />

          </div>

        </div>

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
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Guardar cambios"}
          </Button>

        </div>

      </form>

    </section>
  );
}

export default HogarEdit;
