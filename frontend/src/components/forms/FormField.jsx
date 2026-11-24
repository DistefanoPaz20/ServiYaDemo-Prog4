
import { useId } from "react";

function FormField({
  label,
  nombre,
  tipo = "text",
  valor,
  onChange,
  placeholder,
  requerido = false,
  opciones = []
}) {
  const id = useId();

  return (
    <div className="form-field">

      <label htmlFor={id}>
        {label}
        {requerido && (
          <span className="form-required"> *</span>
        )}
      </label>

      {tipo === "select" ? (

        <select
          id={id}
          name={nombre}
          value={valor}
          onChange={onChange}
          required={requerido}
        >
          <option value="">
            Seleccioná una opción
          </option>

          {opciones.map((opcion) => (
            <option
              key={opcion.valor}
              value={opcion.valor}
            >
              {opcion.texto}
            </option>
          ))}
        </select>

      ) : tipo === "textarea" ? (

        <textarea
          id={id}
          name={nombre}
          value={valor}
          onChange={onChange}
          placeholder={placeholder}
          required={requerido}
          rows={4}
        />

      ) : (

        <input
          id={id}
          type={tipo}
          name={nombre}
          value={valor}
          onChange={onChange}
          placeholder={placeholder}
          required={requerido}
        />

      )}

    </div>
  );
}

export default FormField;
