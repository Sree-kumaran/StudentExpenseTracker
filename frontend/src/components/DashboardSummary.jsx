import React, { useMemo } from "react";
import useExpenses from "../hooks/useExpenses";

import calculateTotalExpenses from "../utils/calculateTotalExpenses";
import calculateMonthlyExpenses from "../utils/calculateMonthlyExpenses";
import calculateRemainingBudget from "../utils/calculateRemainingBudget";
import getTopCategory from "../utils/getTopCategory";
import formatCurrency from "../utils/formatCurrency";
import Card from "./ui/Card";

function SummaryCard({ icon, title, value, subtitle, accent }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {title}
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {value}
            </div>
            {subtitle ? (
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </div>
            ) : null}
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg dark:bg-slate-900">
            {icon}
          </div>
        </div>
      </div>

      {/* accent bar */}
      <div className={`h-1 w-full ${accent}`} />
    </Card>
  );
}

export default function DashboardSummary() {
  const { expenses, monthlyBudget } = useExpenses();

  const totalExpenses = useMemo(
    () => calculateTotalExpenses(expenses),
    [expenses],
  );
  const monthlySpending = useMemo(
    () => calculateMonthlyExpenses(expenses),
    [expenses],
  );
  const remaining = useMemo(
    () => calculateRemainingBudget(monthlyBudget, monthlySpending),
    [monthlyBudget, monthlySpending],
  );
  const topCategory = useMemo(() => getTopCategory(expenses), [expenses]);

  const remainingLabel =
    remaining >= 0
      ? formatCurrency(remaining)
      : `- ${formatCurrency(Math.abs(remaining))}`;

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        icon="💰"
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        subtitle="All-time spending"
        accent="bg-blue-600"
      />

      <SummaryCard
        icon="📅"
        title="Monthly Spending"
        value={formatCurrency(monthlySpending)}
        subtitle="This month"
        accent="bg-indigo-600"
      />

      <SummaryCard
        icon="🎯"
        title="Remaining Budget"
        value={remainingLabel}
        subtitle={`Budget: ${formatCurrency(monthlyBudget)} / month`}
        accent={remaining >= 0 ? "bg-emerald-600" : "bg-rose-600"}
      />

      <SummaryCard
        icon="🔥"
        title="Top Category"
        value={topCategory.category}
        subtitle={
          topCategory.category === "—"
            ? "No expenses yet"
            : `Spent: ${formatCurrency(topCategory.total)}`
        }
        accent="bg-amber-500"
      />
    </section>
  );
}
