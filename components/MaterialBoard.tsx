"use client";

import type { MaterialAlert } from "../lib/seed-data";

type MaterialBoardProps = {
  alerts: MaterialAlert[];
};

export function MaterialBoard({ alerts }: MaterialBoardProps) {
  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>Material Watch</h2>
          <p className="panel-subtitle">
            Automated stock thresholds keep your crew from idling on site.
          </p>
        </div>
      </header>

      <ul className="material-list" role="list">
        {alerts.map((alert) => {
          const health = Math.round((alert.remainingUnits / alert.threshold) * 100);
          return (
            <li key={alert.id} className="material-card">
              <header>
                <h3>{alert.material}</h3>
                <span className="tag tag-tonic">{alert.eta}</span>
              </header>
              <div className="material-metrics">
                <div>
                  <p className="meta-label">Available</p>
                  <p className="meta-value">{alert.remainingUnits} units</p>
                </div>
                <div>
                  <p className="meta-label">Threshold</p>
                  <p className="meta-value">{alert.threshold} units</p>
                </div>
                <div>
                  <p className="meta-label">Health</p>
                  <p className="meta-value">{health}%</p>
                </div>
              </div>
              <p className="material-action">{alert.action}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
