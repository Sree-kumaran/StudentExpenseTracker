/**
 * Simple API helper for the Student Expense Tracker frontend.
 *
 * Usage:
 *   import { apiFetch } from "../utils/api";
 *   const expenses = await apiFetch("/api/expenses");
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function apiUrl(path) {
  return `${BASE_URL}${path}`;
}

/**
 * apiFetch
 * - wraps fetch()
 * - sets JSON headers by default
 * - throws a readable Error message on non-2xx responses
 * - safely handles empty response bodies (e.g., DELETE)
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(apiUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    // Try to read server JSON error message: { message: "..." }
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  // Some endpoints might return empty body (like DELETE)
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
```*
