import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";

import useHogaresStore from "../../store/hogaresStore";
import useClientesStore from "../../store/clientesStore";

function HogarCreate() {

  const navigate = useNavigate();
  const location = useLocation();

  const rol = location.pathname.split("/")[1];
  const esCliente = rol === "cliente";
  const clienteId = 1;

  const rutaBase = `/${rol}/hogares`;

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const agregarHogar = useHogaresStore(
    (state) => state.agregarHogar
  );

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

  function manejarSubmit(e) {
    e.preventDefault();

    const propietarioId = esCliente
      ? clienteId
      : formulario.clienteId;

    const propietario = clientes.find(
      (cliente) =>
        String(cliente.id) === String(propietarioId)
    );

    if (!propietario) {
      alert("Seleccioná un cliente válido.");
      return;
    }

    if (
      !formulario.direccion.trim() ||
      !formulario.localidad.trim() ||
      !opcionesTipos.some(
        (tipo) => tipo.valor === formulario.tipo
      )
    ) {
      alert("Completá correctamente todos los campos obligatorios.");
      return;
    }

    agregarHogar({
      ...formulario,
      clienteId: propietario.id,
      direccion: formulario.direccion.trim(),
      localidad: formulario.localidad.trim(),
      descripcion: formulario.descripcion.trim()
    });

    navigate(rutaBase);
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
            Guardar hogar
          </Button>

        </div>

      </form>

    </section>
  );
}

export default HogarCreate;