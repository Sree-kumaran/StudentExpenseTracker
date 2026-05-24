import React from "react";

export default function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        "transition hover:shadow-md",
        "dark:border-slate-800 dark:bg-slate-950",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
