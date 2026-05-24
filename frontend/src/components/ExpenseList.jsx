import React, { useMemo, useState } from "react";
import useExpenses from "../hooks/useExpenses";
import categories from "../data/categories";
import formatCurrency from "../utils/formatCurrency";

import Card from "./ui/Card";
import Button from "./ui/Button";
import SectionTitle from "./ui/SectionTitle";

export default function ExpenseList({ onEdit }) {
  const { expenses, deleteExpense } = useExpenses();

  // New: search input
  const [search, setSearch] = useState("");

  // Existing: filter + sort
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date_desc");

  function handleDelete(id) {
    const ok = window.confirm("Delete this expense? This cannot be undone.");
    if (!ok) return;
    deleteExpense(id);
  }

  const visibleExpenses = useMemo(() => {
    let list = Array.isArray(expenses) ? [...expenses] : [];

    // Search by title
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((e) =>
        String(e?.title || "")
          .toLowerCase()
          .includes(q),
      );
    }

    // Filter by category
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
  }, [expenses, search, filterCategory, sortBy]);

  const hasExpenses = Array.isArray(expenses) && expenses.length > 0;

  return (
    <Card>
      <div className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            title="Expenses"
            subtitle={`${visibleExpenses.length} shown / ${expenses.length} total`}
          />

          {/* Controls */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {/* Search */}
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Search
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
              >
                <option value="All">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Sort
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
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

        {/* Empty states */}
        {!hasExpenses ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
            <div className="text-3xl">🧾</div>
            <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
              No expenses added yet.
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Add your first expense to start tracking.
            </div>
          </div>
        ) : visibleExpenses.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
            <div className="text-3xl">🔎</div>
            <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
              No results found.
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Try clearing search/filter to see more expenses.
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3">
            {visibleExpenses.map((e) => (
              <div
                key={e.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {e.title}
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                        {e.category}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
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

                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => onEdit?.(e)}
                      className="px-3"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(e.id)}
                      className="px-3"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
