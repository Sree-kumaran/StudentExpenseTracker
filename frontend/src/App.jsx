import React from "react";
import DashboardLayout from "./components/DashboardLayout";
import ExpenseForm from "./components/ExpenseForm";

import useExpenses from "./hooks/useExpenses";
import calculateTotalExpenses from "./utils/calculateTotalExpenses";
import formatCurrency from "./utils/formatCurrency";

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

export default function App() {
  const { expenses } = useExpenses();
  const total = calculateTotalExpenses(expenses);

  return (
    <DashboardLayout>
      {/* Dashboard cards (now driven by real data for "Total Expenses") */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(total)}
          helper="All-time spending"
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

      {/* Increment 4: Expense Form */}
      <div className="mt-6">
        <ExpenseForm />
      </div>

      {/* Keep Increment 3 testing UI */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Increment 3: Expense State Test
        </div>

        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <strong>Expense count:</strong> {expenses.length}
          </div>
          <div>
            <strong>Total expenses:</strong> {formatCurrency(total)}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
            All expense titles
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {expenses.map((e) => (
              <li key={e.id}>{e.title}</li>
            ))}
          </ul>
        </div>
      </section>
    </DashboardLayout>
  );
}
