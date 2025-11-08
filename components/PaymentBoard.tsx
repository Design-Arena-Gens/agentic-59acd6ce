"use client";

import type { CrewMember, PaymentRecord } from "../lib/seed-data";

type PaymentBoardProps = {
  crew: CrewMember[];
  payments: PaymentRecord[];
  dailyPayrollCommitment: number;
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export function PaymentBoard({ crew, payments, dailyPayrollCommitment }: PaymentBoardProps) {
  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>Cash Flow & Releases</h2>
          <p className="panel-subtitle">
            Reconcile balances, spot delays, and keep the crew confident about payouts.
          </p>
        </div>
        <div className="highlight-box">
          <p>Today&apos;s projected payroll</p>
          <span>{currency.format(dailyPayrollCommitment)}</span>
        </div>
      </header>
      <ul className="payment-list" role="list">
        {payments.map((record) => {
          const crewMember = crew.find((member) => member.id === record.crewId);
          return (
            <li key={record.crewId} className="payment-card">
              <div className="payment-header">
                <div>
                  <p className="row-title">{crewMember?.name ?? "Crew member"}</p>
                  <p className="row-subtitle">{crewMember?.role}</p>
                </div>
                <span className="tag">
                  {record.outstandingBalance > 0 ? "Pending release" : "Clear"}
                </span>
              </div>
              <div className="payment-body">
                <div>
                  <p className="payment-label">Outstanding</p>
                  <p className="payment-value">
                    {currency.format(record.outstandingBalance)}
                  </p>
                </div>
                <div>
                  <p className="payment-label">Last paid</p>
                  <p className="payment-value">{record.lastPaidOn}</p>
                </div>
                <div>
                  <p className="payment-label">Milestone</p>
                  <p className="payment-value">{record.nextMilestone}</p>
                </div>
                <div>
                  <p className="payment-label">Alert</p>
                  <p className="payment-remarks">{record.remarks}</p>
                </div>
              </div>
              <footer className="payment-footer">
                <span className="annotation">
                  {record.daysSincePayment} days since last payment
                </span>
                <button type="button" className="primary-button">
                  Release plan
                </button>
              </footer>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
