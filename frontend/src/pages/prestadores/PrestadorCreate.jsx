import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";

import usePrestadoresStore from "../../store/prestadoresStore";
import useOficiosStore from "../../store/crearOficiosStore";
import useOperacion from "../../hooks/useOperacion";

function PrestadorCreate() {
  const navigate = useNavigate();

  const oficios = useOficiosStore(
    (state) => state.oficios
  );

  const agregarPrestador = usePrestadoresStore(
    (state) => state.agregarPrestador
  );

  const { ejecutar, procesando, error } = useOperacion();

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

  async function manejarSubmit(e) {
    e.preventDefault();

    const correcto = await ejecutar(async () => {
      const oficioExiste = oficios.some(
        (oficio) =>
          String(oficio.id) === String(formulario.oficioId)
      );

      if (!oficioExiste) {
        throw new Error("Seleccioná un oficio válido.");
      }

      const experiencia = Number(formulario.experiencia);

      if (
        formulario.experiencia === "" ||
        !Number.isInteger(experiencia) ||
        experiencia < 0 ||
        experiencia > 100
      ) {
        throw new Error(
          "Ingresá una experiencia entre 0 y 100 años."
        );
      }

      await agregarPrestador({
        ...formulario,
        oficioId: Number(formulario.oficioId),
        experiencia
      });
    });

    if (correcto) {
      navigate("/admin/prestadores");
    }
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Nuevo prestador"
        descripcion="Registrá un nuevo profesional en ServiYa."
      />

      <form className="crud-form" onSubmit={manejarSubmit}>

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

        {error && (
          <p className="crud-error" role="alert">
            {error}
          </p>
        )}

        <div className="crud-form-actions">

          <Button
            tipo="button"
            variante="secondary"
            icono={ArrowLeft}
            onClick={() => {
              if (!procesando) navigate("/admin/prestadores");
            }}
          >
            Cancelar
          </Button>

          <Button tipo="submit" icono={Save}>
            {procesando ? "Guardando..." : "Guardar prestador"}
          </Button>

        </div>

      </form>

    </section>
  );
}

export default PrestadorCreate;