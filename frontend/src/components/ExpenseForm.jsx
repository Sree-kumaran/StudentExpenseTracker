import React, { useEffect, useMemo, useState } from "react";
import categories from "../data/categories";
import useExpenses from "../hooks/useExpenses";

/**
 * ExpenseForm (Increment 4 + 5)
 * - Add mode (default): creates a new expense
 * - Edit mode: if `editingExpense` is passed, pre-fills fields and saves via editExpense
 */
export default function ExpenseForm({ editingExpense, onCancelEdit, onSaved }) {
  const { addExpense, editExpense } = useExpenses();

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const isEditMode = Boolean(editingExpense?.id);

  // When user clicks "Edit" from the list, pre-fill the form
  useEffect(() => {
    if (!editingExpense) return;

    setTitle(editingExpense.title ?? "");
    setAmount(
      editingExpense.amount === undefined || editingExpense.amount === null
        ? ""
        : String(editingExpense.amount),
    );
    setCategory(editingExpense.category ?? "");
    setDate(editingExpense.date ?? today);

    setErrors({});
    setSuccess("");
  }, [editingExpense, today]);

  function validate() {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Title is required.";
    if (!amount || Number(amount) <= 0)
      nextErrors.amount = "Amount must be greater than 0.";
    if (!category) nextErrors.category = "Please select a category.";
    if (!date) nextErrors.date = "Please select a date.";
    return nextErrors;
  }

  function resetForm() {
    setTitle("");
    setAmount("");
    setCategory("");
    setDate(today);
    setErrors({});
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSuccess("");

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (isEditMode) {
      editExpense(editingExpense.id, {
        title: title.trim(),
        amount: Number(amount),
        category,
        date,
      });

      setSuccess("Expense updated!");
      onSaved?.(); // let App clear edit mode
      window.setTimeout(() => setSuccess(""), 1500);
      return;
    }

    // Add mode
    addExpense({
      id: String(Date.now()),
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
    });

    resetForm();
    setSuccess("Expense added!");
    window.setTimeout(() => setSuccess(""), 1500);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            {isEditMode ? "Edit Expense" : "Add Expense"}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {isEditMode
              ? "Update the selected expense and save changes."
              : "Enter details and submit to add a new expense."}
          </p>
        </div>

        {isEditMode ? (
          <button
            type="button"
            onClick={() => {
              onCancelEdit?.();
              setSuccess("");
              setErrors({});
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            Cancel
          </button>
        ) : null}
      </div>

      {success ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
          {success}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {/* Title */}
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((p) => ({ ...p, title: "" }));
            }}
            placeholder="e.g., Cafeteria lunch"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-slate-600 dark:focus:ring-slate-800"
          />
          {errors.title ? (
            <p className="mt-1 text-xs text-rose-600">{errors.title}</p>
          ) : null}
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Amount
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) setErrors((p) => ({ ...p, amount: "" }));
            }}
            placeholder="e.g., 12.50"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-slate-600 dark:focus:ring-slate-800"
          />
          {errors.amount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.amount}</p>
          ) : null}
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (errors.category) setErrors((p) => ({ ...p, category: "" }));
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-slate-600 dark:focus:ring-slate-800"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category ? (
            <p className="mt-1 text-xs text-rose-600">{errors.category}</p>
          ) : null}
        </div>

        {/* Date */}
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) setErrors((p) => ({ ...p, date: "" }));
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-slate-600 dark:focus:ring-slate-800"
          />
          {errors.date ? (
            <p className="mt-1 text-xs text-rose-600">{errors.date}</p>
          ) : null}
        </div>

        {/* Submit */}
        <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus:ring-slate-700"
          >
            {isEditMode ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </form>
    </section>
  );
}
