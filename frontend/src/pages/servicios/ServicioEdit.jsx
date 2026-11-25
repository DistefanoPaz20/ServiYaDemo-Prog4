
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import ServicioForm from "../../components/forms/ServicioForm";
import Button from "../../components/ui/Button";

import useAuthStore from "../../store/authStore";
import useServiciosStore from "../../store/serviciosStore";

function ServicioEdit() {

  const { id } = useParams();
  const navigate = useNavigate();

  const usuario = useAuthStore(
    (state) => state.usuario
  );

  const servicio = useServiciosStore((state) =>
    state.servicios.find(
      (servicio) => String(servicio.id) === String(id)
    )
  );

  const editarServicio = useServiciosStore(
    (state) => state.editarServicio
  );

  async function manejarGuardar(datos) {

    if (usuario?.rol !== "admin") {
      throw new Error("No tenés permiso para editar servicios.");
    }

    await editarServicio(id, datos);

    navigate("/admin/servicios");
  }

  if (!servicio || usuario?.rol !== "admin") {
    return (
      <section className="crud-page">

        <PageHeader
          titulo="Servicio no disponible"
          descripcion="El servicio no existe o no tenés acceso."
        />

        <Button
          variante="secondary"
          icono={ArrowLeft}
          onClick={() =>
            navigate(`/${usuario?.rol ?? "admin"}`)
          }
        >
          Volver al panel
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
