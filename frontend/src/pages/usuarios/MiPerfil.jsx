import { Link, useLocation } from "react-router-dom";
import {
  CircleUserRound,
  Pencil,
  LockKeyhole
} from "lucide-react";

import useClientesStore from "../../store/clientesStore";
import usePrestadoresStore from "../../store/prestadoresStore";
import useOficiosStore from "../../store/crearOficiosStore";

function MiPerfil() {

  const location = useLocation();
  const rol = location.pathname.split("/")[1];

  const clientes = useClientesStore(
    (state) => state.clientes
  );

  const prestadores = usePrestadoresStore(
    (state) => state.prestadores
  );

  const oficios = useOficiosStore(
    (state) => state.oficios
  );

  // ID provisional hasta conectar la autenticación
  const perfilId = 1;

  const perfil = rol === "cliente"
    ? clientes.find(
        (cliente) => String(cliente.id) === String(perfilId)
      )
    : prestadores.find(
        (prestador) => String(prestador.id) === String(perfilId)
      );

  if (!perfil) {
    return (
      <p>No se encontró la información del perfil.</p>
    );
  }

  const oficio = oficios.find(
    (oficio) =>
      String(oficio.id) === String(perfil.oficioId)
  );

  return (
    <section className="perfil-page">

      <div className="perfil-header">
        <h2>Mi perfil</h2>
        <p>Administrá tu información personal.</p>
      </div>

      <article className="panel-seccion">

        <div className="perfil-identidad">

          <div className="perfil-avatar">
            <CircleUserRound size={48} />
          </div>

          <div>
            <h2>
              {perfil.nombre} {perfil.apellido}
            </h2>

            <p>
              {rol === "cliente"
                ? "Cliente de ServiYa"
                : "Prestador de ServiYa"}
            </p>
          </div>

        </div>

        <h2>Información personal</h2>

        <div className="perfil-grid">

          <div className="perfil-dato">
            <span>Nombre</span>
            <strong>{perfil.nombre}</strong>
          </div>

          <div className="perfil-dato">
            <span>Apellido</span>
            <strong>{perfil.apellido}</strong>
          </div>

          <div className="perfil-dato">
            <span>Correo electrónico</span>
            <strong>{perfil.email}</strong>
          </div>

          <div className="perfil-dato">
            <span>Teléfono</span>
            <strong>{perfil.telefono}</strong>
          </div>

          {rol === "prestador" && (
            <>
              <div className="perfil-dato">
                <span>Oficio</span>
                <strong>
                  {oficio?.nombre ?? "Sin oficio"}
                </strong>
              </div>

              <div className="perfil-dato">
                <span>Experiencia</span>
                <strong>{perfil.experiencia} años</strong>
              </div>

              <div className="perfil-dato">
                <span>Estado profesional</span>
                <strong>{perfil.estado}</strong>
              </div>
            </>
          )}

        </div>

        <div className="perfil-acciones">

          <Link
            to={`/${rol}/perfil/editar`}
            className="perfil-boton"
          >
            <Pencil size={18} />
            Editar perfil
          </Link>

        </div>

      </article>

      <article className="panel-seccion">

        <h2>Seguridad de la cuenta</h2>

        <div className="perfil-seguridad">

          <LockKeyhole size={28} />

          <div>
            <h3>Contraseña</h3>
            <p>Protegé el acceso a tu cuenta.</p>
          </div>

          <Link
            to={`/${rol}/perfil/password`}
            className="perfil-boton"
          >
            Cambiar contraseña
          </Link>

        </div>

      </article>

    </section>
  );
}

export default MiPerfil;