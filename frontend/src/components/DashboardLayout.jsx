import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

/**
 * DashboardLayout
 * - Manages mobile sidebar open/close
 * - Manages active nav item highlight (no routing yet)
 */
export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-900 dark:text-slate-50">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="mx-auto flex max-w-7xl">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeItem={activeItem}
          onSelect={(key) => setActiveItem(key)}
        />

        <main className="w-full p-4 sm:p-6">
          {/* Page container */}
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
