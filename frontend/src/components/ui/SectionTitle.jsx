import React from "react";

/**
 * SectionTitle
 * Reusable title + optional subtitle block for sections/cards.
 *
 * Usage:
 *  <SectionTitle title="Expenses" subtitle="Track and manage your spending" />
 */
export default function SectionTitle({ title, subtitle, className = "" }) {
  return (
    <div className={["mb-3", className].join(" ")}>
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
