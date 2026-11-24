
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";
import useOficiosStore from "../../store/crearOficiosStore";

function OficioCreate() {
  const navigate = useNavigate();

  const oficios = useOficiosStore(
    (state) => state.oficios
  );

  const agregarOficio = useOficiosStore(
    (state) => state.agregarOficio
  );

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: ""
  });

  function manejarCambio(e) {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function manejarSubmit(e) {
    e.preventDefault();

    const nombre = formulario.nombre.trim();
    const descripcion = formulario.descripcion.trim();

    if (!nombre || !descripcion) {
      alert("Completá todos los campos.");
      return;
    }

    const existe = oficios.some(
      (oficio) =>
        oficio.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
      alert("Este oficio ya está registrado.");
      return;
    }

    agregarOficio({ nombre, descripcion });

    navigate("/admin/oficios");
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Nuevo oficio"
        descripcion="Registrá una nueva especialidad en ServiYa."
      />

      <form
        className="crud-form"
        onSubmit={manejarSubmit}
      >

        <div className="crud-form-grid">

          <div className="crud-form-full">
            <FormField
              label="Nombre del oficio"
              nombre="nombre"
              valor={formulario.nombre}
              onChange={manejarCambio}
              placeholder="Ej: Jardinería"
              requerido
            />
          </div>

          <div className="crud-form-full">
            <FormField
              label="Descripción"
              nombre="descripcion"
              tipo="textarea"
              valor={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Describí la especialidad..."
              requerido
            />
          </div>

        </div>

        <div className="crud-form-actions">

          <Button
            tipo="button"
            variante="secondary"
            icono={ArrowLeft}
            onClick={() => navigate("/admin/oficios")}
          >
            Cancelar
          </Button>

          <Button
            tipo="submit"
            icono={Save}
          >
            Guardar oficio
          </Button>

        </div>

      </form>

    </section>
  );
}

export default OficioCreate;
