type Metric = {
  label: string;
  value: string;
  caption: string;
  trend: string;
  tone?: "positive" | "negative" | "neutral";
};

type OverviewGridProps = {
  metrics: Metric[];
};

export function OverviewGrid({ metrics }: OverviewGridProps) {
  return (
    <section className="panel overview-panel">
      <header className="panel-header">
        <div>
          <h2>Site Pulse</h2>
          <p className="panel-subtitle">
            Real-time summary of attendance, payroll health, and job risk.
          </p>
        </div>
      </header>
      <div className="overview-grid">
        {metrics.map((metric) => (
          <article key={metric.label} className="overview-card">
            <h3>{metric.label}</h3>
            <p className="overview-value">{metric.value}</p>
            <p className="overview-caption">{metric.caption}</p>
            <span className={`trend trend-${metric.tone ?? "neutral"}`}>
              {metric.trend}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
