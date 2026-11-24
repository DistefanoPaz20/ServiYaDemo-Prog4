
import { Link, Outlet } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";

import logoServiYa from "../assets/images/LogoServiYa.png";

function AuthLayout() {
  return (
    <div className="auth-layout">

      <aside className="auth-brand-panel">
        <Link to="/" className="auth-brand-logo">
          <img src={logoServiYa} alt="ServiYa" />
        </Link>

        <div className="auth-brand-content">
          <div className="auth-brand-icon">
            <ShieldCheck size={36} />
          </div>

          <h1>
            Tu hogar en
            <span> buenas manos.</span>
          </h1>

          <p>
            Encontrá profesionales de confianza
            para resolver las necesidades de tu hogar.
          </p>
        </div>

        <p className="auth-brand-footer">
          ServiYa — Servicios para tu hogar
        </p>
      </aside>

      <main className="auth-form-panel">
        <div className="auth-form-container">

          <Link to="/" className="auth-back-link">
            <ArrowLeft size={18} />
            Volver al inicio
          </Link>

          <Outlet />

        </div>
      </main>

    </div>
  );
}

export default AuthLayout;
