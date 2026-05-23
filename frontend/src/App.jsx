import React, { useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

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

  // Increment 5: editing state is lifted to App so ExpenseForm + ExpenseList can coordinate
  const [editingExpense, setEditingExpense] = useState(null);

  return (
    <DashboardLayout>
      {/* Dashboard cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(total)}
          helper="All-time spending"
        />
        <StatCard title="Monthly Budget" value="$500.00" helper="Placeholder" />
        <StatCard
          title="Remaining Balance"
          value="$214.50"
          helper="Placeholder"
        />
        <StatCard title="Top Category" value="Food" helper="Placeholder" />
      </section>

      {/* Expense Form (Add/Edit) */}
      <div className="mt-6">
        <ExpenseForm
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
          onSaved={() => setEditingExpense(null)}
        />
      </div>

      {/* Expense List */}
      <ExpenseList onEdit={(expense) => setEditingExpense(expense)} />

      {/* (Optional) keep your Increment 3 test UI if you still want it */}
      {/* You can remove this block later */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Debug / Test
        </div>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <strong>Expense count:</strong> {expenses.length}
          </div>
          <div>
            <strong>Total expenses:</strong> {formatCurrency(total)}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
