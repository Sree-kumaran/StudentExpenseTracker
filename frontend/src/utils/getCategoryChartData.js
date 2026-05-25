/**
 * Converts expenses into category totals for charts.
 * Output example:
 * [
 *   { name: "Food", value: 1200 },
 *   { name: "Transport", value: 500 }
 * ]
 */
export default function getCategoryChartData(expenses) {
  const totals = {};

  for (const e of expenses) {
    const category = e?.category || "Other";
    const amount = Number(e?.amount || 0);
    totals[category] = (totals[category] || 0) + amount;
  }

  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
