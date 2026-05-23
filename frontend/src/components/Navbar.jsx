import React from "react";
import useTheme from "../hooks/useTheme";
import Button from "./ui/Button";

/**
 * Navbar
 * - Sticky
 * - Theme toggle
 * - Mobile menu button (hamburger)
 */
export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        {/* Left */}
        <div className="flex items-center gap-2">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 lg:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="flex flex-col">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Student Expense Tracker
            </div>
            <div className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              Track expenses • Budget smarter
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={toggleTheme} className="px-3">
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </Button>

          {/* Avatar placeholder */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            S
          </div>
        </div>
      </div>
    </header>
  );
}
