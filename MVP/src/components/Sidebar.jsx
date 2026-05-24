import React from "react";

/**
 * Sidebar
 * - Desktop: static left sidebar
 * - Mobile: slide-in drawer with overlay
 *
 * No routing yet => we keep a local "active" state in DashboardLayout,
 * but Sidebar still needs `activeItem` + `onSelect`.
 */
const items = [
  { key: "Dashboard", icon: "🏠" },
  { key: "Expenses", icon: "🧾" },
  { key: "Analytics", icon: "📊" },
  { key: "Budget", icon: "🎯" },
  { key: "Settings", icon: "⚙️" },
];

export default function Sidebar({ isOpen, onClose, activeItem, onSelect }) {
  // Drawer panel
  const panel = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800 lg:hidden">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Menu
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
        >
          ✕
        </button>
      </div>

      <nav className="p-3">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = activeItem === item.key;

            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect?.(item.key);
                    onClose?.(); // close drawer on mobile
                  }}
                  className={[
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-950"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900",
                  ].join(" ")}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.key}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto p-4 text-xs text-slate-500 dark:text-slate-400">
        MVP • No routing yet
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:block">
        {panel}
      </aside>

      {/* Mobile overlay + drawer */}
      <div
        className={[
          "fixed inset-0 z-50 lg:hidden",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        {/* Overlay */}
        <div
          onClick={onClose}
          className={[
            "absolute inset-0 bg-slate-950/40 transition-opacity",
            isOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* Drawer */}
        <div
          className={[
            "absolute left-0 top-0 h-full w-72 bg-white shadow-xl transition-transform",
            "dark:bg-slate-950",
            isOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          {panel}
        </div>
      </div>
    </>
  );
}
