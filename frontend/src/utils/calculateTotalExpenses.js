/**
 * calculateTotalExpenses
 * - Sums all expense amounts
 */
export default function calculateTotalExpenses(expenses = []) {
  return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
}

