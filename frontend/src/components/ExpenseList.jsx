import React, { useMemo, useState } from "react";
import useExpenses from "../hooks/useExpenses";
import categories from "../data/categories";
import formatCurrency from "../utils/formatCurrency";

/**
 * ExpenseList (Increment 5)
 * - Displays expenses from global context
 * - Supports filtering + sorting (simple, beginner-friendly)
 * - Emits "onEdit(expense)" to let parent (App) switch the form into edit mode
 */
export default function ExpenseList({ onEdit }) {
  const { expenses, deleteExpense } = useExpenses();

  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date_desc"); // default: newest first

  function handleDelete(id) {
    const ok = window.confirm("Delete this expense? This cannot be undone.");
    if (!ok) return;
    deleteExpense(id);
    // localStorage updates automatically via ExpenseContext effect
  }

  const visibleExpenses = useMemo(() => {
    let list = [...expenses];

    // Filter
    if (filterCategory !== "All") {
      list = list.filter((e) => e.category === filterCategory);
    }

    // Sort
    switch (sortBy) {
      case "date_asc":
        list.sort((a, b) => String(a.date).localeCompare(String(b.date)));
        break;
      case "date_desc":
        list.sort((a, b) => String(b.date).localeCompare(String(a.date)));
        break;
      case "amount_asc":
        list.sort((a, b) => Number(a.amount) - Number(b.amount));
        break;
      case "amount_desc":
        list.sort((a, b) => Number(b.amount) - Number(a.amount));
        break;
      case "category_asc":
        list.sort((a, b) =>
          String(a.category).localeCompare(String(b.category)),
        );
        break;
      default:
        break;
    }

    return list;
  }, [expenses, filterCategory, sortBy]);

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Expenses
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {visibleExpenses.length} shown / {expenses.length} total
          </p>
        </div>

        {/* Filter + Sort */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 dark:text-slate-300">
              Filter
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-slate-600 dark:focus:ring-slate-800"
            >
              <option value="All">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 dark:text-slate-300">
              Sort
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-slate-600 dark:focus:ring-slate-800"
            >
              <option value="date_desc">Date: Newest</option>
              <option value="date_asc">Date: Oldest</option>
              <option value="amount_desc">Amount: High → Low</option>
              <option value="amount_asc">Amount: Low → High</option>
              <option value="category_asc">Category: A → Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {visibleExpenses.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          No expenses found for the selected filter.
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3">
          {visibleExpenses.map((e) => (
            <div
              key={e.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                {/* Main info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {e.title}
                    </h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      {e.category}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        Amount:
                      </span>{" "}
                      {formatCurrency(Number(e.amount))}
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        Date:
                      </span>{" "}
                      {e.date}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit?.(e)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(e.id)}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200 dark:hover:bg-rose-950/50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
