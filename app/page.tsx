import { Dashboard } from "../components/Dashboard";
import {
  attendance as attendanceSeed,
  crew as crewSeed,
  materialAlerts,
  payments as paymentSeed,
  workItems
} from "../lib/seed-data";

export default function HomePage() {
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">FieldFlow · Plumbing Contractor Agent</p>
          <h1>
            Keep crews paid, present, and productive — with an AI foreman in your corner.
          </h1>
          <p className="lede">
            Track attendance in real time, coordinate payments, unblock critical scopes, and
            spin up guided briefings that keep both contractors and labour on the same page.
          </p>
        </div>
        <div className="header-stats">
          <div>
            <span className="stat-label">Jobsite</span>
            <span className="stat-value">Mahindra SkyCity - Tower B</span>
          </div>
          <div>
            <span className="stat-label">Shift</span>
            <span className="stat-value">Day (08:00 - 18:00)</span>
          </div>
          <div>
            <span className="stat-label">Controller</span>
            <span className="stat-value">S. N. Desai Contracting</span>
          </div>
        </div>
      </header>
      <Dashboard
        crew={crewSeed}
        initialAttendance={attendanceSeed}
        payments={paymentSeed}
        workItems={workItems}
        materialAlerts={materialAlerts}
      />
    </main>
  );
}
