
import { useState } from "react";
import {
  useNavigate,
  Link
} from "react-router-dom";

import useAuthStore from "../../store/authStore";
import useClientesStore from "../../store/clientesStore";
import usePrestadoresStore from "../../store/prestadoresStore";
import useOficiosStore from "../../store/crearOficiosStore";

import FormField from "../../components/forms/FormField";

function EditarPerfil() {
  const usuario = useAuthStore(
    (state) => state.usuario
  );

  const rol = usuario?.rol;
  const perfilId = usuario?.perfilId;

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const prestadores = usePrestadoresStore(
    (state) => state.prestadores
  );

  const perfil = rol === "cliente"
    ? clientes.find(
        (cliente) => String(cliente.id) === String(perfilId)
      )
    : rol === "prestador"
      ? prestadores.find(
          (prestador) => String(prestador.id) === String(perfilId)
        )
      : null;

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

  const actualizarUsuario = useAuthStore(
    (state) => state.actualizarUsuario
  );

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
  const [guardando, setGuardando] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();

    if (guardando) return;

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
      email: formulario.email.trim().toLowerCase(),
      telefono: formulario.telefono.trim()
    };

    setGuardando(true);

    try {

      if (rol === "cliente") {

        await editarCliente(perfil.id, datos);

      } else {

        const experiencia = Number(formulario.experiencia);

        if (
          formulario.experiencia === "" ||
          !Number.isInteger(experiencia) ||
          experiencia < 0 ||
          experiencia > 100
        ) {
          throw new Error(
            "Ingresá una experiencia válida."
          );
        }

        const oficio = oficios.find(
          (o) => String(o.id) === String(formulario.oficioId)
        );

        if (!oficio) {
          throw new Error(
            "Seleccioná un oficio válido."
          );
        }

        await editarPrestador(perfil.id, {
          ...datos,
          oficioId: oficio.id,
          experiencia,
          estado: perfil.estado
        });
      }

      actualizarUsuario({
        nombre: `${datos.nombre} ${datos.apellido}`,
        email: datos.email
      });

      navigate(`/${rol}/perfil`);

    } catch (error) {

      setError(
        error.message || "No se pudo actualizar el perfil."
      );

    } finally {

      setGuardando(false);

    }
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
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Guardar cambios"}
          </button>

        </div>

      </form>

    </section>
  );
}

export default EditarPerfil;
