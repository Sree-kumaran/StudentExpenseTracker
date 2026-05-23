import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

/**
 * DashboardLayout
 * - Wraps the whole app shell (Navbar + Sidebar + main content)
 * - Manages mobile sidebar open/close + active menu state
 * - Accepts children to render inside the main content area
 */
export default function DashboardLayout({ children }) {
  const [activeKey, setActiveKey] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar onMenuClick={() => setMobileOpen(true)} />

      {/* Body: sidebar + content */}
      <div className="mx-auto flex max-w-7xl">
        <Sidebar
          activeKey={activeKey}
          onChange={setActiveKey}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {/* Optional page header (kept minimal) */}
          <div className="mb-6">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {activeKey}
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">
              Dashboard
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
