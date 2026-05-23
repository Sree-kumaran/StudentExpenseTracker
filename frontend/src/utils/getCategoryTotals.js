/**
 * getCategoryTotals
 * - Returns an object like: { Food: 20, Transport: 10, ... }
 */
export default function getCategoryTotals(expenses = []) {
  return expenses.reduce((totals, e) => {
    const key = e.category || "Uncategorized";
    const amount = Number(e.amount) || 0;

    totals[key] = (totals[key] || 0) + amount;
    return totals;
  }, {});
}
