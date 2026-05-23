import React, { useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import DashboardSummary from "./components/DashboardSummary";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import AnalyticsSection from "./components/AnalyticsSection";

export default function App() {
  const [editingExpense, setEditingExpense] = useState(null);

  return (
    <DashboardLayout>
      <DashboardSummary />

      <div className="mt-6">
        <ExpenseForm
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
          onSaved={() => setEditingExpense(null)}
        />
      </div>

      <ExpenseList onEdit={(expense) => setEditingExpense(expense)} />

      <AnalyticsSection />
    </DashboardLayout>
  );
}
