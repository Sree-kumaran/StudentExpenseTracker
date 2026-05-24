import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-slate-200 py-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
      <div className="font-semibold text-slate-800 dark:text-slate-100">
        Student Expense Tracker — {year}
      </div>
      <div className="mt-1">Manage your spending smarter.</div>
    </footer>
  );
}
