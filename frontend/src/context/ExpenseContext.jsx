import React, { createContext, useEffect, useMemo, useState } from "react";
import dummyExpenses from "../data/dummyExpenses";

/**
 * ExpenseContext
 * - Stores global expense state
 * - Provides CRUD actions (add/edit/delete)
 * - Persists expenses to localStorage
 */
export const ExpenseContext = createContext(null);

const STORAGE_KEY = "student-expense-tracker:expenses";

/** Safely load from localStorage (returns null if missing/invalid). */
function loadExpensesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Safely save to localStorage. */
function saveExpensesToStorage(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    // In private mode / quota errors, saving may fail; ignore for MVP.
  }
}

export function ExpenseProvider({ children }) {
  // Initialize from localStorage first; otherwise use dummy data on first run.
  const [expenses, setExpenses] = useState(() => {
    const fromStorage = loadExpensesFromStorage();
    return fromStorage ?? dummyExpenses;
  });

  // Persist anytime expenses change.
  useEffect(() => {
    saveExpensesToStorage(expenses);
  }, [expenses]);

  /** Add an expense */
  function addExpense(expenseInput) {
    const newExpense = {
      // Prefer crypto.randomUUID; fall back to timestamp-based id for older browsers.
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: expenseInput.title,
      amount: Number(expenseInput.amount),
      category: expenseInput.category,
      // Recommended: store dates as ISO "YYYY-MM-DD"
      date: expenseInput.date,
    };

    setExpenses((prev) => [newExpense, ...prev]);
  }

  /** Delete by id */
  function deleteExpense(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  /** Edit by id (partial updates) */
  function editExpense(id, updates) {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              ...updates,
              amount:
                updates.amount === undefined
                  ? e.amount
                  : Number(updates.amount),
            }
          : e,
      ),
    );
  }

  // Memoize to avoid unnecessary re-renders.
  const value = useMemo(
    () => ({
      expenses,
      addExpense,
      deleteExpense,
      editExpense,
    }),
    [expenses],
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}
