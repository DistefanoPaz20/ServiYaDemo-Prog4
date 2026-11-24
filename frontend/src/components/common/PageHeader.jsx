
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Button from "../ui/Button";

function PageHeader({
  titulo,
  descripcion,
  textoBoton,
  rutaBoton
}) {
  const navigate = useNavigate();

  return (
    <header className="page-header">

      <div className="page-header-info">
        <h2>{titulo}</h2>
        <p>{descripcion}</p>
      </div>

      {textoBoton && rutaBoton && (
        <Button
          icono={Plus}
          onClick={() => navigate(rutaBoton)}
        >
          {textoBoton}
        </Button>
      )}

    </header>
  );
}

export default PageHeader;
