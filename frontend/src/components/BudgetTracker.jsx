import React, { useEffect, useMemo, useState } from "react";
import useExpenses from "../hooks/useExpenses";

import calculateMonthlyExpenses from "../utils/calculateMonthlyExpenses";
import calculateRemainingBudget from "../utils/calculateRemainingBudget";
import calculateDailyExpenses from "../utils/calculateDailyExpenses";
import getBudgetStatus from "../utils/getBudgetStatus";
import formatCurrency from "../utils/formatCurrency";

/**
 * BudgetTracker (Updated)
 * - Monthly budget: from context (stored in ExpenseContext)
 * - Daily limit: stored locally in localStorage (simple MVP approach)
 * - Progress bar ("Budget used") is based on DAILY limit usage:
 *    percent = (todaySpending / dailyLimit) * 100
 */
export default function BudgetTracker() {
  const { expenses, monthlyBudget, setMonthlyBudget } = useExpenses();

  // Daily limit storage (local to this component for Increment 10 tweak)
  const DAILY_LIMIT_KEY = "student-expense-tracker:dailyLimit";
  const DEFAULT_DAILY_LIMIT = 500;

  const [budgetInput, setBudgetInput] = useState(String(monthlyBudget));

  // Load daily limit safely from localStorage
  const [dailyLimit, setDailyLimit] = useState(() => {
    try {
      const raw = localStorage.getItem(DAILY_LIMIT_KEY);
      const num = Number(JSON.parse(raw));
      if (!Number.isFinite(num) || num <= 0) return DEFAULT_DAILY_LIMIT;
      return num;
    } catch {
      return DEFAULT_DAILY_LIMIT;
    }
  });

  const [dailyLimitInput, setDailyLimitInput] = useState(String(dailyLimit));

  // Persist daily limit whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify(dailyLimit));
    } catch {
      // ignore for MVP
    }
  }, [dailyLimit]);

  const monthlySpending = useMemo(
    () => calculateMonthlyExpenses(expenses),
    [expenses],
  );

  const remaining = useMemo(
    () => calculateRemainingBudget(monthlyBudget, monthlySpending),
    [monthlyBudget, monthlySpending],
  );

  const monthlyStatus = useMemo(
    () => getBudgetStatus(monthlyBudget, monthlySpending),
    [monthlyBudget, monthlySpending],
  );

  const todaySpending = useMemo(
    () => calculateDailyExpenses(expenses),
    [expenses],
  );

  // Progress bar is now based on DAILY usage (today vs dailyLimit)
  const dailyPercentUsed = useMemo(() => {
    if (!dailyLimit || dailyLimit <= 0) return 0;
    return (Number(todaySpending || 0) / Number(dailyLimit)) * 100;
  }, [todaySpending, dailyLimit]);

  const progressPercent = Math.min(100, Math.max(0, dailyPercentUsed));

  // Color based on daily usage thresholds
  const progressColor =
    dailyPercentUsed > 100
      ? "bg-rose-600"
      : dailyPercentUsed >= 80
        ? "bg-amber-500"
        : "bg-emerald-600";

  const dailyMessageTone =
    dailyPercentUsed > 100
      ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
      : dailyPercentUsed >= 80
        ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
        : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200";

  function handleSaveMonthlyBudget() {
    const next = Number(budgetInput);
    if (!Number.isFinite(next) || next <= 0) return;
    setMonthlyBudget(next);
  }

  function handleSaveDailyLimit() {
    const next = Number(dailyLimitInput);
    if (!Number.isFinite(next) || next <= 0) return;
    setDailyLimit(next);
  }

  const monthlyAlertStyles =
    monthlyStatus.level === "exceeded"
      ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
      : monthlyStatus.level === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
        : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200";

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Budget Tracker
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Set a monthly budget and a daily limit. Progress bar uses the daily
            limit.
          </p>
        </div>

        {/* Inputs: Monthly budget + Daily limit (same style) */}
        <div className="flex w-full flex-col gap-3 sm:w-auto">
          {/* Monthly budget */}
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="number"
              min="1"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-blue-400 dark:focus:ring-blue-900/30 sm:w-52"
              placeholder="Enter monthly budget"
            />
            <button
              type="button"
              onClick={handleSaveMonthlyBudget}
              className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus:ring-slate-700"
            >
              Save Budget
            </button>
          </div>

          {/* Daily limit */}
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="number"
              min="1"
              value={dailyLimitInput}
              onChange={(e) => setDailyLimitInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-blue-400 dark:focus:ring-blue-900/30 sm:w-52"
              placeholder="Enter daily limit"
            />
            <button
              type="button"
              onClick={handleSaveDailyLimit}
              className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus:ring-slate-700"
            >
              Save Daily Limit
            </button>
          </div>
        </div>
      </div>

      {/* Monthly stats */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Current Budget (Monthly)
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
            Remaining Balance (Monthly)
          </div>
          <div className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
            {formatCurrency(remaining)}
          </div>
        </div>
      </div>

      {/* Monthly alert */}
      <div
        className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${monthlyAlertStyles}`}
      >
        {monthlyStatus.message}
      </div>

      {/* Daily message */}
      <div
        className={`mt-3 rounded-2xl border px-4 py-3 text-sm ${dailyMessageTone}`}
      >
        <strong>Daily limit:</strong> {formatCurrency(dailyLimit)} •{" "}
        <strong>Today spent:</strong> {formatCurrency(todaySpending)}
        {dailyPercentUsed > 100 ? (
          <span className="ml-2 font-semibold">
            (Exceeded by {formatCurrency(todaySpending - dailyLimit)})
          </span>
        ) : dailyPercentUsed >= 80 ? (
          <span className="ml-2 font-semibold">
            (Used {Math.round(dailyPercentUsed)}%)
          </span>
        ) : null}
      </div>

      {/* Progress bar based on DAILY limit */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <span>Budget used (Daily limit)</span>
          <span>{Math.round(dailyPercentUsed)}%</span>
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
