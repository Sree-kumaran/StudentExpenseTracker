import React, { createContext, useEffect, useMemo, useState } from "react";
import dummyExpenses from "../data/dummyExpenses";

export const ExpenseContext = createContext(null);

const EXPENSES_KEY = "student-expense-tracker:expenses";
const BUDGET_KEY = "student-expense-tracker:monthlyBudget";
const DEFAULT_BUDGET = 20000;

// --- Helpers (localStorage) ---
function safeParseJSON(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadExpenses() {
  const raw = localStorage.getItem(EXPENSES_KEY);
  if (!raw) return null;

  const parsed = safeParseJSON(raw);
  return Array.isArray(parsed) ? parsed : null;
}

function loadBudget() {
  const raw = localStorage.getItem(BUDGET_KEY);
  if (!raw) return null;

  const parsed = safeParseJSON(raw);
  const budget = Number(parsed);

  // Return null if invalid (so we fallback to default)
  if (!Number.isFinite(budget) || budget <= 0) return null;
  return budget;
}

export function ExpenseProvider({ children }) {
  // Expenses (Increment 3)
  const [expenses, setExpenses] = useState(
    () => loadExpenses() ?? dummyExpenses,
  );

  // Monthly Budget (Increment 8)
  const [monthlyBudget, setMonthlyBudgetState] = useState(
    () => loadBudget() ?? DEFAULT_BUDGET,
  );

  // Persist expenses whenever they change
  useEffect(() => {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }, [expenses]);

  // Persist monthly budget whenever it changes
  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(monthlyBudget));
  }, [monthlyBudget]);

  // --- CRUD ---
  function addExpense(expenseInput) {
    const newExpense = {
      id: expenseInput.id ? String(expenseInput.id) : String(Date.now()),
      title: expenseInput.title,
      amount: Number(expenseInput.amount),
      category: expenseInput.category,
      date: expenseInput.date, // expected "YYYY-MM-DD"
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

  /**
   * setMonthlyBudget
   * - Keep validation simple & beginner-friendly
   * - Only allow positive numbers
   */
  function setMonthlyBudget(nextBudget) {
    const budgetNumber = Number(nextBudget);
    if (!Number.isFinite(budgetNumber) || budgetNumber <= 0) return;
    setMonthlyBudgetState(budgetNumber);
  }

  const value = useMemo(
    () => ({
      expenses,
      addExpense,
      deleteExpense,
      editExpense,

      monthlyBudget,
      setMonthlyBudget,
    }),
    [expenses, monthlyBudget],
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}
