import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";

import DashboardLayout from "./components/DashboardLayout";
import DashboardSummary from "./components/DashboardSummary";
import BudgetTracker from "./components/BudgetTracker";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import AnalyticsSection from "./components/AnalyticsSection";

export default function App() {
  const [editingExpense, setEditingExpense] = useState(null);

  return (
    <ThemeProvider>
      <DashboardLayout>
        <DashboardSummary />
        <BudgetTracker />

        <ExpenseForm
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
          onSaved={() => setEditingExpense(null)}
        />

        <ExpenseList onEdit={(expense) => setEditingExpense(expense)} />

        <AnalyticsSection />
      </DashboardLayout>
    </ThemeProvider>
  );
}
