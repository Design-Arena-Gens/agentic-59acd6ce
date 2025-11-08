"use client";

import { useMemo, useState } from "react";
import type {
  AttendanceSnapshot,
  CrewMember,
  MaterialAlert,
  PaymentRecord,
  WorkItem
} from "../lib/seed-data";

type AgentConsoleProps = {
  crew: CrewMember[];
  attendance: AttendanceSnapshot[];
  payments: PaymentRecord[];
  workItems: WorkItem[];
  materialAlerts: MaterialAlert[];
};

type AgentPlay = {
  title: string;
  summary: string;
  actions: string[];
  tags: string[];
};

const toneLabels: Record<string, string> = {
  stabilise: "Stabilise crew",
  accelerate: "Accelerate progress",
  reassure: "Reassure client"
};

export function AgentConsole({
  crew,
  attendance,
  payments,
  workItems,
  materialAlerts
}: AgentConsoleProps) {
  const [focus, setFocus] = useState<"stabilise" | "accelerate" | "reassure">("stabilise");
  const [notes, setNotes] = useState("");
  const [plays, setPlays] = useState<AgentPlay[]>([]);

  const presentCrew = useMemo(
    () => attendance.filter((record) => record.status === "present").length,
    [attendance]
  );

  const totalCrew = crew.length;
  const outstanding = payments.reduce((sum, record) => sum + record.outstandingBalance, 0);
  const criticalTasks = workItems.filter((item) => item.priority === "critical" || item.priority === "high");
  const lowStock = materialAlerts.filter(
    (alert) => alert.remainingUnits / alert.threshold < 0.75
  );

  const buildActionPlan = () => {
    const actionPlan: AgentPlay[] = [];

    if (focus === "stabilise") {
      actionPlan.push({
        title: "Rebuild confidence on payments",
        summary: `₹${outstanding.toLocaleString(
          "en-IN"
        )} outstanding across ${payments.length} crew records.`,
        actions: [
          "Prioritise release for team members beyond 5 days since last payment.",
          "Send status update with expected release windows before toolbox talk.",
          "Log photo evidence for milestone approvals to unblock finance."
        ],
        tags: ["finance", "trust"]
      });
    }

    if (focus === "accelerate" || criticalTasks.length > 0) {
      const topTask = criticalTasks[0];
      if (topTask) {
        const owner = crew.find((member) => member.id === topTask.ownerId)?.name ?? "Crew lead";
        actionPlan.push({
          title: `Unblock ${topTask.scope}`,
          summary: `Owner: ${owner}. Blockers: ${topTask.blockers.join(", ") || "none"}.`,
          actions: [
            `Coordinate with procurement on "${topTask.blockers[0] ?? "pending items"}".`,
            "Reassign an extra helper from low priority tasks for next 48 hours.",
            "Capture progress photos to demonstrate momentum to client."
          ],
          tags: ["progress", "schedule"]
        });
      }
    }

    if (lowStock.length > 0) {
      const item = lowStock[0];
      actionPlan.push({
        title: `Secure ${item.material} stock`,
        summary: `${item.remainingUnits} units remaining, threshold ${item.threshold}.`,
        actions: [
          item.action,
          "Back-calculate impact on daily output if ETA slips by 48 hours.",
          "Ping site storekeeper for interim swaps."
        ],
        tags: ["materials", "risk"]
      });
    }

    if (presentCrew / totalCrew < 0.75) {
      actionPlan.push({
        title: "Address attendance gap",
        summary: `${presentCrew}/${totalCrew} on site. Investigate absences before noon.`,
        actions: [
          "Call absentees for status confirmation and alternate arrangements.",
          "Update client on expected impact if replacements are not deployed.",
          "Align with labour supplier for floating team availability."
        ],
        tags: ["workforce", "continuity"]
      });
    }

    if (notes.trim().length > 0) {
      actionPlan.push({
        title: "Custom directive",
        summary: "Site inputs from contractor",
        actions: [notes.trim()],
        tags: ["context"]
      });
    }

    setPlays(actionPlan);
  };

  return (
    <section className="panel agent-panel">
      <header className="panel-header">
        <div>
          <h2>Agent Playbook</h2>
          <p className="panel-subtitle">
            Configure the digital foreman to brief crews, follow up suppliers, and calm clients.
          </p>
        </div>
        <span className="tag tag-tonic">Autonomous ready</span>
      </header>

      <div className="agent-grid">
        <div className="agent-settings">
          <p className="section-label">Primary intent</p>
          <div className="segment-control">
            {(["stabilise", "accelerate", "reassure"] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={`segment ${focus === option ? "selected" : ""}`}
                onClick={() => setFocus(option)}
              >
                {toneLabels[option]}
              </button>
            ))}
          </div>

          <div className="agent-metrics">
            <div>
              <span className="metric-label">Crew onsite</span>
              <span className="metric-value">
                {presentCrew}/{totalCrew}
              </span>
            </div>
            <div>
              <span className="metric-label">Outstanding</span>
              <span className="metric-value">
                ₹{outstanding.toLocaleString("en-IN")}
              </span>
            </div>
            <div>
              <span className="metric-label">Critical scopes</span>
              <span className="metric-value">{criticalTasks.length}</span>
            </div>
          </div>

          <label className="notes-field">
            <span>Site inputs / client tension</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Example: Client visiting at 4 PM, need clean progress narrative."
            />
          </label>

          <button type="button" className="primary-button" onClick={buildActionPlan}>
            Generate playbook
          </button>
        </div>

        <div className="agent-output">
          {plays.length === 0 ? (
            <div className="empty-state">
              <p>Configure the agent and trigger a playbook to see guided actions.</p>
            </div>
          ) : (
            <ul className="playbook-list" role="list">
              {plays.map((play) => (
                <li key={play.title} className="play-card">
                  <header>
                    <h3>{play.title}</h3>
                    <div className="play-tags">
                      {play.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </header>
                  <p className="play-summary">{play.summary}</p>
                  <ul className="play-actions">
                    {play.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
