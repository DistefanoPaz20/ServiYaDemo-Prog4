
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";

import usePrestadoresStore from "../../store/prestadoresStore";
import useOficiosStore from "../../store/crearOficiosStore";

function PrestadorCreate() {
  const navigate = useNavigate();

  const oficios = useOficiosStore(
    (state) => state.oficios
  );

  const agregarPrestador = usePrestadoresStore(
    (state) => state.agregarPrestador
  );

  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    oficioId: "",
    experiencia: "",
    estado: "Activo"
  });

  const opcionesOficios = oficios.map((oficio) => ({
    valor: oficio.id,
    texto: oficio.nombre
  }));

  const opcionesEstados = [
    { valor: "Activo", texto: "Activo" },
    { valor: "Inactivo", texto: "Inactivo" }
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

    const oficioExiste = oficios.some(
      (oficio) =>
        String(oficio.id) === String(formulario.oficioId)
    );

    if (!oficioExiste) {
      alert("Seleccioná un oficio válido.");
      return;
    }

    const experiencia = Number(formulario.experiencia);

    if (
      formulario.experiencia === "" ||
      !Number.isInteger(experiencia) ||
      experiencia < 0
    ) {
      alert("Ingresá una cantidad válida de años de experiencia.");
      return;
    }

    agregarPrestador({
      ...formulario,
      experiencia
    });

    navigate("/admin/prestadores");
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Nuevo prestador"
        descripcion="Registrá un nuevo profesional en ServiYa."
      />

      <form
        className="crud-form"
        onSubmit={manejarSubmit}
      >

        <div className="crud-form-grid">

          <FormField
            label="Nombre"
            nombre="nombre"
            valor={formulario.nombre}
            onChange={manejarCambio}
            requerido
          />

          <FormField
            label="Apellido"
            nombre="apellido"
            valor={formulario.apellido}
            onChange={manejarCambio}
            requerido
          />

          <FormField
            label="Correo electrónico"
            nombre="email"
            tipo="email"
            valor={formulario.email}
            onChange={manejarCambio}
            requerido
          />

          <FormField
            label="Teléfono"
            nombre="telefono"
            tipo="tel"
            valor={formulario.telefono}
            onChange={manejarCambio}
            requerido
          />

          <FormField
            label="Oficio"
            nombre="oficioId"
            tipo="select"
            opciones={opcionesOficios}
            valor={formulario.oficioId}
            onChange={manejarCambio}
            requerido
          />

          <FormField
            label="Años de experiencia"
            nombre="experiencia"
            tipo="number"
            valor={formulario.experiencia}
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

        </div>

        <div className="crud-form-actions">

          <Button
            tipo="button"
            variante="secondary"
            icono={ArrowLeft}
            onClick={() => navigate("/admin/prestadores")}
          >
            Cancelar
          </Button>

          <Button
            tipo="submit"
            icono={Save}
          >
            Guardar prestador
          </Button>

        </div>

      </form>

    </section>
  );
}

export default PrestadorCreate;
