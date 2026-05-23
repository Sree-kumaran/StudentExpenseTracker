import React, { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext(null);

const STORAGE_KEY = "student-expense-tracker:theme";

/**
 * ThemeProvider
 * - Stores theme ("light" | "dark")
 * - Persists in localStorage
 * - Applies Tailwind "dark" mode using a class on <html>
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);

    // Tailwind dark mode via class strategy:
    // When <html class="dark"> exists => dark: utilities activate
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
