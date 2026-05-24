/**
 * Returns how much of the budget has been used.
 * Example:
 *  calculateBudgetUsage(20000, 8500) => { percentUsed: 42.5, used: 8500, budget: 20000 }
 */
export default function calculateBudgetUsage(budget, spending) {
  const b = Number(budget || 0);
  const s = Number(spending || 0);

  const percentUsed = b > 0 ? (s / b) * 100 : 0;

  return {
    budget: b,
    used: s,
    percentUsed,
  };
}
