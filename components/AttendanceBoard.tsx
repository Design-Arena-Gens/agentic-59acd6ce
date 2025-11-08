"use client";

import { useMemo } from "react";
import type { AttendanceSnapshot, CrewMember } from "../lib/seed-data";

const statusPalette: Record<
  AttendanceSnapshot["status"],
  { bg: string; text: string; border: string; label: string }
> = {
  present: {
    bg: "rgba(34,197,94,0.14)",
    text: "#166534",
    border: "1px solid rgba(34,197,94,0.4)",
    label: "Present"
  },
  absent: {
    bg: "rgba(239,68,68,0.12)",
    text: "#7f1d1d",
    border: "1px solid rgba(239,68,68,0.3)",
    label: "Absent"
  },
  leave: {
    bg: "rgba(251,191,36,0.18)",
    text: "#7c2d12",
    border: "1px solid rgba(251,191,36,0.45)",
    label: "On Leave"
  }
};

type AttendanceBoardProps = {
  crew: CrewMember[];
  attendance: AttendanceSnapshot[];
  onStatusChange: (crewId: string, status: AttendanceSnapshot["status"]) => void;
};

export function AttendanceBoard({ crew, attendance, onStatusChange }: AttendanceBoardProps) {
  const merged = useMemo(
    () =>
      crew.map((member) => ({
        ...member,
        attendance: attendance.find((entry) => entry.crewId === member.id) ?? {
          crewId: member.id,
          status: "absent" as const
        }
      })),
    [crew, attendance]
  );

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>Today&apos;s Crew Roll Call</h2>
          <p className="panel-subtitle">
            Mark presence before 9:00 AM for accurate payroll and alerts.
          </p>
        </div>
        <span className="tag tag-tonic">Live sync</span>
      </header>

      <div className="table">
        <div className="table-head">
          <span>Name</span>
          <span>Role</span>
          <span>Status</span>
          <span>Daily Rate</span>
          <span>Notes</span>
        </div>

        <ul className="table-list" role="list">
          {merged.map((member) => {
            const current = statusPalette[member.attendance.status];
            return (
              <li key={member.id} className="table-row">
                <div>
                  <p className="row-title">{member.name}</p>
                  <p className="row-subtitle">{member.contact}</p>
                </div>
                <div>
                  <p>{member.role}</p>
                  <span className="row-subtitle">{member.specialty}</span>
                </div>
                <div className="status-cell">
                  <span className="status-pill" style={current}>
                    {current.label}
                  </span>
                  <div className="status-actions">
                    {(["present", "absent", "leave"] as const).map((state) => (
                      <button
                        key={state}
                        type="button"
                        className={`status-button ${
                          member.attendance.status === state ? "active" : ""
                        }`}
                        onClick={() => onStatusChange(member.id, state)}
                      >
                        {state === "present" ? "✓" : state === "leave" ? "•" : "✕"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p>₹{member.dailyRate.toLocaleString("en-IN")}</p>
                  <span className="row-subtitle">Day rate</span>
                </div>
                <div>
                  <span className="row-note">
                    {member.attendance.note ?? "—"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
