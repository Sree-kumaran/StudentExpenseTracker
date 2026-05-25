import React, { useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import DashboardSummary from "./components/DashboardSummary";
import BudgetTracker from "./components/BudgetTracker";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import AnalyticsSection from "./components/AnalyticsSection";
import ExportSection from "./components/ExportSection";
import Footer from "./components/Footer";

export default function App() {
  const [editingExpense, setEditingExpense] = useState(null);

  return (
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

        <ExportSection />

        <Footer />
      </DashboardLayout>
  );
}
