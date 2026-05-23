import React from "react";

const MENU = [
  { key: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { key: "expenses", label: "Expenses", icon: ExpensesIcon },
  { key: "analytics", label: "Analytics", icon: AnalyticsIcon },
  { key: "budget", label: "Budget", icon: BudgetIcon },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

/**
 * Sidebar
 * - Desktop: fixed left sidebar
 * - Mobile: slides in as an overlay drawer
 * - Highlights active menu item
 */
export default function Sidebar({ activeKey, onChange, mobileOpen, onClose }) {
  const Nav = (
    <nav className="px-3 py-4">
      <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Menu
      </div>

      <ul className="space-y-1">
        {MENU.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey;

          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => {
                  onChange?.(item.key);
                  onClose?.();
                }}
                className={
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition " +
                  (isActive
                    ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900")
                }
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={
                    "h-5 w-5 " +
                    (isActive
                      ? "text-white dark:text-slate-900"
                      : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200")
                  }
                />
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
        <div className="font-medium text-slate-900 dark:text-slate-50">Tip</div>
        <div className="mt-1 leading-relaxed">
          This MVP keeps everything on one page. Later you can add routing per
          menu item.
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white/60 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 md:block">
        {Nav}
      </aside>

      {/* Mobile overlay + drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal>
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            onClick={onClose}
            aria-label="Close menu"
          />

          {/* Drawer */}
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Navigation
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                aria-label="Close menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
            {Nav}
          </aside>
        </div>
      ) : null}
    </>
  );
}

/* ---------- Simple inline icons (no dependency) ---------- */
function DashboardIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 13h8V3H3v10z" />
      <path d="M13 21h8V11h-8v10z" />
      <path d="M13 3h8v6h-8V3z" />
      <path d="M3 21h8v-6H3v6z" />
    </svg>
  );
}

function ExpensesIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 1v22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function AnalyticsIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 14l3-3 4 4 6-8" />
    </svg>
  );
}

function BudgetIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function SettingsIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 15a7.7 7.7 0 0 0 .1-2l2-1.5-2-3.5-2.4.8a7.3 7.3 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7.3 7.3 0 0 0-1.7 1L4.5 8l-2 3.5L4.5 13a7.7 7.7 0 0 0 .1 2l-2 1.5 2 3.5 2.4-.8a7.3 7.3 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7.3 7.3 0 0 0 1.7-1l2.4.8 2-3.5-2-1.5z" />
    </svg>
  );
}
