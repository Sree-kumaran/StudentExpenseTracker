import React from "react";
import DashboardLayout from "./components/DashboardLayout";

import useExpenses from "./hooks/useExpenses";
import calculateTotalExpenses from "./utils/calculateTotalExpenses";
import formatCurrency from "./utils/formatCurrency";

export default function App() {
  const { expenses } = useExpenses();

  const total = calculateTotalExpenses(expenses);

  return (
    <DashboardLayout>
      {/* Increment 3 temporary UI testing (no styling focus required) */}
      <div>
        <h2>Increment 3: Expense State Test</h2>

        <p>
          <strong>Expense count:</strong> {expenses.length}
        </p>

        <p>
          <strong>Total expenses:</strong> {formatCurrency(total)}
        </p>

        <h3>All expense titles</h3>
        <ul>
          {expenses.map((e) => (
            <li key={e.id}>{e.title}</li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
}
