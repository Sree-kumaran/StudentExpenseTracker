import React from "react";

const variants = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-300 " +
    "dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus:ring-slate-700",

  ghost:
    "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200 " +
    "dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 dark:hover:bg-slate-900 dark:focus:ring-slate-800",

  danger:
    "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-300 " +
    "dark:focus:ring-rose-900/40",
};

export default function Button({
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        // Make it unmistakably button-like:
        "inline-flex items-center justify-center gap-2",
        "rounded-xl px-4 py-2 text-sm font-semibold",
        "shadow-sm transition",
        "cursor-pointer select-none",
        "focus:outline-none focus:ring-2",
        "active:translate-y-[1px]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-inherit",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}
