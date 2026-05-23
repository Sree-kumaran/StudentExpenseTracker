import React, { useMemo, useState } from "react";
import useExpenses from "../hooks/useExpenses";

import calculateMonthlyExpenses from "../utils/calculateMonthlyExpenses";
import calculateRemainingBudget from "../utils/calculateRemainingBudget";
import calculateBudgetUsage from "../utils/calculateBudgetUsage";
import calculateDailyExpenses from "../utils/calculateDailyExpenses";
import getBudgetStatus from "../utils/getBudgetStatus";
import formatCurrency from "../utils/formatCurrency";

/**
 * BudgetTracker (Increment 8)
 * - Edit monthly budget (persisted via context + localStorage)
 * - Show monthly spending + remaining
 * - Show alerts (safe/warning/exceeded) + daily limit warning
 * - Progress bar with color conditions
 */
export default function BudgetTracker() {
  const { expenses, monthlyBudget, setMonthlyBudget } = useExpenses();

  const DAILY_LIMIT = 500;

  const [budgetInput, setBudgetInput] = useState(String(monthlyBudget));

  const monthlySpending = useMemo(
    () => calculateMonthlyExpenses(expenses),
    [expenses],
  );

  const remaining = useMemo(
    () => calculateRemainingBudget(monthlyBudget, monthlySpending),
    [monthlyBudget, monthlySpending],
  );

  const status = useMemo(
    () => getBudgetStatus(monthlyBudget, monthlySpending),
    [monthlyBudget, monthlySpending],
  );

  const usage = useMemo(
    () => calculateBudgetUsage(monthlyBudget, monthlySpending),
    [monthlyBudget, monthlySpending],
  );

  const todaySpending = useMemo(
    () => calculateDailyExpenses(expenses),
    [expenses],
  );

  const progressPercent = Math.min(100, Math.max(0, usage.percentUsed || 0));

  const progressColor =
    status.level === "exceeded"
      ? "bg-rose-600"
      : status.level === "warning"
        ? "bg-amber-500"
        : "bg-emerald-600";

  const alertStyles =
    status.level === "exceeded"
      ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
      : status.level === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
        : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200";

  function handleSave() {
    // Keep it simple: allow only positive numeric budgets
    const next = Number(budgetInput);
    if (!Number.isFinite(next) || next <= 0) return;

    setMonthlyBudget(next);
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Budget Tracker
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Set a monthly budget and track your spending with alerts.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <input
            type="number"
            min="1"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-slate-600 dark:focus:ring-slate-800 sm:w-48"
            placeholder="Enter monthly budget"
          />
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus:ring-slate-700"
          >
            Save Budget
          </button>
        </div>
      </div>

      {/* Main stats */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Current Budget
          </div>
          <div className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
            {formatCurrency(monthlyBudget)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Monthly Spending
          </div>
          <div className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
            {formatCurrency(monthlySpending)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Remaining Balance
          </div>
          <div className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
            {formatCurrency(remaining)}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div
        className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${alertStyles}`}
      >
        {status.message}
      </div>

      {/* Daily limit (optional enhancement) */}
      <div
        className={[
          "mt-3 rounded-2xl border px-4 py-3 text-sm",
          todaySpending > DAILY_LIMIT
            ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
            : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-200",
        ].join(" ")}
      >
        <strong>Daily limit:</strong> {formatCurrency(DAILY_LIMIT)} •{" "}
        <strong>Today spent:</strong> {formatCurrency(todaySpending)}
        {todaySpending > DAILY_LIMIT ? (
          <span className="ml-2 font-semibold">
            (Exceeded by {formatCurrency(todaySpending - DAILY_LIMIT)})
          </span>
        ) : null}
      </div>

      {/* Progress bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <span>Budget used</span>
          <span>{Math.round(usage.percentUsed)}%</span>
        </div>

        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className={`${progressColor} h-full rounded-full transition-all duration-500`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </section>
  );
}
