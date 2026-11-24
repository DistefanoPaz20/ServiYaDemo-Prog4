import { useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation
} from "react-router-dom";

import { Save, ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";

import useHogaresStore from "../../store/hogaresStore";
import useClientesStore from "../../store/clientesStore";
import useServiciosStore from "../../store/serviciosStore";

function HogarEdit() {

  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const rol = location.pathname.split("/")[1];
  const esCliente = rol === "cliente";
  const clienteId = 1;

  const rutaBase = `/${rol}/hogares`;

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const servicios = useServiciosStore(
    (state) => state.servicios
  );

  const hogar = useHogaresStore((state) =>
    state.hogares.find(
      (hogar) => String(hogar.id) === String(id)
    )
  );

  const editarHogar = useHogaresStore(
    (state) => state.editarHogar
  );

  const [formulario, setFormulario] = useState({
    clienteId: hogar?.clienteId ?? "",
    direccion: hogar?.direccion ?? "",
    localidad: hogar?.localidad ?? "",
    tipo: hogar?.tipo ?? "",
    descripcion: hogar?.descripcion ?? ""
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

    if (
      !hogar ||
      (
        esCliente &&
        String(hogar.clienteId) !== String(clienteId)
      )
    ) {
      return;
    }

    const propietarioId = esCliente
      ? hogar.clienteId
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

    const cambioPropietario =
      String(propietario.id) !== String(hogar.clienteId);

    const tieneServicios = servicios.some(
      (servicio) =>
        String(servicio.hogarId) === String(id)
    );

    if (cambioPropietario && tieneServicios) {
      alert(
        "No podés cambiar el propietario de un hogar con servicios asociados."
      );
      return;
    }

    editarHogar(id, {
      ...formulario,
      clienteId: propietario.id,
      direccion: formulario.direccion.trim(),
      localidad: formulario.localidad.trim(),
      descripcion: formulario.descripcion.trim()
    });

    navigate(rutaBase);
  }

  if (
    !hogar ||
    (
      esCliente &&
      String(hogar.clienteId) !== String(clienteId)
    )
  ) {
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
            Guardar cambios
          </Button>

        </div>

      </form>

    </section>
  );
}

export default HogarEdit;