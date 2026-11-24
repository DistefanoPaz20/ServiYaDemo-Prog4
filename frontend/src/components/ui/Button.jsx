
function Button({
  children,
  tipo = "button",
  variante = "primary",
  icono: Icono,
  onClick,
  disabled = false
}) {
  return (
    <button
      type={tipo}
      className={`ui-button ui-button-${variante}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icono && <Icono size={18} />}
      {children}
    </button>
  );
}

export default Button;
