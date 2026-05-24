import React, { useMemo, useState } from "react";
import useExpenses from "../hooks/useExpenses";
import exportToCSV from "../utils/exportToCSV";
import exportToPDF from "../utils/exportToPDF";

import Card from "./ui/Card";
import Button from "./ui/Button";
import SectionTitle from "./ui/SectionTitle";
import calculateTotalExpenses from "../utils/calculateTotalExpenses";
import formatCurrency from "../utils/formatCurrency";

/**
 * ExportSection
 * - CSV + PDF export
 * - Shows simple success message (beginner-friendly)
 */
export default function ExportSection() {
  const { expenses } = useExpenses();
  const [message, setMessage] = useState("");

  const total = useMemo(() => calculateTotalExpenses(expenses), [expenses]);

  function showTempMessage(text) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 1800);
  }

  return (
    <Card>
      <div className="p-5">
        <SectionTitle
          title="Export Reports"
          subtitle="Download your expenses as CSV or PDF for sharing or backup."
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-700 dark:text-slate-200">
            <div>
              <span className="font-semibold">Records:</span> {expenses.length}
            </div>
            <div>
              <span className="font-semibold">Total:</span>{" "}
              {formatCurrency(total)}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="ghost"
              onClick={() => {
                exportToCSV(expenses, "expenses-report.csv");
                showTempMessage("CSV downloaded.");
              }}
              disabled={expenses.length === 0}
              className="px-4"
            >
              ⬇️ Export CSV
            </Button>

            <Button
              onClick={() => {
                exportToPDF(expenses, {
                  filename: "expenses-report.pdf",
                  appTitle: "Student Expense Tracker",
                });
                showTempMessage("PDF downloaded.");
              }}
              disabled={expenses.length === 0}
              className="px-4"
            >
              📄 Export PDF
            </Button>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
            No expenses added yet. Add an expense to enable export.
          </div>
        ) : null}

        {message ? (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
            {message}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
