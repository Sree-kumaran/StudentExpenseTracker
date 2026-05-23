/**
 * Converts expenses into a daily spending trend for the Line chart.
 * Groups by date (YYYY-MM-DD) and sums amounts.
 *
 * Output example:
 * [
 *  { date: "2026-05-01", amount: 300 },
 *  { date: "2026-05-02", amount: 120 }
 * ]
 */
export default function getMonthlyTrendData(expenses) {
  const perDay = {};

  for (const e of expenses) {
    if (!e?.date) continue;
    const dateKey = String(e.date); // expected YYYY-MM-DD
    const amount = Number(e?.amount || 0);

    perDay[dateKey] = (perDay[dateKey] || 0) + amount;
  }

  return Object.entries(perDay)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
