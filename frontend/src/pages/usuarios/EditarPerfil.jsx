import { useState } from "react";
import {
  useLocation,
  useNavigate,
  Link
} from "react-router-dom";

import useClientesStore from "../../store/clientesStore";
import usePrestadoresStore from "../../store/prestadoresStore";
import useOficiosStore from "../../store/crearOficiosStore";

import FormField from "../../components/forms/FormField";

function EditarPerfil() {

  const location = useLocation();
  const rol = location.pathname.split("/")[1];

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const prestadores = usePrestadoresStore(
    (state) => state.prestadores
  );

  const perfilId = 1;

  const perfil = rol === "cliente"
    ? clientes.find(
        (cliente) => String(cliente.id) === String(perfilId)
      )
    : prestadores.find(
        (prestador) => String(prestador.id) === String(perfilId)
      );

  if (!perfil) {
    return <p>No se encontró el perfil.</p>;
  }

  return (
    <FormularioPerfil
      key={`${rol}-${perfil.id}`}
      perfil={perfil}
      rol={rol}
    />
  );
}

function FormularioPerfil({ perfil, rol }) {

  const navigate = useNavigate();

  const editarCliente = useClientesStore(
    (state) => state.editarCliente
  );

  const editarPrestador = usePrestadoresStore(
    (state) => state.editarPrestador
  );

  const oficios = useOficiosStore(
    (state) => state.oficios
  );

  const [formulario, setFormulario] = useState({
    nombre: perfil.nombre,
    apellido: perfil.apellido,
    email: perfil.email,
    telefono: perfil.telefono,
    oficioId: perfil.oficioId ?? "",
    experiencia: perfil.experiencia ?? 0
  });

  const [error, setError] = useState("");

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  function manejarSubmit(evento) {
    evento.preventDefault();
    setError("");

    if (
      !formulario.nombre.trim() ||
      !formulario.apellido.trim() ||
      !formulario.email.trim() ||
      !formulario.telefono.trim()
    ) {
      setError("Completá todos los campos.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      formulario.email.trim()
    )) {
      setError("Ingresá un correo válido.");
      return;
    }

    const datos = {
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      email: formulario.email.trim(),
      telefono: formulario.telefono.trim()
    };

    if (rol === "cliente") {

      editarCliente(perfil.id, datos);

    } else {

      const experiencia = Number(formulario.experiencia);

      if (
        formulario.experiencia === "" ||
        !Number.isInteger(experiencia) ||
        experiencia < 0
      ) {
        setError("Ingresá una experiencia válida.");
        return;
      }

      const oficio = oficios.find(
        (o) => String(o.id) === String(formulario.oficioId)
      );

      if (!oficio) {
        setError("Seleccioná un oficio válido.");
        return;
      }

      editarPrestador(perfil.id, {
        ...datos,
        oficioId: oficio.id,
        experiencia
      });
    }

    navigate(`/${rol}/perfil`);
  }

  return (
    <section className="perfil-page">

      <div className="perfil-header">
        <h2>Editar perfil</h2>
        <p>Actualizá tu información personal.</p>
      </div>

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

          {rol === "prestador" && (
            <>
              <FormField
                label="Oficio"
                nombre="oficioId"
                tipo="select"
                valor={formulario.oficioId}
                onChange={manejarCambio}
                opciones={oficios.map((oficio) => ({
                  valor: oficio.id,
                  texto: oficio.nombre
                }))}
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
            </>
          )}

        </div>

        {error && (
          <p className="login-message" role="alert">
            {error}
          </p>
        )}

        <div className="crud-form-actions">

          <Link to={`/${rol}/perfil`}>
            Cancelar
          </Link>

          <button
            type="submit"
            className="perfil-boton"
          >
            Guardar cambios
          </button>

        </div>

      </form>

    </section>
  );
}

export default EditarPerfil;