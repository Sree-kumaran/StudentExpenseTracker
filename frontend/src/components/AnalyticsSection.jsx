import React, { useMemo } from "react";
import useExpenses from "../hooks/useExpenses";

import ExpensePieChart from "../charts/ExpensePieChart";
import ExpenseBarChart from "../charts/ExpenseBarChart";
import ExpenseLineChart from "../charts/ExpenseLineChart";

import getCategoryChartData from "../utils/getCategoryChartData";
import getMonthlyTrendData from "../utils/getMonthlyTrendData";

/**
 * AnalyticsSection (Increment 7)
 * - Pulls expenses from context (via useExpenses)
 * - Builds chart-friendly data using utility functions
 * - Displays charts in responsive Tailwind "card" layout
 */
export default function AnalyticsSection() {
  const { expenses } = useExpenses();

  const categoryData = useMemo(
    () => getCategoryChartData(expenses),
    [expenses],
  );
  const trendData = useMemo(() => getMonthlyTrendData(expenses), [expenses]);

  return (
    <section className="mt-6">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
          Expense Analytics
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Visual overview of spending by category and over time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Pie */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Category Distribution
          </div>
          <ExpensePieChart data={categoryData} />
        </div>

        {/* Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Category Totals
          </div>
          <ExpenseBarChart data={categoryData} />
        </div>

        {/* Line (full width on large screens) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950 lg:col-span-2">
          <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Spending Trend
          </div>
          <ExpenseLineChart data={trendData} />
        </div>
      </div>
    </section>
  );
}
