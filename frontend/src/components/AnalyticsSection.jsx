import React, { useMemo } from "react";
import useExpenses from "../hooks/useExpenses";

import ExpensePieChart from "../charts/ExpensePieChart";
import ExpenseBarChart from "../charts/ExpenseBarChart";
import ExpenseLineChart from "../charts/ExpenseLineChart";

import getCategoryChartData from "../utils/getCategoryChartData";
import getMonthlyTrendData from "../utils/getMonthlyTrendData";

import Card from "./ui/Card";
import SectionTitle from "./ui/SectionTitle";

export default function AnalyticsSection() {
  const { expenses } = useExpenses();

  const categoryData = useMemo(
    () => getCategoryChartData(expenses),
    [expenses],
  );
  const trendData = useMemo(() => getMonthlyTrendData(expenses), [expenses]);

  return (
    <section>
      <SectionTitle
        title="Expense Analytics"
        subtitle="Visual overview of spending by category and over time."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="p-5">
            <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
              Category Distribution
            </div>
            <ExpensePieChart data={categoryData} />
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
              Category Totals
            </div>
            <ExpenseBarChart data={categoryData} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="p-5">
            <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
              Spending Trend
            </div>
            <ExpenseLineChart data={trendData} />
          </div>
        </Card>
      </div>
    </section>
  );
}
