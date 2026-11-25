import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/ui/Button";

import useOficiosStore from "../../store/crearOficiosStore";
import useOperacion from "../../hooks/useOperacion";

function OficioEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const oficios = useOficiosStore(
    (state) => state.oficios
  );

  const oficio = oficios.find(
    (o) => String(o.id) === String(id)
  );

  const editarOficio = useOficiosStore(
    (state) => state.editarOficio
  );

  const { ejecutar, procesando, error } = useOperacion();

  const [formulario, setFormulario] = useState({
    nombre: oficio?.nombre ?? "",
    descripcion: oficio?.descripcion ?? ""
  });

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
      const nombre = formulario.nombre.trim();
      const descripcion = formulario.descripcion.trim();

      if (!nombre || !descripcion) {
        throw new Error("Completá todos los campos.");
      }

      const existe = oficios.some(
        (otro) =>
          String(otro.id) !== String(id) &&
          otro.nombre.toLowerCase() === nombre.toLowerCase()
      );

      if (existe) {
        throw new Error("Este oficio ya está registrado.");
      }

      await editarOficio(id, { nombre, descripcion });
    });

    if (correcto) {
      navigate("/admin/oficios");
    }
  }

  if (!oficio) {
    return (
      <section className="crud-page">

        <PageHeader
          titulo="Oficio no encontrado"
          descripcion="La especialidad solicitada no existe."
        />

        <Button
          variante="secondary"
          icono={ArrowLeft}
          onClick={() => navigate("/admin/oficios")}
        >
          Volver al listado
        </Button>

      </section>
    );
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Editar oficio"
        descripcion="Modificá los datos de la especialidad seleccionada."
      />

      <form className="crud-form" onSubmit={manejarSubmit}>

        <div className="crud-form-grid">

          <div className="crud-form-full">
            <FormField
              label="Nombre del oficio"
              nombre="nombre"
              valor={formulario.nombre}
              onChange={manejarCambio}
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
              requerido
            />
          </div>

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
              if (!procesando) navigate("/admin/oficios");
            }}
          >
            Cancelar
          </Button>

          <Button tipo="submit" icono={Save}>
            {procesando ? "Guardando..." : "Guardar cambios"}
          </Button>

        </div>

      </form>

    </section>
  );
}

export default OficioEdit;