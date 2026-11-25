
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import ServicioForm from "../../components/forms/ServicioForm";

import useAuthStore from "../../store/authStore";
import useServiciosStore from "../../store/serviciosStore";

function ServicioCreate() {

  const navigate = useNavigate();

  const usuario = useAuthStore(
    (state) => state.usuario
  );

  const rol = usuario?.rol;
  const esCliente = rol === "cliente";

  const agregarServicio = useServiciosStore(
    (state) => state.agregarServicio
  );

  async function manejarGuardar(datos) {

    await agregarServicio(datos);

    navigate(`/${rol}/servicios`);
  }

  return (
    <section className="crud-page">

      <PageHeader
        titulo={
          esCliente
            ? "Solicitar servicio"
            : "Nuevo servicio"
        }
        descripcion={
          esCliente
            ? "Solicitá un trabajo a un profesional de ServiYa."
            : "Registrá un nuevo trabajo solicitado en ServiYa."
        }
      />

      <ServicioForm
        onGuardar={manejarGuardar}
        textoBoton={
          esCliente
            ? "Enviar solicitud"
            : "Guardar servicio"
        }
      />

    </section>
  );
}

export default ServicioCreate;
