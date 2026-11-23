import { NavLink, Link } from "react-router-dom";
import LogoServiYa from "../../assets/images/LogoServiYa.png";

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-content">

        <Link to="/" className="navbar-logo">
          <img src={LogoServiYa} alt="ServiYa" />
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" end>
            Inicio
          </NavLink>

          <NavLink to="/servicios">
            Servicios
          </NavLink>

          <NavLink to="/como-funciona">
            ¿Cómo funciona?
          </NavLink>
        </nav>

        <Link to="/login" className="btn-primary">
          Iniciar sesión
        </Link>

      </div>
    </header>
  );
}

export default Navbar;