
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import ServicioForm from "../../components/forms/ServicioForm";
import Button from "../../components/ui/Button";

import useServiciosStore from "../../store/serviciosStore";

function ServicioEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const servicio = useServiciosStore((state) =>
    state.servicios.find(
      (servicio) => String(servicio.id) === String(id)
    )
  );

  const editarServicio = useServiciosStore(
    (state) => state.editarServicio
  );

  function manejarGuardar(datos) {
    editarServicio(id, datos);

    navigate("/admin/servicios");
  }

  if (!servicio) {
    return (
      <section className="crud-page">

        <PageHeader
          titulo="Servicio no encontrado"
          descripcion="El servicio solicitado no existe."
        />

        <Button
          variante="secondary"
          icono={ArrowLeft}
          onClick={() => navigate("/admin/servicios")}
        >
          Volver al listado
        </Button>

      </section>
    );
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo="Editar servicio"
        descripcion="Modificá los datos del trabajo seleccionado."
      />

      <ServicioForm
        key={servicio.id}
        servicioInicial={servicio}
        onGuardar={manejarGuardar}
        textoBoton="Guardar cambios"
      />

    </section>
  );
}

export default ServicioEdit;
