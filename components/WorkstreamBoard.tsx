"use client";

import type { CrewMember, WorkItem } from "../lib/seed-data";

type WorkstreamBoardProps = {
  workItems: WorkItem[];
  crew: CrewMember[];
};

const priorityTone: Record<WorkItem["priority"], string> = {
  critical: "tag-critical",
  high: "tag-tonic",
  medium: "tag-warn",
  low: "tag-idle"
};

export function WorkstreamBoard({ workItems, crew }: WorkstreamBoardProps) {
  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>Operational Radar</h2>
          <p className="panel-subtitle">Track blockers and commitments before they escalate.</p>
        </div>
      </header>

      <ul className="workstream-list" role="list">
        {workItems.map((item) => {
          const owner = crew.find((member) => member.id === item.ownerId);
          return (
            <li key={item.id} className="workstream-card">
              <div className="workstream-header">
                <span className={`tag ${priorityTone[item.priority]}`}>
                  {item.priority.toUpperCase()}
                </span>
                <span className="workstream-id">{item.id}</span>
              </div>
              <h3>{item.scope}</h3>
              <p className="workstream-location">{item.location}</p>
              <div className="workstream-meta">
                <div>
                  <p className="meta-label">Owner</p>
                  <p className="meta-value">{owner?.name}</p>
                </div>
                <div>
                  <p className="meta-label">Due</p>
                  <p className="meta-value">{item.due}</p>
                </div>
              </div>
              {item.blockers.length > 0 ? (
                <div className="blockers">
                  <p className="meta-label">Blockers</p>
                  <ul>
                    {item.blockers.map((blocker) => (
                      <li key={blocker}>{blocker}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="blockers clear">No blockers reported.</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
