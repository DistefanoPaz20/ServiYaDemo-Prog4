
import { Pencil, Trash2 } from "lucide-react";

function DataTable({
  columnas,
  datos,
  onEditar,
  onEliminar
}) {
  const tieneAcciones = Boolean(onEditar || onEliminar);

  return (
    <div className="data-table-container">

      <table className="data-table">

        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.campo}>
                {columna.titulo}
              </th>
            ))}

            {tieneAcciones && <th>Acciones</th>}
          </tr>
        </thead>

        <tbody>

          {datos.length === 0 ? (
            <tr>
              <td
                className="data-table-empty"
                colSpan={
                  columnas.length + (tieneAcciones ? 1 : 0)
                }
              >
                No hay registros disponibles.
              </td>
            </tr>
          ) : (
            datos.map((fila) => (
              <tr key={fila.id}>

                {columnas.map((columna) => (
                  <td key={columna.campo}>
                    {columna.render
                      ? columna.render(fila)
                      : fila[columna.campo]}
                  </td>
                ))}

                {tieneAcciones && (
                  <td>
                    <div className="table-actions">

                      {onEditar && (
                        <button
                          type="button"
                          className="table-edit"
                          title="Editar"
                          aria-label="Editar registro"
                          onClick={() => onEditar(fila.id)}
                        >
                          <Pencil size={17} />
                        </button>
                      )}

                      {onEliminar && (
                        <button
                          type="button"
                          className="table-delete"
                          title="Eliminar"
                          aria-label="Eliminar registro"
                          onClick={() => onEliminar(fila.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      )}

                    </div>
                  </td>
                )}

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}

export default DataTable;
