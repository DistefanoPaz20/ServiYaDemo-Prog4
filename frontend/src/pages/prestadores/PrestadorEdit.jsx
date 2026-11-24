
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";

import usePrestadoresStore from "../../store/prestadoresStore";
import useOficiosStore from "../../store/crearOficiosStore";

function PrestadorEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const oficios = useOficiosStore(
    (state) => state.oficios
  );

  const prestador = usePrestadoresStore((state) =>
    state.prestadores.find(
      (prestador) => String(prestador.id) === String(id)
    )
  );

  const editarPrestador = usePrestadoresStore(
    (state) => state.editarPrestador
  );

  const [formulario, setFormulario] = useState({
    nombre: prestador?.nombre ?? "",
    apellido: prestador?.apellido ?? "",
    email: prestador?.email ?? "",
    telefono: prestador?.telefono ?? "",
    oficioId: prestador?.oficioId ?? "",
    experiencia: prestador?.experiencia ?? "",
    estado: prestador?.estado ?? "Activo"
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

    editarPrestador(id, {
      ...formulario,
      experiencia
    });

    navigate("/admin/prestadores");
  }

  if (!prestador) {
    return (
      <section className="crud-page">

        <PageHeader
          titulo="Prestador no encontrado"
          descripcion="El profesional solicitado no existe."
        />

        <Button
          variante="secondary"
          icono={ArrowLeft}
          onClick={() => navigate("/admin/prestadores")}
        >
          Volver al listado
        </Button>

      </section>
    );
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Editar prestador"
        descripcion="Modificá los datos del profesional seleccionado."
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
            Guardar cambios
          </Button>

        </div>

      </form>

    </section>
  );
}

export default PrestadorEdit;
