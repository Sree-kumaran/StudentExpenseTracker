import React from "react";

/**
 * Navbar
 * - Sticky top bar
 * - App title on the left
 * - Avatar placeholder on the right
 * - Tailwind-only styling
 */
export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile: hamburger to toggle sidebar */}
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white md:hidden"
            aria-label="Open menu"
          >
            {/* Simple hamburger icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>

          <h1 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-lg">
            Student Expense Tracker
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="flex items-center gap-3">
            <div className="hidden text-sm text-slate-600 dark:text-slate-300 sm:block">
              Student
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 ring-1 ring-slate-200 dark:from-slate-800 dark:to-slate-700 dark:ring-slate-800" />
          </div>
        </div>
      </div>
    </header>
  );
}
