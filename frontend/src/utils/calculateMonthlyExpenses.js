/**
 * Returns the total spending for the current month.
 * Assumes expense.date is stored as "YYYY-MM-DD" (from <input type="date" />).
 */
export default function calculateMonthlyExpenses(expenses, now = new Date()) {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  return expenses.reduce((sum, expense) => {
    if (!expense?.date) return sum;

    const d = new Date(expense.date);
    const isSameMonth =
      d.getFullYear() === currentYear && d.getMonth() === currentMonth;

    if (!isSameMonth) return sum;

    return sum + Number(expense.amount || 0);
  }, 0);
}
