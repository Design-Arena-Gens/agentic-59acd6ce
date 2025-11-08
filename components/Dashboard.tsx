"use client";

import { useMemo, useState } from "react";
import type {
  AttendanceSnapshot,
  CrewMember,
  MaterialAlert,
  PaymentRecord,
  WorkItem
} from "../lib/seed-data";
import { OverviewGrid } from "./OverviewGrid";
import { AttendanceBoard } from "./AttendanceBoard";
import { PaymentBoard } from "./PaymentBoard";
import { WorkstreamBoard } from "./WorkstreamBoard";
import { MaterialBoard } from "./MaterialBoard";
import { AgentConsole } from "./AgentConsole";

type DashboardProps = {
  crew: CrewMember[];
  initialAttendance: AttendanceSnapshot[];
  payments: PaymentRecord[];
  workItems: WorkItem[];
  materialAlerts: MaterialAlert[];
};

const currencyCompact = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export function Dashboard({
  crew,
  initialAttendance,
  payments,
  workItems,
  materialAlerts
}: DashboardProps) {
  const [attendance, setAttendance] = useState<AttendanceSnapshot[]>(initialAttendance);

  const presentCount = useMemo(
    () => attendance.filter((record) => record.status === "present").length,
    [attendance]
  );

  const absentCount = useMemo(
    () => attendance.filter((record) => record.status === "absent").length,
    [attendance]
  );

  const onLeaveCount = useMemo(
    () => attendance.filter((record) => record.status === "leave").length,
    [attendance]
  );

  const dailyPayroll = useMemo(
    () =>
      attendance.reduce((total, record) => {
        if (record.status === "present") {
          const member = crew.find((item) => item.id === record.crewId);
          return total + (member?.dailyRate ?? 0);
        }
        return total;
      }, 0),
    [attendance, crew]
  );

  const outstanding = useMemo(
    () => payments.reduce((sum, record) => sum + record.outstandingBalance, 0),
    [payments]
  );

  const supplyPressure = useMemo(
    () =>
      materialAlerts.filter((alert) => alert.remainingUnits / alert.threshold <= 0.8).length,
    [materialAlerts]
  );

  const riskNarrative = useMemo(() => {
    const narratives: string[] = [];
    if (absentCount > 0 || onLeaveCount > 0) {
      narratives.push(`${absentCount + onLeaveCount} crew to cover`);
    }
    if (outstanding > 500) {
      narratives.push("Release ₹" + outstanding.toLocaleString("en-IN"));
    }
    if (supplyPressure > 0) {
      narratives.push("Materials flagged");
    }
    return narratives.length > 0 ? narratives.join(" · ") : "Stable";
  }, [absentCount, onLeaveCount, outstanding, supplyPressure]);

  const metrics = useMemo(
    () => [
      {
        label: "Crew availability",
        value: `${presentCount}/${crew.length}`,
        caption: `${absentCount} absent · ${onLeaveCount} on leave`,
        trend: presentCount / crew.length >= 0.8 ? "Within target" : "Below target",
        tone: presentCount / crew.length >= 0.8 ? ("positive" as const) : ("negative" as const)
      },
      {
        label: "Today&apos;s payroll",
        value: currencyCompact.format(dailyPayroll),
        caption: "Based on confirmed attendance",
        trend: outstanding > 0 ? "Pending historical releases" : "Up to date",
        tone: outstanding > 0 ? ("negative" as const) : ("positive" as const)
      },
      {
        label: "Outstanding balance",
        value: currencyCompact.format(outstanding),
        caption: "Across all crew",
        trend: outstanding > 500 ? "Escalate to finance" : "Within buffer",
        tone: outstanding > 500 ? ("negative" as const) : ("positive" as const)
      },
      {
        label: "Operational risk",
        value: riskNarrative,
        caption: `${supplyPressure} supply alerts · ${workItems.length} active scopes`,
        trend: supplyPressure > 0 ? "Resolve supply pressure" : "No active alerts",
        tone: supplyPressure > 0 ? ("negative" as const) : ("positive" as const)
      }
    ],
    [
      presentCount,
      crew.length,
      absentCount,
      onLeaveCount,
      dailyPayroll,
      outstanding,
      riskNarrative,
      supplyPressure,
      workItems.length
    ]
  );

  const handleAttendanceChange = (crewId: string, status: AttendanceSnapshot["status"]) => {
    setAttendance((previous) => {
      const exists = previous.find((record) => record.crewId === crewId);
      if (!exists) {
        return [...previous, { crewId, status }];
      }
      return previous.map((record) =>
        record.crewId === crewId
          ? {
              ...record,
              status,
              note: status === "leave" ? record.note ?? "On approved leave" : undefined
            }
          : record
      );
    });
  };

  return (
    <div className="dashboard">
      <OverviewGrid metrics={metrics} />
      <div className="dashboard-grid">
        <div className="dashboard-column">
          <AttendanceBoard crew={crew} attendance={attendance} onStatusChange={handleAttendanceChange} />
          <WorkstreamBoard crew={crew} workItems={workItems} />
        </div>
        <div className="dashboard-column">
          <PaymentBoard crew={crew} payments={payments} dailyPayrollCommitment={dailyPayroll} />
          <MaterialBoard alerts={materialAlerts} />
        </div>
      </div>
      <AgentConsole
        crew={crew}
        attendance={attendance}
        payments={payments}
        workItems={workItems}
        materialAlerts={materialAlerts}
      />
    </div>
  );
}
