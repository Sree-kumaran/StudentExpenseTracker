import React, { createContext, useEffect, useMemo, useState } from "react";

export const ExpenseContext = createContext(null);

// Defaults (used only if backend is unavailable)
const DEFAULT_BUDGET = 20000;
const DEFAULT_DAILY_LIMIT = 500;

/**
 * IMPORTANT:
 * - Backend returns Mongo docs with `_id`
 * - Your UI expects `id`
 * So we normalize: `_id -> id` when reading from backend.
 */
function normalizeExpenseFromServer(doc) {
  if (!doc) return null;

  // Convert Mongo Date -> "YYYY-MM-DD" for inputs + sorting consistency
  const dateStr = doc.date ? new Date(doc.date).toISOString().slice(0, 10) : "";

  return {
    id: String(doc._id ?? doc.id ?? ""),
    title: doc.title ?? "",
    amount: Number(doc.amount || 0),
    category: doc.category ?? "",
    date: dateStr,
  };
}

function apiUrl(path) {
  // If you create frontend/.env with VITE_API_URL, it will use that.
  // Fallback: localhost:5000
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${base}${path}`;
}

async function apiFetch(path, options = {}) {
  const res = await fetch(apiUrl(path), {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  // If backend returns an error, show a useful message
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(msg);
  }

  // Some DELETE routes may return empty body; handle gracefully
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export function ExpenseProvider({ children }) {
  // App state
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setMonthlyBudgetState] = useState(DEFAULT_BUDGET);
  const [dailyLimit, setDailyLimitState] = useState(DEFAULT_DAILY_LIMIT);

  // Basic app status (helps prevent crashes + allows UI improvements later)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Load initial data from backend on startup:
   * - GET /api/expenses
   * - GET /api/settings
   */
  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      setLoading(true);
      setError("");

      try {
        const [expenseDocs, settingsDoc] = await Promise.all([
          apiFetch("/api/expenses"),
          apiFetch("/api/settings"),
        ]);

        if (cancelled) return;

        const normalized = Array.isArray(expenseDocs)
          ? expenseDocs.map(normalizeExpenseFromServer).filter(Boolean)
          : [];

        setExpenses(normalized);

        // settingsDoc contains monthlyBudget + dailyLimit
        if (settingsDoc?.monthlyBudget) {
          setMonthlyBudgetState(Number(settingsDoc.monthlyBudget));
        } else {
          setMonthlyBudgetState(DEFAULT_BUDGET);
        }

        if (settingsDoc?.dailyLimit) {
          setDailyLimitState(Number(settingsDoc.dailyLimit));
        } else {
          setDailyLimitState(DEFAULT_DAILY_LIMIT);
        }
      } catch (err) {
        if (cancelled) return;

        // Backend may be down; keep app usable with defaults
        console.error("[ExpenseProvider] Initial load failed:", err.message);
        setError(err.message || "Failed to load data from server.");

        setExpenses([]); // fallback
        setMonthlyBudgetState(DEFAULT_BUDGET);
        setDailyLimitState(DEFAULT_DAILY_LIMIT);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInitial();

    return () => {
      cancelled = true;
    };
  }, []);

  // --------------------
  // Expense CRUD (API)
  // --------------------

  async function addExpense(expenseInput) {
    // We do not generate id in frontend anymore; MongoDB will create _id.
    const payload = {
      title: expenseInput.title,
      amount: Number(expenseInput.amount),
      category: expenseInput.category,
      date: expenseInput.date, // "YYYY-MM-DD" is OK; backend converts to Date
    };

    try {
      const createdDoc = await apiFetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const created = normalizeExpenseFromServer(createdDoc);
      if (!created) return;

      // Add on top
      setExpenses((prev) => [created, ...prev]);
    } catch (err) {
      console.error("[addExpense] Failed:", err.message);
      setError(err.message || "Failed to add expense.");
      throw err;
    }
  }

  async function editExpense(id, updates) {
    const payload = {};

    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.amount !== undefined) payload.amount = Number(updates.amount);
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.date !== undefined) payload.date = updates.date;

    try {
      const updatedDoc = await apiFetch(`/api/expenses/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const updated = normalizeExpenseFromServer(updatedDoc);
      if (!updated) return;

      setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (err) {
      console.error("[editExpense] Failed:", err.message);
      setError(err.message || "Failed to update expense.");
      throw err;
    }
  }

  async function deleteExpense(id) {
    try {
      await apiFetch(`/api/expenses/${id}`, { method: "DELETE" });
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("[deleteExpense] Failed:", err.message);
      setError(err.message || "Failed to delete expense.");
      throw err;
    }
  }

  // --------------------
  // Settings (budget/dailyLimit)
  // --------------------

  /**
   * Single API call that can update monthlyBudget and/or dailyLimit.
   */
  async function updateSettings(next) {
    const payload = {};
    if (next.monthlyBudget !== undefined)
      payload.monthlyBudget = Number(next.monthlyBudget);
    if (next.dailyLimit !== undefined)
      payload.dailyLimit = Number(next.dailyLimit);

    try {
      const settingsDoc = await apiFetch("/api/settings", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (settingsDoc?.monthlyBudget !== undefined) {
        setMonthlyBudgetState(Number(settingsDoc.monthlyBudget));
      }
      if (settingsDoc?.dailyLimit !== undefined) {
        setDailyLimitState(Number(settingsDoc.dailyLimit));
      }
    } catch (err) {
      console.error("[updateSettings] Failed:", err.message);
      setError(err.message || "Failed to update settings.");
      throw err;
    }
  }

  async function setMonthlyBudget(nextBudget) {
    const n = Number(nextBudget);
    if (!Number.isFinite(n) || n <= 0) return;
    await updateSettings({ monthlyBudget: n });
  }

  async function setDailyLimit(nextDailyLimit) {
    const n = Number(nextDailyLimit);
    if (!Number.isFinite(n) || n <= 0) return;
    await updateSettings({ dailyLimit: n });
  }

  const value = useMemo(
    () => ({
      // data
      expenses,
      monthlyBudget,
      dailyLimit,

      // status (optional to use in UI)
      loading,
      error,
      clearError: () => setError(""),

      // actions
      addExpense,
      editExpense,
      deleteExpense,
      updateSettings,
      setMonthlyBudget,
      setDailyLimit,
    }),
    [expenses, monthlyBudget, dailyLimit, loading, error],
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}
