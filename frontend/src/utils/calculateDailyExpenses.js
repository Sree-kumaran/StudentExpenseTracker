/**
 * calculateDailyExpenses
 * - Sums expenses for the current LOCAL day (YYYY-MM-DD).
 * - This ensures daily limit resets at local midnight.
 */
function toLocalYYYYMMDD(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function calculateDailyExpenses(expenses = []) {
  const todayKey = toLocalYYYYMMDD(new Date());

  return expenses.reduce((sum, e) => {
    // Your UI stores date as "YYYY-MM-DD"
    const dateKey = String(e?.date || "");
    if (dateKey === todayKey) {
      return sum + (Number(e?.amount) || 0);
    }
    return sum;
  }, 0);
}