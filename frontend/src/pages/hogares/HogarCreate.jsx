
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";

import useAuthStore from "../../store/authStore";
import useHogaresStore from "../../store/hogaresStore";
import useClientesStore from "../../store/clientesStore";

function HogarCreate() {

  const navigate = useNavigate();

  const usuario = useAuthStore(
    (state) => state.usuario
  );

  const rol = usuario?.rol;
  const esCliente = rol === "cliente";
  const clienteId = usuario?.perfilId;

  const rutaBase = `/${rol}/hogares`;

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const agregarHogar = useHogaresStore(
    (state) => state.agregarHogar
  );

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [formulario, setFormulario] = useState({
    clienteId: esCliente ? clienteId : "",
    direccion: "",
    localidad: "",
    tipo: "",
    descripcion: ""
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

    if (rol !== "cliente" && rol !== "admin") {
      setError("No tenés permiso para registrar hogares.");
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

    setGuardando(true);

    try {

      await agregarHogar({
        clienteId: propietarioId,
        direccion: formulario.direccion.trim(),
        localidad: formulario.localidad.trim(),
        tipo: formulario.tipo,
        descripcion: formulario.descripcion.trim()
      });

      navigate(rutaBase);

    } catch (error) {

      setError(
        error.message || "No se pudo registrar el hogar."
      );

    } finally {

      setGuardando(false);

    }
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo={esCliente ? "Registrar hogar" : "Nuevo hogar"}
        descripcion={
          esCliente
            ? "Registrá una nueva propiedad en tu cuenta."
            : "Registrá una propiedad asociada a un cliente."
        }
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
            placeholder="Ingresá la dirección"
            requerido
          />

          <FormField
            label="Localidad"
            nombre="localidad"
            valor={formulario.localidad}
            onChange={manejarCambio}
            placeholder="Ej: Yerba Buena"
            requerido
          />

          <div className="crud-form-full">

            <FormField
              label="Descripción"
              nombre="descripcion"
              tipo="textarea"
              valor={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Información adicional de la propiedad..."
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
              : "Guardar hogar"}
          </Button>

        </div>

      </form>

    </section>
  );
}

export default HogarCreate;
