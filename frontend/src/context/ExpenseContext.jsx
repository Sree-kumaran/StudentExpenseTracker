import React, { createContext, useEffect, useMemo, useState } from "react";
import dummyExpenses from "../data/dummyExpenses";

export const ExpenseContext = createContext(null);

const STORAGE_KEY = "student-expense-tracker:expenses";

function loadExpenses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    // ignore storage errors for MVP
  }
}

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState(
    () => loadExpenses() ?? dummyExpenses,
  );

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  /**
   * addExpense
   * - Increment 4 passes { id: Date.now(), title, amount, category, date }
   * - If an id isn't provided, we create one with Date.now()
   */
  function addExpense(expenseInput) {
    const newExpense = {
      id: expenseInput.id ? String(expenseInput.id) : String(Date.now()),
      title: expenseInput.title,
      amount: Number(expenseInput.amount),
      category: expenseInput.category,
      date: expenseInput.date,
    };

    setExpenses((prev) => [newExpense, ...prev]);
  }

  function deleteExpense(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

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

  const value = useMemo(
    () => ({ expenses, addExpense, deleteExpense, editExpense }),
    [expenses],
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}
