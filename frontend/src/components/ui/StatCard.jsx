
function StatCard({ titulo, valor, icono: Icono, color }) {
  return (
    <article className="stat-card">
      <div className="stat-card-info">
        <p>{titulo}</p>
        <h3>{valor}</h3>
      </div>

      <div
        className="stat-card-icon"
        style={{ color: color }}
      >
        <Icono size={26} />
      </div>
    </article>
  );
}

export default StatCard;
