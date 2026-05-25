import React, { useEffect, useMemo, useState } from "react";
import useExpenses from "../hooks/useExpenses";

import calculateMonthlyExpenses from "../utils/calculateMonthlyExpenses";
import calculateRemainingBudget from "../utils/calculateRemainingBudget";
import calculateDailyExpenses from "../utils/calculateDailyExpenses";
import getBudgetStatus from "../utils/getBudgetStatus";
import formatCurrency from "../utils/formatCurrency";

/**
 * BudgetTracker (MongoDB-backed)
 * - monthlyBudget + dailyLimit come from ExpenseContext (loaded from backend /api/settings)
 * - Saving monthly budget calls context setMonthlyBudget (PUT /api/settings)
 * - Saving daily limit calls context setDailyLimit (PUT /api/settings)
 * - Progress bar "Budget used" uses DAILY limit (todaySpending vs dailyLimit)
 * - Daily limit progress resets at local midnight via a timer (midnightTick)
 */
export default function BudgetTracker() {
  const {
    expenses,
    monthlyBudget,
    dailyLimit,
    setMonthlyBudget,
    setDailyLimit,
    loading,
    error,
    clearError,
  } = useExpenses();

  // Inputs (local UI state)
  const [budgetInput, setBudgetInput] = useState(String(monthlyBudget));
  const [dailyLimitInput, setDailyLimitInput] = useState(String(dailyLimit));

  // Used only to trigger recompute at midnight if app stays open
  const [midnightTick, setMidnightTick] = useState(0);

  // Keep inputs in sync when context loads settings from backend
  useEffect(() => {
    setBudgetInput(String(monthlyBudget));
  }, [monthlyBudget]);

  useEffect(() => {
    setDailyLimitInput(String(dailyLimit));
  }, [dailyLimit]);

  // Schedule a refresh at the next local midnight to reset "today spent" UI
  useEffect(() => {
    function msUntilNextMidnight() {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 0); // next local midnight
      return next.getTime() - now.getTime();
    }

    const timeout = window.setTimeout(() => {
      setMidnightTick((n) => n + 1);
    }, msUntilNextMidnight() + 50); // small buffer

    return () => window.clearTimeout(timeout);
  }, [midnightTick]);

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

  // IMPORTANT: midnightTick included so it resets at 12:00 AM even if no new expenses were added
  const todaySpending = useMemo(
    () => calculateDailyExpenses(expenses),
    [expenses, midnightTick],
  );

  // Daily usage percent (progress bar is based on dailyLimit)
  const dailyPercentUsed = useMemo(() => {
    if (!dailyLimit || dailyLimit <= 0) return 0;
    return (Number(todaySpending || 0) / Number(dailyLimit)) * 100;
  }, [todaySpending, dailyLimit]);

  const progressPercent = Math.min(100, Math.max(0, dailyPercentUsed));

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

  const monthlyAlertStyles =
    monthlyStatus.level === "exceeded"
      ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
      : monthlyStatus.level === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
        : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200";

  async function handleSaveMonthlyBudget() {
    clearError?.();

    const next = Number(budgetInput);
    if (!Number.isFinite(next) || next <= 0) return;

    try {
      await setMonthlyBudget(next);
    } catch {
      // error is already set in context
    }
  }

  async function handleSaveDailyLimit() {
    clearError?.();

    const next = Number(dailyLimitInput);
    if (!Number.isFinite(next) || next <= 0) return;

    try {
      await setDailyLimit(next);
    } catch {
      // error is already set in context
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Budget Tracker
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Monthly budget + daily limit are saved in MongoDB. Progress bar uses
            daily limit.
          </p>
        </div>

        {/* Inputs: Monthly budget + Daily limit */}
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
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleSaveMonthlyBudget}
              disabled={loading}
              className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus:ring-slate-700"
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
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleSaveDailyLimit}
              disabled={loading}
              className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus:ring-slate-700"
            >
              Save Daily Limit
            </button>
          </div>
        </div>
      </div>

      {/* Optional error banner */}
      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      ) : null}

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

      {/* Daily status message */}
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

      {/* Progress bar (daily) */}
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