import React, { useMemo } from "react";
import useExpenses from "../hooks/useExpenses";

import calculateTotalExpenses from "../utils/calculateTotalExpenses";
import calculateMonthlyExpenses from "../utils/calculateMonthlyExpenses";
import calculateRemainingBudget from "../utils/calculateRemainingBudget";
import getTopCategory from "../utils/getTopCategory";
import formatCurrency from "../utils/formatCurrency";

/**
 * DashboardSummary (Increment 8 update)
 * - Uses monthlyBudget from context (dynamic)
 */
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

  const remainingBudget = useMemo(
    () => calculateRemainingBudget(monthlyBudget, monthlySpending),
    [monthlyBudget, monthlySpending],
  );

  const topCategory = useMemo(() => getTopCategory(expenses), [expenses]);

  const remainingTone =
    remainingBudget >= 0
      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200"
      : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200";

  function Card({ icon, title, value, accentClass, subtext }) {
    return (
      <div
        className={[
          "rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md",
          "dark:border-slate-800 dark:bg-slate-950",
          accentClass,
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {title}
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {value}
            </div>
            {subtext ? (
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {subtext}
              </div>
            ) : null}
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg dark:bg-slate-900">
            <span aria-hidden="true">{icon}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        icon="💰"
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        accentClass="border-slate-200"
        subtext="All-time spending"
      />

      <Card
        icon="📅"
        title="Monthly Spending"
        value={formatCurrency(monthlySpending)}
        accentClass="border-indigo-200 dark:border-indigo-900/40"
        subtext="Spending in current month"
      />

      <div className="rounded-2xl border p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Remaining Budget
            </div>
            <div
              className={[
                "mt-2 inline-flex rounded-xl border px-3 py-1 text-xl font-semibold tracking-tight",
                remainingTone,
              ].join(" ")}
            >
              📉 {formatCurrency(remainingBudget)}
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Budget: {formatCurrency(monthlyBudget)} / month
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg dark:bg-slate-900">
            <span aria-hidden="true">🎯</span>
          </div>
        </div>
      </div>

      <Card
        icon="🔥"
        title="Top Spending Category"
        value={topCategory.category}
        accentClass="border-amber-200 dark:border-amber-900/40"
        subtext={
          topCategory.category === "—"
            ? "No expenses yet"
            : `Spent: ${formatCurrency(topCategory.total)}`
        }
      />
    </section>
  );
}
