import React, { useEffect, useMemo, useState } from "react";
import categories from "../data/categories";
import useExpenses from "../hooks/useExpenses";
import Card from "./ui/Card";
import Button from "./ui/Button";
import SectionTitle from "./ui/SectionTitle";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-rose-600">{message}</p>;
}

export default function ExpenseForm({ editingExpense, onCancelEdit, onSaved }) {
  const { addExpense, editExpense } = useExpenses();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const isEditMode = Boolean(editingExpense?.id);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

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
    const next = {};
    if (!title.trim()) next.title = "Title is required.";
    if (!amount || Number(amount) <= 0) next.amount = "Amount must be > 0.";
    if (!category) next.category = "Please select a category.";
    if (!date) next.date = "Please select a date.";
    return next;
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
      onSaved?.();
      window.setTimeout(() => setSuccess(""), 1500);
      return;
    }

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
    <Card>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <SectionTitle
            title={isEditMode ? "Edit Expense" : "Add Expense"}
            subtitle={
              isEditMode
                ? "Update the selected expense and save changes."
                : "Add a new expense to your tracker."
            }
          />

          {isEditMode ? (
            <Button
              variant="ghost"
              onClick={() => {
                onCancelEdit?.();
                setErrors({});
                setSuccess("");
              }}
              className="px-3"
            >
              Cancel
            </Button>
          ) : null}
        </div>

        {success ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
            {success}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {/* Title */}
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cafeteria lunch"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
            />
            <FieldError message={errors.title} />
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Amount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 120"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
            />
            <FieldError message={errors.amount} />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <FieldError message={errors.category} />
          </div>

          {/* Date */}
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
            />
            <FieldError message={errors.date} />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row">
            <Button type="submit" className="w-full">
              {isEditMode ? "Save Changes" : "Add Expense"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
