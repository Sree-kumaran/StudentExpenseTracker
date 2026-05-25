/**
 * Calculates today's total spending.
 * Assumes expense.date is "YYYY-MM-DD".
 */
export default function calculateDailyExpenses(expenses, now = new Date()) {
  const todayKey = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

  return expenses.reduce((sum, e) => {
    if (!e?.date) return sum;
    if (String(e.date) !== todayKey) return sum;
    return sum + Number(e.amount || 0);
  }, 0);
}
