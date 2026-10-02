// A small, reusable "number + label" card. It takes its content
// entirely through props, so the same component can render four
// different statistics on the Dashboard without four separate
// copies of this JSX.
function StatCard({ label, value, note, tone = 'primary', icon }) {
  return (
    <div className="card stat-card">
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        <span
          className="stat-card__icon"
          style={{
            background: `var(--color-${tone}-soft)`,
            color: tone === 'accent' ? '#a06616' : `var(--color-${tone})`,
          }}
        >
          {icon}
        </span>
      </div>
      <span className="stat-card__value">{value}</span>
      {note && <span className="stat-card__note">{note}</span>}
    </div>
  );
}

export default StatCard;
