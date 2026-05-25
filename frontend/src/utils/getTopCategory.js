/**
 * Finds the category with the highest total spending.
 * Returns an object for flexibility:
 *  { category: "Food", total: 1234 }
 *
 * If no expenses exist, returns:
 *  { category: "—", total: 0 }
 */
export default function getTopCategory(expenses) {
  const totals = {};

  for (const e of expenses) {
    const category = e?.category || "Other";
    const amount = Number(e?.amount || 0);

    totals[category] = (totals[category] || 0) + amount;
  }

  let topCategory = "—";
  let topTotal = 0;

  for (const [cat, total] of Object.entries(totals)) {
    if (total > topTotal) {
      topCategory = cat;
      topTotal = total;
    }
  }

  return { category: topCategory, total: topTotal };
}
