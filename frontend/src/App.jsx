import React from "react";
import DashboardLayout from "./components/DashboardLayout";

function StatCard({ title, value, helper }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {title}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {value}
      </div>
      {helper ? (
        <div className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {helper}
        </div>
      ) : null}
    </div>
  );
}

/**
 * App
 * - Uses DashboardLayout
 * - Shows 4 placeholder cards (stat overview)
 */
export default function App() {
  return (
    <DashboardLayout>
      {/* Dashboard cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Expenses"
          value="$1,245.50"
          helper="All-time spending (placeholder)"
        />
        <StatCard
          title="Monthly Budget"
          value="$500.00"
          helper="Budget for this month (placeholder)"
        />
        <StatCard
          title="Remaining Balance"
          value="$214.50"
          helper="Budget minus expenses (placeholder)"
        />
        <StatCard
          title="Top Category"
          value="Food"
          helper="Highest spend category (placeholder)"
        />
      </section>

      {/* Extra placeholder panel to show spacing */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Recent activity
        </div>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Add tables, charts, and forms here in the next increments.
        </div>
      </section>
    </DashboardLayout>
  );
}
