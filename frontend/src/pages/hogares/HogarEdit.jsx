
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";

import useHogaresStore from "../../store/hogaresStore";
import useClientesStore from "../../store/clientesStore";

function HogarEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const clientes = useClientesStore(
    (state) => state.clientes
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

    const clienteExiste = clientes.some(
      (cliente) =>
        String(cliente.id) === String(formulario.clienteId)
    );

    if (!clienteExiste) {
      alert("Seleccioná un cliente válido.");
      return;
    }

    editarHogar(id, formulario);

    navigate("/admin/hogares");
  }

  if (!hogar) {
    return (
      <section className="crud-page">

        <PageHeader
          titulo="Hogar no encontrado"
          descripcion="La propiedad solicitada no existe."
        />

        <Button
          variante="secondary"
          icono={ArrowLeft}
          onClick={() => navigate("/admin/hogares")}
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

          <FormField
            label="Propietario"
            nombre="clienteId"
            tipo="select"
            valor={formulario.clienteId}
            opciones={opcionesClientes}
            onChange={manejarCambio}
            requerido
          />

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
            variante="secondary"
            icono={ArrowLeft}
            onClick={() => navigate("/admin/hogares")}
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
